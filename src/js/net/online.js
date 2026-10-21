/**
 * 在线对战的网络层
 *
 * 所有请求都带超时、失败一律吞掉返回 null：断网或服务端出问题时
 * 游戏照常能玩，对手自动退回本地 AI。
 */

const NAME_KEY = 'bb.playerName';
const TIMEOUT = 4000;

export function getPlayerName() {
  try { return localStorage.getItem(NAME_KEY) || ''; } catch { return ''; }
}

export function setPlayerName(name) {
  try { localStorage.setItem(NAME_KEY, name); } catch { /* 隐私模式下忽略 */ }
}

/** 每局一个随机 id：用来避免抽到自己，也用来覆盖同一局的战绩 */
export function newRunId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

async function call(path, { method = 'GET', body } = {}) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    const res = await fetch(path, {
      method,
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctl.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** 上传这一回合的背包，让别人能抽到你 */
export function uploadGhost(runId, ghost) {
  return call('/api/ghosts', { method: 'POST', body: { runId, ...ghost } });
}

/** 抽一个别人同回合的背包；没有就返回 null */
export async function fetchGhost(runId, round) {
  const r = await call(`/api/ghosts?round=${round}&runId=${encodeURIComponent(runId)}`);
  return r?.ghost || null;
}

export function submitRun(runId, record) {
  return call('/api/leaderboard', { method: 'POST', body: { runId, ...record } });
}

export function fetchLeaderboard() {
  return call('/api/leaderboard');
}
