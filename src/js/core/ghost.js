/**
 * 背包快照（幽灵）
 *
 * 在线对战走的是原作的异步 PvP：每回合开战前把自己的背包存一份上服务器，
 * 别的玩家打到同一回合时抽一份出来当对手。双方不用同时在线，
 * 战斗照旧在本地用同一套 simulate 跑。
 *
 * 这里只做两件事：把 Run 折成纯数据，以及把纯数据安全地还原成 Board。
 * 前端和服务端共用这一份 —— 服务端靠 decode 做校验，拒掉不合法的背包。
 */

import { Board } from './grid.js';
import { ITEM_BY_ID } from '../data/items.js';
import { CLOTH_BY_ID, STAGE } from '../data/cloths.js';
import { CLASS_BY_ID, branchOf } from '../data/classes.js';
import { orientations, normalize, sameShape } from '../data/shapes.js';
import { MATCH } from '../data/constants.js';

/** 一个背包最多带几件：舞台 63 格，单件至少 1 格 */
const MAX_ITEMS = STAGE.cols * STAGE.rows;

/** 把当前局折成可上传的快照 */
export function encodeGhost(run, playerName) {
  const c = run.board.cloth;
  return {
    playerName,
    classId: run.classDef.id,
    branchId: run.branch?.id || null,
    round: run.header.round,
    wins: run.header.wins,
    losses: run.header.losses,
    hp: run.header.hp,
    board: {
      cloth: c ? {
        id: c.cloth.id, x: c.x, y: c.y,
        flipped: !!c.flipped, rotation: c.rotation || 0, extra: [...(c.extra || [])],
      } : null,
      items: run.board.list().map((e) => ({ id: e.item.id, x: e.x, y: e.y, shape: [...e.shape] })),
    },
  };
}

/**
 * 把快照还原成真实 Board。任何一处不合法都返回 null：
 * 道具不存在、朝向不是该道具的某种旋转、越界、重叠、落在布外。
 */
export function decodeBoard(data, uidPrefix = 'g') {
  if (!data || typeof data !== 'object' || !Array.isArray(data.items)) return null;
  if (data.items.length > MAX_ITEMS) return null;
  const board = new Board(STAGE.cols, STAGE.rows);

  const c = data.cloth;
  if (c) {
    const def = CLOTH_BY_ID[c.id];
    if (!def || !Number.isInteger(c.x) || !Number.isInteger(c.y)) return null;
    const extra = Array.isArray(c.extra) ? c.extra : [];
    if (extra.length > MAX_ITEMS) return null;
    for (const k of extra) {
      if (typeof k !== 'string' || !/^\d,\d$/.test(k)) return null;
      const [x, y] = k.split(',').map(Number);
      if (!board.inBounds(x, y)) return null;
    }
    board.cloth = {
      cloth: def, x: c.x, y: c.y,
      flipped: !!c.flipped, rotation: ((Number(c.rotation) || 0) % 4 + 4) % 4, extra,
    };
  }

  let seq = 0;
  for (const it of data.items) {
    const base = ITEM_BY_ID[it?.id];
    if (!base || !Array.isArray(it.shape) || it.shape.length > 8) return null;
    if (!it.shape.every((r) => typeof r === 'string' && r.length <= 8)) return null;
    const shape = normalize(it.shape);
    if (!orientations(base.shape).some((o) => sameShape(o, shape))) return null;
    if (!Number.isInteger(it.x) || !Number.isInteger(it.y)) return null;
    if (!board.place({ ...base, uid: `${uidPrefix}-${seq++}` }, it.x, it.y, shape)) return null;
  }
  return board;
}

/** 校验一份上传的快照，返回清洗过的字段；不合法返回 null */
export function validateGhost(body) {
  if (!body || typeof body !== 'object') return null;
  const cls = CLASS_BY_ID[body.classId];
  if (!cls) return null;
  const branch = body.branchId ? branchOf(cls.id, body.branchId) : null;
  if (body.branchId && !branch) return null;
  const round = Number(body.round);
  const wins = Number(body.wins);
  const losses = Number(body.losses);
  const hp = Number(body.hp);
  if (![round, wins, losses, hp].every(Number.isInteger)) return null;
  if (round < 1 || round > MATCH.maxRounds) return null;
  if (wins < 0 || losses < 0 || wins + losses > round - 1) return null;
  if (hp < 1 || hp > 400) return null;
  const board = decodeBoard(body.board);
  if (!board || !board.count()) return null;
  return {
    playerName: cleanName(body.playerName),
    classId: cls.id,
    branchId: branch ? branch.id : null,
    round, wins, losses, hp,
    board: body.board,
  };
}

/** 昵称：去控制字符、限长，空的给个默认 */
export function cleanName(name) {
  const s = String(name ?? '').replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, 16);
  return s || '无名冒险家';
}

/** 把服务端返回的一行幽灵数据，变成 Run.runBattle 能直接用的对手 */
export function ghostOpponent(row) {
  const board = decodeBoard(row?.board, 'ghost');
  const cls = CLASS_BY_ID[row?.classId];
  if (!board || !cls) return null;
  const branch = row.branchId ? branchOf(cls.id, row.branchId) : null;
  return {
    name: `${cleanName(row.playerName)}·${branch ? branch.name : cls.name}`,
    board,
    hp: row.hp,
    classDef: cls,
    branch,
    online: true,
    record: `${row.wins} 胜 ${row.losses} 负`,
  };
}
