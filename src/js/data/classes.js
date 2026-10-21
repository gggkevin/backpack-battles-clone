/**
 * 职业与子职业分支。
 *
 * 职业按 IPD（集成产品开发）里的岗位划分：产品、设计、开发、测试、运维、文档、项目经理、销售。
 * 内部 id 沿用早期的奇幻职业名（ranger / warrior …），已上传的幽灵阵容靠它识别，不要改。
 *
 * 每个职业给：初始道具、初始血量、被动特性。
 *
 * 背包尺寸对所有角色统一（7×9，可用扩容卡加大），角色之间只差「携带的武器与道具」和被动：
 * 同样的格子里，用什么开局决定你往哪个方向堆形状。
 * 子职业在指定回合开放，选一个之后获得该分支的专属加成与专属道具。
 */

export const CLASSES = [
  {
    id: 'ranger',
    name: '产品经理',
    desc: '需求先行、版本节奏快，靠第一刀抢占市场窗口。',
    hp: 60,
    gold: 10,
    startItems: ['sword', 'apple'],
    passive: { name: '需求先行', desc: '每场战斗开始时，第一件武器直接进入半冷却。', effect: { firstWeaponReady: 0.5 } },
    branches: [
      {
        id: 'sharpshooter',
        name: '需求分析师',
        atRound: 4,
        desc: '远程武器伤害提高，暴击率 +15%。',
        bonus: { rangedDamage: 0.35, crit: 0.15 },
        unlockItems: ['longbow', 'quiver'],
      },
      {
        id: 'beastmaster',
        name: '平台产品经理',
        atRound: 4,
        desc: '每次集成（合成）后，永久获得 +4 最大生命。',
        bonus: { hpPerFuse: 4 },
        unlockItems: ['boarTusk', 'wolfPelt'],
      },
    ],
  },
  {
    id: 'warrior',
    name: '测试',
    desc: '质量门禁层层把关，用护甲换生存，用暴击换爆发。',
    hp: 70,
    gold: 10,
    startItems: ['sword', 'buckler'],
    passive: { name: '质量门禁', desc: '护甲减伤上限提高到 85%。', effect: { armorCap: 0.85 } },
    branches: [
      {
        id: 'berserker',
        name: '压测工程师',
        atRound: 4,
        desc: '生命越低伤害越高，最多 +60%。',
        bonus: { rageDamage: 0.6 },
        unlockItems: ['dualAxe', 'bloodCharm'],
      },
      {
        id: 'guardian',
        name: 'QA 守门员',
        atRound: 4,
        desc: '每次受击把 3 点伤害当 Bug 单退回给攻击者。',
        bonus: { thorns: 3 },
        unlockItems: ['towerShield', 'thornCloak'],
      },
    ],
  },
  {
    id: 'mage',
    name: '开发',
    desc: '代码输出高但身板脆，靠位置保护核心模块。',
    hp: 55,
    gold: 12,
    startItems: ['firestaff', 'potion'],
    passive: { name: '技术栈加成', desc: '点燃与法术伤害提高 25%。', effect: { magicDamage: 0.25 } },
    branches: [
      {
        id: 'pyromancer',
        name: '007 卷王',
        atRound: 4,
        desc: '点燃伤害翻倍且可叠加两层。',
        bonus: { burnMultiplier: 2 },
        unlockItems: ['emberStaff', 'lavaOrb'],
      },
      {
        id: 'frostmage',
        name: '架构师',
        atRound: 4,
        desc: '每次命中给目标埋一笔技术债，攻速降低 6%，最多 5 层。',
        bonus: { chillPerHit: 0.06, chillMax: 5 },
        unlockItems: ['frostRing', 'iceCrystal'],
      },
    ],
  },
  {
    id: 'rogue',
    name: '运维',
    desc: '7×24 值守，秒级响应，攻速极快但单次伤害低。',
    hp: 55,
    gold: 11,
    startItems: ['dagger', 'buckler'],
    passive: { name: '秒级响应', desc: '所有武器基础冷却降低 12%。', effect: { speed: 0.12 } },
    branches: [
      {
        id: 'assassin',
        name: 'SRE',
        atRound: 4,
        desc: '暴击伤害提高到 2.2 倍。',
        bonus: { critMult: 2.2 },
        unlockItems: ['venomDagger', 'shadowCloak'],
      },
      {
        id: 'poisoner',
        name: '安全工程师',
        atRound: 4,
        desc: '命中植入漏洞扫描，中毒目标每次行动失血。',
        bonus: { poisonPerHit: 2 },
        unlockItems: ['poisonFlask', 'serpentFang'],
      },
    ],
  },
  {
    id: 'merchant',
    name: '销售',
    desc: '起始预算多，靠签单滚雪球攒出更强组合。',
    hp: 60,
    gold: 18,
    startItems: ['dagger', 'charm'],
    passive: { name: '先签后做', desc: '商店刷新免费，卖出返还 75% 金币。', effect: { freeRefresh: true, sellRatio: 0.75 } },
    branches: [
      {
        id: 'collector',
        name: '大客户经理',
        atRound: 4,
        desc: '商店多陈列 2 件（一次 8 件）。',
        bonus: { extraShopSlots: 2 },
        unlockItems: ['goldenIdol', 'merchantSeal'],
      },
      {
        id: 'trader',
        name: '渠道销售',
        atRound: 4,
        desc: '每回合额外获得 4 金。',
        bonus: { extraGold: 4 },
        unlockItems: ['tradeLedger', 'silverBar'],
      },
    ],
  },
  {
    id: 'druid',
    name: '项目经理',
    desc: '风险可控、进度可追，靠时间把优势堆起来。',
    hp: 65,
    gold: 10,
    startItems: ['mushroom', 'bow'],
    passive: { name: '风险闭环', desc: '每秒回复 1 点生命。', effect: { regen: 1 } },
    branches: [
      {
        id: 'grovewarden',
        name: 'PMO',
        atRound: 4,
        desc: '治疗量提高 40%，回复可溢出为护盾。',
        bonus: { healMultiplier: 1.4, overhealShield: true },
        unlockItems: ['lifeBlossom', 'ancientRoot'],
      },
      {
        id: 'thornbeast',
        name: '敏捷教练',
        atRound: 4,
        desc: '每次受击反弹伤害，数值等于当前护甲的三分之一。',
        bonus: { thornsFromArmor: 0.33 },
        unlockItems: ['brambleHide', 'beastClaw'],
      },
    ],
  },
  {
    id: 'designer',
    name: '设计',
    desc: '交互与视觉双修，出手不算重，但每一下都更快更准。',
    hp: 58,
    gold: 11,
    startItems: ['firestaff', 'charm'],
    passive: { name: '像素级还原', desc: '法术伤害提高 15%，武器基础冷却降低 6%。', effect: { magicDamage: 0.15, speed: 0.06 } },
    branches: [
      {
        id: 'uxdesigner',
        name: '交互设计师',
        atRound: 4,
        desc: '用户旅程一路打通，远程伤害 +25%，暴击率 +10%。',
        bonus: { rangedDamage: 0.25, crit: 0.1 },
        unlockItems: ['longbow', 'quiver'],
      },
      {
        id: 'uidesigner',
        name: '视觉设计师',
        atRound: 4,
        desc: '五彩斑斓的黑：点燃伤害提高 60%。',
        bonus: { burnMultiplier: 1.6 },
        unlockItems: ['emberStaff', 'lavaOrb'],
      },
    ],
  },
  {
    id: 'writer',
    name: '文档',
    desc: '资料齐全、口径统一，打得慢但特别耐打。',
    hp: 68,
    gold: 10,
    startItems: ['leather', 'bread'],
    passive: { name: '有据可查', desc: '护甲减伤上限提高到 80%，每秒回复 1 点生命。', effect: { armorCap: 0.8, regen: 1 } },
    branches: [
      {
        id: 'techwriter',
        name: '技术写作',
        atRound: 4,
        desc: '每次受击反弹伤害，数值等于当前护甲的四分之一。',
        bonus: { thornsFromArmor: 0.25 },
        unlockItems: ['towerShield', 'thornCloak'],
      },
      {
        id: 'configadmin',
        name: '配置管理员',
        atRound: 4,
        desc: '基线管得住，治疗量提高 30%，回复可溢出为护盾。',
        bonus: { healMultiplier: 1.3, overhealShield: true },
        unlockItems: ['lifeBlossom', 'ancientRoot'],
      },
    ],
  },
];

export const CLASS_BY_ID = Object.fromEntries(CLASSES.map((c) => [c.id, c]));

export function branchOf(classId, branchId) {
  const cls = CLASS_BY_ID[classId];
  if (!cls) return null;
  return cls.branches.find((b) => b.id === branchId) || null;
}
