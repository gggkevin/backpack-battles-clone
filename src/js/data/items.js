/**
 * 道具数据表
 *
 * 命名口径：道具名都取自产品开发里的流程、评审节点和职场梗（IPD 风格），
 * id 仍沿用最早的奇幻装备名，图标文件和合成表都按 id 走，不要改。
 *
 * 形状设计口径（重要）：
 *   形状要长得像这件东西本身，而不是为了「不规则」而不规则。
 *   - 腰带就是一条长条，不必硬掰成 L 形。
 *   - 弓就该是弯的，斧子就该是「头 + 柄」，护甲就该是块状。
 *   - 武器够长（矛、杖）就让它长，这样它在背包里也更难塞。
 *
 * 读条口径：
 *   武器的攻击间隔由**占格数**决定 —— 格子越多，读条越久。
 *   每件武器在战斗里都有自己的读条，读满才挥一次。
 *   见 chargeSeconds()。
 */

export const CATEGORIES = {
  weapon: { name: '武器', color: '#e2604a' },
  armor: { name: '防具', color: '#4a7fe2' },
  food: { name: '食物', color: '#5fbf6b' },
  gem: { name: '宝石', color: '#c05fd0' },
  trinket: { name: '饰品', color: '#e0a63c' },
};

export const RARITY = {
  1: { name: '普通', color: '#9aa4b2' },
  2: { name: '罕见', color: '#4fa3e3' },
  3: { name: '稀有', color: '#b06fe0' },
  4: { name: '传说', color: '#e8b33c' },
};

/** 触发动效类型，战斗舞台按这个播动画 */
export const FX = {
  slash: '斩击',
  thrust: '刺击',
  heavy: '重劈',
  arrow: '箭矢',
  magic: '法术',
  burn: '火焰',
  heal: '治疗',
  shield: '护盾',
  poison: '中毒',
  frost: '冰霜',
  shock: '闪电',
};

/** 读条系数：武器每占一格需要多少秒 */
export const CHARGE_PER_CELL = 0.45;

function countCells(shape) {
  let n = 0;
  for (const row of shape) for (const ch of row) if (ch === 'X') n++;
  return n;
}

/**
 * 一件武器的读条时长（秒）。
 * 占格数 × 每格秒数 × 该武器的速度系数。
 * 格数多的武器读条久，但伤害也高 —— 这就是「大剑 vs 匕首」的节奏差。
 */
export function chargeSeconds(item) {
  const n = countCells(item.shape || ['X']);
  const mul = item.chargeMul ?? 1;
  return +(n * CHARGE_PER_CELL * mul).toFixed(3);
}

export const ITEMS = [
  // ==================== 武器 ====================
  {
    id: 'dagger', name: '热补丁', cat: 'weapon', tier: 1, price: 2,
    shape: ['X', 'X'],                    // 两格短刃，就长这样
    stats: { damage: 3, fx: 'thrust' }, chargeMul: 0.85,
    slot: 'weapon',
    desc: '两格 Hotfix，读条最快，适合堆攻速。',
  },
  {
    id: 'sword', name: '迭代冲刺', cat: 'weapon', tier: 1, price: 4,
    shape: ['X', 'X', 'X'],               // 笔直的三格剑身
    stats: { damage: 8, fx: 'slash' },
    slot: 'weapon',
    desc: '一个 Sprint 三格长，最基础的输出手段。',
  },
  {
    id: 'venomDagger', name: '祖传代码', cat: 'weapon', tier: 3, price: 13,
    shape: ['X', 'X', 'X'],               // 略长的淬毒短刃
    stats: { damage: 6, poison: 3, fx: 'poison' }, chargeMul: 0.85,
    slot: 'weapon',
    desc: '读条快，命中叠毒，谁碰谁中招。',
  },
  {
    id: 'spear', name: 'CI/CD 流水线', cat: 'weapon', tier: 2, price: 6,
    shape: ['X', 'X', 'X', 'X'],          // 四格长杆
    stats: { damage: 10, fx: 'thrust' },
    slot: 'weapon',
    desc: '四格长流水线，竖着插进背包刚好一排。',
  },
  {
    id: 'firestaff', name: '燃尽图', cat: 'weapon', tier: 2, price: 8,
    shape: ['X', 'X', 'X'],               // 三格长杖，与立绘比例一致
    stats: { damage: 6, burn: 4, fx: 'burn', magic: true }, chargeMul: 0.9,
    slot: 'weapon',
    desc: '命中后持续燃烧，进度越烧越少。',
  },
  {
    id: 'axe', name: '砍需求', cat: 'weapon', tier: 2, price: 7,
    shape: ['XX.', '.X.', '..X'],          // 斧头在左上，斧柄斜垂，左下留凹角
    stats: { damage: 12, fx: 'heavy' },
    slot: 'weapon',
    desc: '一刀下去需求少一半，拐角处最好塞。',
  },
  {
    id: 'runeblade', name: '技术评审 TR', cat: 'weapon', tier: 4, price: 21,
    shape: ['XX.', '.X.', 'X..'],          // 护手与剑刃，外接接近方形
    stats: { damage: 18, fx: 'shock', crit: 0.1 },
    slot: 'weapon',
    desc: '评审带电，命中追加一记雷击。',
  },
  {
    id: 'bow', name: '市场洞察', cat: 'weapon', tier: 1, price: 4,
    shape: ['XX.', '.X.', '..X'],          // 弓背与弓弦，外接接近方形
    stats: { damage: 5, fx: 'arrow', ranged: true }, chargeMul: 0.9,
    slot: 'weapon',
    desc: '远程预判，弯弯的一道弧占四格。',
  },
  {
    id: 'longbow', name: '产品路标', cat: 'weapon', tier: 3, price: 12,
    shape: ['.X', 'X.', 'X.', 'X.', '.X'],  // 更长的弧
    stats: { damage: 10, fx: 'arrow', ranged: true, pierce: 4 }, chargeMul: 0.9,
    slot: 'weapon',
    desc: '五格 Roadmap，看得更远也更难摆。',
  },
  {
    id: 'hammer', name: '决策评审 DCP', cat: 'weapon', tier: 3, price: 14,
    shape: ['XXX', '.X.', '.X.'],         // 宽锤头压在细柄上
    stats: { damage: 17, fx: 'heavy', armorBreak: 4 },
    slot: 'weapon',
    desc: '一锤定音，每次命中削弱目标护甲。',
  },
  {
    id: 'crossbow', name: '竞品分析', cat: 'weapon', tier: 3, price: 13,
    shape: ['X.X', 'XXX', '.X.'],         // 双弩臂 + 弩身
    stats: { damage: 11, fx: 'arrow', ranged: true, pierce: 5 }, chargeMul: 0.85,
    slot: 'weapon',
    desc: '双线对标，无视部分护甲。',
  },
  {
    id: 'dualAxe', name: '范围裁剪', cat: 'weapon', tier: 3, price: 14,
    shape: ['XX.', 'XX.', '.XX'],          // 两面斧头叠着，外接接近方形
    stats: { damage: 14, fx: 'heavy' },
    slot: 'weapon',
    desc: '两刀齐下砍范围，比砍需求快一点。',
  },
  {
    id: 'greatsword', name: '大版本发布', cat: 'weapon', tier: 4, price: 20,
    shape: ['XXX', '.X.', '.XX'],          // 护手与长剑身，左下留空缺
    stats: { damage: 26, fx: 'heavy' },
    slot: 'weapon',
    desc: '六格 GA 发布，读条最久，一发最重。',
  },
  {
    id: 'emberStaff', name: '全员加班', cat: 'weapon', tier: 3, price: 15,
    shape: ['XX.', '.X.', '.XX'],          // 杖顶拐出一节，外接接近方形
    stats: { damage: 8, burn: 9, fx: 'burn', magic: true }, chargeMul: 0.9,
    slot: 'weapon', fused: true,
    desc: '燃尽图的究极形态，燃烧更狠。',
  },

  // ==================== 防具 ====================
  {
    id: 'buckler', name: '单元测试', cat: 'armor', tier: 1, price: 3,
    shape: ['XX'],
    stats: { armor: 4 }, slot: 'trigger', desc: '巴掌大的用例，两块并排。',
  },
  {
    id: 'woodshield', name: '集成测试', cat: 'armor', tier: 2, price: 7,
    shape: ['XXX', '.X.'],                // 上宽下窄，盾牌的样子
    stats: { armor: 10, thorns: 1 }, slot: 'trigger', desc: '上宽下窄，接口都测到了。',
  },
  {
    id: 'towerShield', name: '系统测试', cat: 'armor', tier: 3, price: 14,
    shape: ['XXX', 'XXX', '.X.'],         // 更高更厚的盾
    stats: { armor: 20, thorns: 3 }, slot: 'trigger', desc: '七格全量用例，极硬，还能反弹 Bug。',
  },
  {
    id: 'leather', name: '代码评审', cat: 'armor', tier: 1, price: 5,
    shape: ['XX', 'XX'],
    stats: { armor: 7 }, slot: 'trigger', desc: '方方正正一次 CR，挡掉低级错误。',
  },
  {
    id: 'chainmail', name: '回归测试', cat: 'armor', tier: 3, price: 13,
    shape: ['XXX', 'XXX'],
    stats: { armor: 17 }, slot: 'trigger', desc: '横向 3×2，护住整片老功能。',
  },
  {
    id: 'dragonmail', name: '六西格玛', cat: 'armor', tier: 4, price: 22,
    shape: ['X.X', 'XXX', 'XXX'],         // 中间留出领口
    stats: { armor: 28, regen: 1 }, slot: 'trigger', desc: '缺陷率趋近于零的重甲，八格，还能慢慢回血。',
  },
  {
    id: 'brambleHide', name: '甩锅护甲', cat: 'armor', tier: 3, price: 15,
    shape: ['X.X', 'XXX', 'X.X'],         // 四角支出尖刺
    stats: { armor: 16, thorns: 6 }, slot: 'trigger', desc: '四角带刺，挨打就把锅甩回去。',
  },
  {
    id: 'aegis', name: '变更冻结', cat: 'armor', tier: 4, price: 21,
    shape: ['XX', 'XX', 'XX'],            // 细长的立盾
    stats: { armor: 24, thorns: 4 }, slot: 'trigger', desc: '六格 Code Freeze，又厚又扎手。',
  },

  // ==================== 食物 ====================
  {
    id: 'bread', name: '续命咖啡', cat: 'food', tier: 1, price: 2,
    shape: ['X'],
    stats: { heal: 5, healCooldown: 3.5 }, slot: 'trigger', desc: '一杯咖啡，恰好一格。',
  },
  {
    id: 'apple', name: '下午茶', cat: 'food', tier: 1, price: 3,
    shape: ['X'],
    stats: { heal: 7, healCooldown: 5, maxHp: 3 }, slot: 'trigger', desc: '一份下午茶，回血还加一点上限。',
  },
  {
    id: 'potion', name: '紧急回滚', cat: 'food', tier: 1, price: 3,
    shape: ['X'],
    stats: { heal: 8, healCooldown: 6, oneShot: true }, slot: 'trigger', desc: '一键 Rollback，一次性大回血。',
  },
  {
    id: 'mushroom', name: '带薪摸鱼', cat: 'food', tier: 2, price: 5,
    shape: ['XX', '.X'],                  // 菌盖 + 菌柄
    stats: { regen: 2 }, slot: 'trigger', desc: '三格摸鱼时间，持续回血。',
  },
  {
    id: 'elixir', name: '年终奖', cat: 'food', tier: 4, price: 20,
    shape: ['X', 'X'],                    // 细长药瓶
    stats: { regen: 4, maxHp: 12 }, slot: 'trigger', desc: '回血又加血上限，一年就盼这一回。',
  },
  {
    id: 'feast', name: '团建聚餐', cat: 'food', tier: 3, price: 11,
    shape: ['XXX', '.X.'],                // 托盘 + 摆在上面的一道菜
    stats: { heal: 16, healCooldown: 5 }, slot: 'trigger', desc: '一桌团建，四格，大口回血。',
  },

  // ==================== 宝石 ====================
  {
    id: 'ruby', name: '结对编程', cat: 'gem', tier: 1, price: 4,
    shape: ['X'],
    stats: { aura: { damage: 4 } }, slot: 'trigger', desc: '给相邻道具 +4 伤害。',
  },
  {
    id: 'sapphire', name: '自动化脚本', cat: 'gem', tier: 1, price: 4,
    shape: ['X'],
    stats: { aura: { speed: 0.15 } }, slot: 'trigger', desc: '给相邻武器 +15% 读条速度。',
  },
  {
    id: 'topaz', name: '测试用例', cat: 'gem', tier: 2, price: 6,
    shape: ['X'],
    stats: { aura: { armor: 5 } }, slot: 'trigger', desc: '给相邻道具 +5 护甲。',
  },
  {
    id: 'emerald', name: '知识库', cat: 'gem', tier: 2, price: 6,
    shape: ['X'],
    stats: { aura: { heal: 4 } }, slot: 'trigger', desc: '给相邻道具 +4 治疗量。',
  },
  {
    id: 'iceCrystal', name: '需求冻结', cat: 'gem', tier: 3, price: 11,
    shape: ['X', 'X'],                    // 一根柱状结晶
    stats: { aura: { speed: 0.1, frost: 1 } }, slot: 'trigger', desc: '两格冻结令，相邻提速并附带冰霜。',
  },
  {
    id: 'sagesStone', name: '最佳实践', cat: 'gem', tier: 4, price: 22,
    shape: ['.X.', 'XXX', '.X.'],         // 向四外发光的十字
    stats: { aura: { damage: 6, speed: 0.2, armor: 6 } }, slot: 'trigger',
    desc: '十字形，四个方向都能照到。',
  },

  // ==================== 饰品 ====================
  {
    id: 'charm', name: '锦鲤', cat: 'trinket', tier: 1, price: 4,
    shape: ['X'],
    stats: { crit: 0.15, critMult: 1.6 }, slot: 'trigger', desc: '转发这条锦鲤，提高暴击率。',
  },
  {
    id: 'whetstone', name: '机械键盘', cat: 'trinket', tier: 1, price: 3,
    shape: ['XX'],
    stats: { aura: { damage: 3 }, crit: 0.05 }, slot: 'trigger', desc: '两格青轴，给相邻武器加伤。',
  },
  {
    id: 'poisonFlask', name: '技术债', cat: 'trinket', tier: 2, price: 6,
    shape: ['X'],
    stats: { poisonAura: 2 }, slot: 'trigger', desc: '相邻武器命中附毒，迟早要还。',
  },
  {
    id: 'frostRing', name: '冗长会议', cat: 'trinket', tier: 3, price: 10,
    shape: ['X'],
    stats: { aura: { frost: 2 } }, slot: 'trigger', desc: '一个会接一个会，相邻武器附带减速。',
  },
  {
    id: 'quiver', name: '用户画像', cat: 'trinket', tier: 2, price: 7,
    shape: ['X', 'X'],                    // 立着的筒
    stats: { aura: { rangedDamage: 4 } }, slot: 'trigger', desc: '强化相邻远程武器，打得更准。',
  },
  {
    id: 'hourglass', name: 'DevOps', cat: 'trinket', tier: 3, price: 12,
    shape: ['XX', 'XX'],
    stats: { globalSpeed: 0.2 }, slot: 'trigger', desc: '全部武器读条提速 20%。',
  },
  {
    id: 'belt', name: '甘特图', cat: 'trinket', tier: 2, price: 6,
    shape: ['XXXX'],                      // 腰带本来就是一条长的，不必掰弯
    stats: { maxHp: 12 }, slot: 'trigger', desc: '一条长长的甘特图，横向四格，加生命上限。',
  },
  {
    id: 'bloodCharm', name: '开源白嫖', cat: 'trinket', tier: 3, price: 12,
    shape: ['X'],                         // 单格小符牌
    stats: { lifesteal: 0.15 }, slot: 'trigger', desc: '造成伤害的 15% 转为治疗。',
  },
  {
    id: 'thornCloak', name: '免责声明', cat: 'trinket', tier: 3, price: 11,
    shape: ['XXX', 'X.X', '.X.'],         // 披肩宽、下摆收
    stats: { thorns: 7 }, slot: 'trigger', desc: '披肩形，谁追责谁扎手。',
  },
  {
    id: 'goldenIdol', name: '大客户订单', cat: 'trinket', tier: 4, price: 20,
    shape: ['XXX', '.X.'],                // 头 + 身
    stats: { aura: { damage: 5, armor: 5 }, goldPerRound: 2 }, slot: 'trigger',
    desc: '相邻加伤加甲，每回合额外 2 金。',
  },
  {
    id: 'phoenixFeather', name: '推倒重构', cat: 'trinket', tier: 4, price: 20,
    shape: ['X'],
    stats: { regen: 5, maxHp: 18 }, slot: 'trigger', desc: '浴火重生，持续回血很强，还加生命上限。',
  },
];

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

/** 合成配方：两件同名同阶相邻即可合成 */
export const RECIPES = [
  { a: 'sword', b: 'sword', out: 'greatsword' },
  { a: 'dagger', b: 'dagger', out: 'venomDagger' },
  { a: 'bow', b: 'bow', out: 'longbow' },
  { a: 'axe', b: 'axe', out: 'dualAxe' },
  { a: 'buckler', b: 'buckler', out: 'woodshield' },
  { a: 'woodshield', b: 'woodshield', out: 'towerShield' },
  { a: 'leather', b: 'leather', out: 'chainmail' },
  { a: 'chainmail', b: 'chainmail', out: 'dragonmail' },
  { a: 'firestaff', b: 'firestaff', out: 'emberStaff' },
  { a: 'bread', b: 'bread', out: 'apple' },
  { a: 'apple', b: 'apple', out: 'feast' },
  { a: 'mushroom', b: 'mushroom', out: 'elixir' },
  { a: 'charm', b: 'charm', out: 'hourglass' },
  { a: 'whetstone', b: 'whetstone', out: 'bloodCharm' },
  { a: 'thornCloak', b: 'thornCloak', out: 'goldenIdol' },
  { a: 'ruby', b: 'ruby', out: 'sagesStone' },
];

export const RECIPE_MAP = Object.fromEntries(
  RECIPES.flatMap((r) => [[`${r.a}+${r.b}`, r.out], [`${r.b}+${r.a}`, r.out]]),
);

/** 商店池：按阶位取非合成产物 */
export function poolByTier(tier) {
  const fusedOnly = new Set(RECIPES.map((r) => r.out));
  return ITEMS.filter((i) => i.tier === tier && !fusedOnly.has(i.id));
}
