/**
 * INTI - Insta Nexus Type Indicator
 * 核心逻辑：渲染、计分、匹配、结果
 *
 * 架构灵感来自 SBTI 项目 (https://github.com/hanyanshuo/SBTI)
 * 包括：数据/逻辑/样式分离、L/M/H 模板匹配算法、模块化文件结构
 */

import { POSTERS } from "../data/posters.js";
import {
  DIMENSIONS,
  DIMENSION_FEEDBACK,
  DIMENSION_ORDER,
  QUESTIONS,
  TYPE_DETAILS,
  TYPE_PATTERNS,
} from "../data/quiz-data.js";

const state = {
  shuffledQuestions: [],
  answers: {},
};

const screens = {
  intro: document.getElementById("intro"),
  test: document.getElementById("test"),
  result: document.getElementById("result"),
};

const refs = {
  questionList: document.getElementById("questionList"),
  progressBar: document.getElementById("progressBar"),
  progressText: document.getElementById("progressText"),
  submitBtn: document.getElementById("submitBtn"),
  testHint: document.getElementById("testHint"),
  posterBox: document.getElementById("posterBox"),
  posterImage: document.getElementById("posterImage"),
  resultModeKicker: document.getElementById("resultModeKicker"),
  resultTypeName: document.getElementById("resultTypeName"),
  matchBadge: document.getElementById("matchBadge"),
  resultTypeSub: document.getElementById("resultTypeSub"),
  resultDesc: document.getElementById("resultDesc"),
  resultRecommend: document.getElementById("resultRecommend"),
  dimList: document.getElementById("dimList"),
  startBtn: document.getElementById("startBtn"),
  submitBtn: document.getElementById("submitBtn"),
  restartBtn: document.getElementById("restartBtn"),
  buyBtn: document.getElementById("buyBtn"),
  shareBtn: document.getElementById("shareBtn"),
};

function showScreen(name) {
  Object.entries(screens).forEach(([screenName, element]) => {
    element.classList.toggle("active", screenName === name);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function shuffle(items) {
  const cloned = [...items];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function pickQuestions() {
  // 每个维度随机抽 2 题，共 10 题
  const picked = [];
  for (const dim of DIMENSION_ORDER) {
    const dimQuestions = QUESTIONS.filter((q) => q.dim === dim);
    const shuffled = shuffle(dimQuestions);
    picked.push(...shuffled.slice(0, 2));
  }
  return shuffle(picked);
}

function renderQuestions() {
  const questions = state.shuffledQuestions;
  refs.questionList.innerHTML = "";

  questions.forEach((question, index) => {
    const article = document.createElement("article");
    article.className = "question";
    article.innerHTML = `
      <div class="question-meta">
        <div class="badge">第 ${index + 1} 题</div>
        <div>${DIMENSIONS[question.dim].name}</div>
      </div>
      <div class="question-title">${question.text}</div>
      <div class="options">
        ${question.options
          .map((option, oi) => {
            const code = ["A", "B", "C", "D"][oi] ?? `${oi + 1}`;
            const checked = state.answers[question.id] === option.value ? "checked" : "";
            return `
              <label class="option">
                <input type="radio" name="${question.id}" value="${option.value}" ${checked} />
                <div class="option-code">${code}</div>
                <div>${option.text}</div>
              </label>
            `;
          })
          .join("")}
      </div>
    `;
    refs.questionList.appendChild(article);
  });

  refs.questionList
    .querySelectorAll('input[type="radio"]')
    .forEach((input) => {
      input.addEventListener("change", (e) => {
        state.answers[e.target.name] = Number(e.target.value);
        updateProgress();
      });
    });

  updateProgress();
}

function updateProgress() {
  const questions = state.shuffledQuestions;
  const total = questions.length;
  const answered = questions.filter((q) => state.answers[q.id] !== undefined).length;
  const percent = total > 0 ? (answered / total) * 100 : 0;
  const isComplete = total > 0 && answered === total;

  refs.progressBar.style.width = `${percent}%`;
  refs.progressText.textContent = `${answered} / ${total}`;
  refs.submitBtn.disabled = !isComplete;
  refs.testHint.textContent = isComplete
    ? "都做完了。现在把你的影像魂魄交给结果页审判。"
    : "全选完才会放行。认真点，这关系到你的人生装备。";
}

function scoreToLevel(score) {
  if (score <= 3) return "L";
  if (score === 4) return "M";
  return "H";
}

function levelToWeight(level) {
  // 兼容：L/M/H 字符串 → 1/2/3；数字 1/2/3 原样返回
  if (typeof level === "number") return level;
  return { L: 1, M: 2, H: 3 }[level];
}

function calculateResult() {
  // 计算每个维度的原始分
  const rawScores = {};
  for (const dim of DIMENSION_ORDER) {
    rawScores[dim] = 0;
  }
  state.shuffledQuestions.forEach((q) => {
    if (state.answers[q.id] !== undefined) {
      rawScores[q.dim] += state.answers[q.id];
    }
  });

  // 离散化为 L/M/H
  const levels = {};
  for (const dim of DIMENSION_ORDER) {
    levels[dim] = scoreToLevel(rawScores[dim]);
  }

  // 用户模式
  const userPattern = DIMENSION_ORDER.map((dim) => levelToWeight(levels[dim]));

  // 与每个模板计算距离
  const ranked = TYPE_PATTERNS.map((tp) => {
    const patternLevels = tp.pattern.map(levelToWeight);
    let distance = 0;
    let exact = 0;

    patternLevels.forEach((pv, i) => {
      const delta = Math.abs(userPattern[i] - pv);
      distance += delta;
      if (delta === 0) exact++;
    });

    const maxDistance = DIMENSION_ORDER.length * 2; // 5 * 2 = 10
    const similarity = Math.max(0, Math.round((1 - distance / maxDistance) * 100));

    return {
      ...tp,
      ...TYPE_DETAILS[tp.code],
      distance,
      exact,
      similarity,
    };
  })
    .sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance;
      if (a.exact !== b.exact) return b.exact - a.exact;
      return b.similarity - a.similarity;
    });

  // 排除机制：极便携+低画质 → 不推稳定器
  const noStabilizer = levels.portable === "H" && (levels.quality === "L" || levels.quality === "M");
  const filtered = noStabilizer ? ranked.filter((r) => r.code !== "director") : ranked;
  const best = filtered.length > 0 ? filtered[0] : ranked[0];

  return { rawScores, levels, ranked, best };
}

function renderDimensionResult(result) {
  refs.dimList.innerHTML = DIMENSION_ORDER.map((dim) => {
    const level = result.levels[dim];
    const score = result.rawScores[dim];
    const description = DIMENSION_FEEDBACK[dim][level];
    return `
      <div class="dim-item">
        <div class="dim-item-top">
          <div class="dim-item-name">${DIMENSIONS[dim].name}</div>
          <div class="dim-item-score">${level} / ${score}分</div>
        </div>
        <p>${description}</p>
      </div>
    `;
  }).join("");
}

function renderResult() {
  const result = calculateResult();
  const best = result.best;
  const poster = POSTERS[best.code];

  refs.resultModeKicker.textContent = "你的影像人格";
  refs.resultTypeName.textContent = `${best.emoji} ${best.cn}`;
  refs.matchBadge.textContent = `匹配度 ${best.similarity}% · 精准命中 ${best.exact}/5 维`;
  refs.resultTypeSub.textContent = best.subtitle;
  refs.resultDesc.textContent = best.desc;
  refs.resultRecommend.innerHTML = `<strong>为你推荐：${best.product}</strong><br>${best.reason}`;

  // 产品图
  if (poster) {
    refs.posterImage.src = poster;
    refs.posterImage.alt = best.cn;
    refs.posterBox.classList.remove("no-image");
  } else {
    refs.posterImage.removeAttribute("src");
    refs.posterImage.alt = "";
    refs.posterBox.classList.add("no-image");
  }

  // 购买按钮
  refs.buyBtn.href = best.buyUrl;
  refs.buyBtn.textContent = `去购买 ${best.product} →`;

  // 维度分析
  renderDimensionResult(result);

  showScreen("result");
}

function startTest() {
  state.answers = {};
  state.shuffledQuestions = pickQuestions();
  renderQuestions();
  showScreen("test");
}

// 事件绑定
refs.startBtn.addEventListener("click", startTest);
refs.submitBtn.addEventListener("click", renderResult);
refs.restartBtn.addEventListener("click", startTest);

refs.shareBtn.addEventListener("click", () => {
  const typeName = refs.resultTypeName.textContent;
  const shareText = `🎯 我的INTI人格：${typeName}\n${refs.resultDesc.textContent}\n👉 你也来测测`;
  navigator.clipboard.writeText(shareText).then(() => {
    refs.shareBtn.textContent = "已复制！";
    setTimeout(() => {
      refs.shareBtn.textContent = "复制结果去装逼";
    }, 2000);
  });
});
