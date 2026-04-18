/**
 * INTI - Insta Nexus Type Indicator
 * 核心数据：维度定义、题库、人格模板、匹配规则
 *
 * 匹配算法灵感来自 SBTI 项目 (https://github.com/hanyanshuo/SBTI)
 * 采用 L/M/H 三级评分 + 模板距离匹配，替代硬编码 if-else
 */

// ==================== 维度定义 ====================
export const DIMENSIONS = {
  scene: { name: "创作场景", model: "拍摄维度" },
  portable: { name: "便携执念", model: "设备维度" },
  quality: { name: "画质洁癖", model: "画质维度" },
  tech: { name: "技术信仰", model: "功能维度" },
  style: { name: "表达风格", model: "创作风格" },
};

export const DIMENSION_ORDER = ["scene", "portable", "quality", "tech", "style"];

// ==================== 题库 ====================
// 每个维度 7 题，每次测试从每维度随机抽 2 题，共 10 题
// option values: 1=L(低), 2=M(中), 3=H(高)
export const QUESTIONS = [
  // ===== scene 创作场景 =====
  { id: "s1", dim: "scene", text: "翻翻你相册，占比最大的是？", options: [
    { text: "自拍和美食", value: 1 },
    { text: "随手拍的街景", value: 2 },
    { text: "精心构图的风景/人文", value: 3 },
    { text: "全景/360度素材", value: 3 },
  ]},
  { id: "s2", dim: "scene", text: "朋友聚会拍合照，你的角色是？", options: [
    { text: "被拍的那个", value: 1 },
    { text: "随便帮大家拍一张", value: 2 },
    { text: "主动找角度、调参数", value: 3 },
  ]},
  { id: "s3", dim: "scene", text: "给你一台全新相机，你第一件事是？", options: [
    { text: "拍几张试试就收起来", value: 1 },
    { text: "研究基础功能，日常拍拍", value: 2 },
    { text: "翻遍所有模式，每个都试一遍", value: 3 },
  ]},
  { id: "s4", dim: "scene", text: "刷到别人发的旅行视频，你最羡慕的是？", options: [
    { text: "好看的人出镜", value: 1 },
    { text: "拍到了稀有的画面", value: 2 },
    { text: "独特的拍摄视角和运镜", value: 3 },
  ]},
  { id: "s5", dim: "scene", text: "周末有空你会？", options: [
    { text: "宅家刷手机", value: 1 },
    { text: "出门逛逛，随手拍拍", value: 2 },
    { text: "专门去一个地方拍素材", value: 3 },
  ]},
  { id: "s6", dim: "scene", text: "你更想看哪种博主的视频？", options: [
    { text: "颜值/生活vlog", value: 1 },
    { text: "数码评测/开箱", value: 2 },
    { text: "电影感/技术流创作", value: 3 },
  ]},
  { id: "s7", dim: "scene", text: "如果要你拍一条vlog，主题会是？", options: [
    { text: "今天的穿搭/心情", value: 1 },
    { text: "探店/旅行记录", value: 2 },
    { text: "有剧本有分镜的创意短片", value: 3 },
  ]},

  // ===== portable 便携执念 =====
  { id: "p1", dim: "portable", text: "你出门的EDC（日常携带）里有相机吗？", options: [
    { text: "没有，手机就够了", value: 1 },
    { text: "偶尔带个小相机", value: 2 },
    { text: "必须带，这是信仰", value: 3 },
  ]},
  { id: "p2", dim: "portable", text: "买包的时候你最看重什么？", options: [
    { text: "好看/搭配", value: 1 },
    { text: "容量够大", value: 2 },
    { text: "有专门的相机隔层", value: 3 },
  ]},
  { id: "p3", dim: "portable", text: "准备出远门旅行，你的行李是？", options: [
    { text: "一个小背包搞定", value: 1 },
    { text: "正常行李，带几件衣服", value: 2 },
    { text: "半个箱子都是摄影装备", value: 3 },
  ]},
  { id: "p4", dim: "portable", text: "朋友说「帮我拍张照」，你会？", options: [
    { text: "掏出手机随便按", value: 1 },
    { text: "认真找角度用手机拍", value: 2 },
    { text: "「等我拿相机」", value: 3 },
  ]},
  { id: "p5", dim: "portable", text: "你拍视频时对画面稳定的要求是？", options: [
    { text: "能看清就行，晃点无所谓", value: 1 },
    { text: "希望稳一点，但不强求", value: 2 },
    { text: "必须丝滑流畅，一丝抖动都不能忍", value: 3 },
  ]},
  { id: "p6", dim: "portable", text: "相机重量超过500g你会？", options: [
    { text: "太重了，pass", value: 1 },
    { text: "能接受但不太情愿", value: 2 },
    { text: "无所谓，画质才是王道", value: 3 },
  ]},
  { id: "p7", dim: "portable", text: "出差带相机，你会选？", options: [
    { text: "不带，手机够用", value: 1 },
    { text: "运动相机或卡片机", value: 2 },
    { text: "全画幅+镜头，沉也值得", value: 3 },
  ]},

  // ===== quality 画质洁癖 =====
  { id: "q1", dim: "quality", text: "发朋友圈之前你会？", options: [
    { text: "原图直发", value: 1 },
    { text: "套个滤镜调个色", value: 2 },
    { text: "精修到每个像素都满意", value: 3 },
  ]},
  { id: "q2", dim: "quality", text: "如果相机画质提升50%但贵30%，你冲不冲？", options: [
    { text: "不冲，够用就行", value: 1 },
    { text: "会犹豫一下", value: 2 },
    { text: "必须冲，画质无价", value: 3 },
  ]},
  { id: "q3", dim: "quality", text: "朋友发来一段模糊的视频但内容很搞笑，你会？", options: [
    { text: "照样笑，画质无所谓", value: 1 },
    { text: "有点可惜，要是清楚就好了", value: 2 },
    { text: "内容再好也看不下去这画质", value: 3 },
  ]},
  { id: "q4", dim: "quality", text: "你发视频的分辨率设置是？", options: [
    { text: "720p够了", value: 1 },
    { text: "1080p标准清晰度", value: 2 },
    { text: "4K起步，越高越好", value: 3 },
  ]},
  { id: "q5", dim: "quality", text: "看到4K和8K的对比视频，你觉得？", options: [
    { text: "看不出区别", value: 1 },
    { text: "仔细看有点区别", value: 2 },
    { text: "天壤之别，8K太细腻了", value: 3 },
  ]},
  { id: "q6", dim: "quality", text: "夜景拍照有噪点，你会？", options: [
    { text: "正常，手机夜景都这样", value: 1 },
    { text: "有点不舒服但能接受", value: 2 },
    { text: "立刻研究怎么消除，受不了", value: 3 },
  ]},
  { id: "q7", dim: "quality", text: "你愿意为画质牺牲便携吗？", options: [
    { text: "不愿意，轻便最重要", value: 1 },
    { text: "看情况，适度牺牲可以", value: 2 },
    { text: "画质第一，其他靠边", value: 3 },
  ]},

  // ===== tech 技术信仰 =====
  { id: "t1", dim: "tech", text: "买新电子产品时你会冲首发吗？", options: [
    { text: "不会，等降价再说", value: 1 },
    { text: "看评测，好的话就冲", value: 2 },
    { text: "必须首批，越早越好", value: 3 },
  ]},
  { id: "t2", dim: "tech", text: "你买电子产品最看重什么？", options: [
    { text: "颜值和品牌", value: 1 },
    { text: "性价比和口碑", value: 2 },
    { text: "参数和黑科技", value: 3 },
  ]},
  { id: "t3", dim: "tech", text: "相机固件更新，你会？", options: [
    { text: "不更新，能用就行", value: 1 },
    { text: "有空就更一下", value: 2 },
    { text: "第一时间更新，新功能必须体验", value: 3 },
  ]},
  { id: "t4", dim: "tech", text: "你觉得AI对摄影的未来？", options: [
    { text: "没什么兴趣", value: 1 },
    { text: "有些功能挺实用", value: 2 },
    { text: "AI会彻底改变摄影方式", value: 3 },
  ]},
  { id: "t5", dim: "tech", text: "朋友推荐你买一个「很稳但没黑科技」的相机，你会？", options: [
    { text: "够了，稳定就是最好的", value: 1 },
    { text: "可以考虑", value: 2 },
    { text: "没有黑科技，那有什么意思", value: 3 },
  ]},
  { id: "t6", dim: "tech", text: "你研究相机参数的方式是？", options: [
    { text: "不研究，看推荐就买", value: 1 },
    { text: "大概看看主要参数", value: 2 },
    { text: "逐项对比，CMOS/光圈/码率一个不落", value: 3 },
  ]},
  { id: "t7", dim: "tech", text: "你的设备固件更新习惯是？", options: [
    { text: "能用就不动", value: 1 },
    { text: "有提醒就更", value: 2 },
    { text: "第一时间尝鲜", value: 3 },
  ]},

  // ===== style 表达风格 =====
  { id: "st1", dim: "style", text: "你剪一条视频平均花多久？", options: [
    { text: "不剪，原片发", value: 1 },
    { text: "半小时以内", value: 2 },
    { text: "几个小时甚至几天，每一帧都要打磨", value: 3 },
  ]},
  { id: "st2", dim: "style", text: "你更认同哪句话？", options: [
    { text: "内容为王，形式无所谓", value: 1 },
    { text: "好的呈现能让内容更好", value: 2 },
    { text: "视觉冲击力就是一切", value: 3 },
  ]},
  { id: "st3", dim: "style", text: "你发视频的频率？", options: [
    { text: "很少发，懒得折腾", value: 1 },
    { text: "一周一两条", value: 2 },
    { text: "日更或接近日更", value: 3 },
  ]},
  { id: "st4", dim: "style", text: "拍之前你会做哪些准备？", options: [
    { text: "啥也不准备，随缘拍", value: 1 },
    { text: "想想要拍什么", value: 2 },
    { text: "脚本、分镜、灯光全到位", value: 3 },
  ]},
  { id: "st5", dim: "style", text: "你的视频BGM风格是？", options: [
    { text: "不用BGM或随便配", value: 1 },
    { text: "热门歌曲/流行音乐", value: 2 },
    { text: "精心挑选，BGM是灵魂", value: 3 },
  ]},
  { id: "st6", dim: "style", text: "别人说你的视频「太普通」，你会？", options: [
    { text: "无所谓，记录生活而已", value: 1 },
    { text: "有点在意，下次试试改进", value: 2 },
    { text: "不服，下次一定要惊艳他们", value: 3 },
  ]},
  { id: "st7", dim: "style", text: "你觉得一条好视频最重要的是？", options: [
    { text: "真实/有趣", value: 1 },
    { text: "信息量/有用", value: 2 },
    { text: "视觉震撼/电影感", value: 3 },
  ]},
];

// ==================== 人格模板 ====================
// 5 维度 × L/M/H，pattern 格式：5个字符，L=1/M=2/H=3
export const TYPE_PATTERNS = [
  { code: "panoramic",   pattern: [3, 1, 3, 2, 3] },  // 全景强迫症
  { code: "lightweight", pattern: [1, 3, 1, 1, 1] },  // 轻装旅人
  { code: "paramaniac",  pattern: [2, 1, 3, 3, 2] },  // 参数狂魔
  { code: "tank",        pattern: [3, 2, 2, 1, 2] },  // 抗造战神
  { code: "invisible",   pattern: [1, 3, 1, 2, 1] },  // 隐形记录者
  { code: "thumb",       pattern: [1, 3, 2, 2, 1] },  // 拇指玩家
  { code: "director",    pattern: [3, 2, 3, 2, 3] },  // 运镜大师
  { code: "selfie",      pattern: [1, 2, 2, 2, 3] },  // 自拍卷王
  { code: "drone",       pattern: [3, 1, 3, 3, 2] },  // 俯瞰一切
];

// ==================== 人格详情 ====================
export const TYPE_DETAILS = {
  panoramic: {
    code: "panoramic",
    cn: "全景强迫症",
    subtitle: "错过一度会死星人",
    emoji: "🌀",
    product: "Insta360 X5",
    desc: "你拍照不是拍照，是做3D建模。别人问你\"刚才那张好看吗\"，你说\"等我转一圈检查有没有漏\"。你的相册不是相册，是球形投影素材库。你的人生没有死角，因为你不允许死角存在。",
    reason: "8K全景+1/1.28英寸大底，像素多到你数不过来。可拆换镜片，摔了不疼。你负责强迫，它负责满足。",
    intro: "少一度？那叫残次品 🌀",
    buyUrl: "https://store.insta360.com/cn/product/x5",
  },
  lightweight: {
    code: "lightweight",
    cn: "轻装旅人",
    subtitle: "负重超过200g会窒息",
    emoji: "🪶",
    product: "Insta360 X4 Air",
    desc: "你的人生信条是：能不带就不带，能轻就轻。你不是没钱买装备，你是哲学层面拒绝被物化。别人背包里是相机、稳定器、三脚架，你包里是一包纸巾和一个手机。",
    reason: "268g极致轻量，比一杯咖啡还轻。拇指大小塞口袋就走，5.7K画质证明轻≠差。你负责轻盈，它负责记录。",
    intro: "负重超过200g我会窒息 🪶",
    buyUrl: "https://store.insta360.com/cn/product/x4-air",
  },
  paramaniac: {
    code: "paramaniac",
    cn: "参数狂魔",
    subtitle: "规格表鉴赏家",
    emoji: "📊",
    product: "Insta360 Ace Pro 2",
    desc: "你买相机比找对象还认真。你会为了一点画质差异花三个小时看评测，会在论坛和人争论CMOS尺寸的物理极限，会把规格表打印出来贴在床头。",
    reason: "1/1.3英寸大底+徕卡镜头+AI芯片，参数表拉满。8K慢动作+HDR视频，让你在论坛吵架时底气十足。",
    intro: "参数不会骗人，但你的钱包会 📊",
    buyUrl: "https://store.insta360.com/cn/product/ace-pro-2",
  },
  tank: {
    code: "tank",
    cn: "抗造战神",
    subtitle: "摔了比相机先哭的是你",
    emoji: "🛡️",
    product: "Insta360 Ace Pro",
    desc: "你的相机不是电子产品，是装甲车。别人小心翼翼用绒布擦镜头，你直接在沙尘暴里换电池。防水防摔是刚需，因为你永远不知道下一秒相机会经历什么。",
    reason: "防水防摔扛造三件套，裸机直接干。翻转屏不怕压，磁吸快拆不怕摔。你负责造，它负责扛。",
    intro: "相机没坏，说明你还不够野 🛡️",
    buyUrl: "https://store.insta360.com/cn/product/ace-pro",
  },
  invisible: {
    code: "invisible",
    cn: "隐形记录者",
    subtitle: "存在感为零的记录狂魔",
    emoji: "👁️",
    product: "Insta360 GO Ultra",
    desc: "你最怕的就是被发现你在拍。你追求的是那种\"我在场但没人知道我在记录\"的境界。别人举着大相机吸引目光，你已经悄悄拍完了一整段。",
    reason: "拇指大小，磁吸佩戴，隐形于无形。别人还在掏相机，你已经拍完收工。你负责隐身，它负责记录。",
    intro: "你看到的是生活，我记录的是纪录片 👁️",
    buyUrl: "https://store.insta360.com/cn/product/go-ultra",
  },
  thumb: {
    code: "thumb",
    cn: "拇指玩家",
    subtitle: "相机比脸小才行",
    emoji: "👍",
    product: "Insta360 GO 3S",
    desc: "你的选相机标准只有一个：比我的拇指大不了多少。你不是不追求画质，你是把「极致小巧」当作最高美学。别人看到你的相机都会问：\"这是玩具吗？\"",
    reason: "全球最小的拇指相机，22.7g无感佩戴。别笑它小，4K画质+防水+磁吸，该有的一个不少。你负责萌，它负责拍。",
    intro: "相机比脸小，但拍出来比你大 👍",
    buyUrl: "https://store.insta360.com/cn/product/go-3s",
  },
  director: {
    code: "director",
    cn: "运镜大师",
    subtitle: "手机也能拍电影",
    emoji: "🎬",
    product: "Insta360 Flow 2 Pro",
    desc: "你是天生的导演。别人拍视频是记录，你拍视频是创作。运镜、转场、节奏感，你脑子里随时在分镜。稳定器不是工具，是你手臂的延伸。",
    reason: "AI追踪+360°无限旋转+内置三脚架，一个人就是一支团队。你负责运镜创意，它负责丝滑执行。",
    intro: "这不是稳定器，这是我的导演椅 🎬",
    buyUrl: "https://store.insta360.com/cn/product/flow-2-pro",
  },
  selfie: {
    code: "selfie",
    cn: "自拍卷王",
    subtitle: "看不到自己不会按快门",
    emoji: "🤳",
    product: "Insta360 Snap",
    desc: "你的人生哲学是：没有自拍的旅行等于没去过。你对镜头发脾气的次数比对人还多，因为只有镜头不会对你的自拍技术说三道四。",
    reason: "AI美颜+智能补光+一键出片，自拍界的终极武器。翻转屏实时预览，每一张都是精修级。你负责美，它负责拍。",
    intro: "我拍照不是为了记录，是为了证明我帅 🤳",
    buyUrl: "https://store.insta360.com/product/snap",
  },
  drone: {
    code: "drone",
    cn: "俯瞰一切",
    subtitle: "地面已经配不上我",
    emoji: "🛸",
    product: "Antigravity A1",
    desc: "你始终觉得，最好的视角永远在头顶。地面太拥挤，你需要的是上帝视角。每次看到别人在地上拍照，你都想说：兄弟，往上看看。",
    reason: "8K空中全景+手势控制+自动跟随，不需要遥控器的无人机。你负责仰望天空，它负责飞上去。",
    intro: "你在看风景，我在风景上面 🛸",
    buyUrl: "https://www.antigravity.tech/drone/antigravity-a1",
  },
};

// ==================== 维度解释 ====================
export const DIMENSION_FEEDBACK = {
  scene: {
    L: "你的创作场景以日常记录为主，不追求特定题材",
    M: "你会根据场景选择拍摄方式，有一定创作意识",
    H: "你的创作场景丰富多元，追求独特的拍摄视角和题材",
  },
  portable: {
    L: "你对便携性不太在意，愿意为画质和功能牺牲体积",
    M: "你会考虑便携性，但不会因此放弃核心功能",
    H: "便携性是你的第一优先级，轻才是正义",
  },
  quality: {
    L: "画质对你来说够用就行，内容才是核心",
    M: "你对画质有一定要求，但不会为此牺牲太多",
    H: "画质洁癖患者，每个像素都必须完美",
  },
  tech: {
    L: "你对技术参数不太感冒，好用就行",
    M: "你会关注新技术，但只选择实用的功能",
    H: "技术狂热者，最新参数、最强芯片、最黑的科技",
  },
  style: {
    L: "你的表达风格随性自然，不追求精致的后期",
    M: "你会做一些后期处理，在效率和质量间平衡",
    H: "你的每条视频都是作品，从脚本到后期精益求精",
  },
};
