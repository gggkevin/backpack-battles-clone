import type { Config } from "@netlify/functions";
import { desc, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { runs, ghosts } from "../../db/schema.js";
import { CLASS_BY_ID } from "../../src/js/data/classes.js";
import { MATCH } from "../../src/js/data/constants.js";
import { cleanName } from "../../src/js/core/ghost.js";

/**
 * 排行榜接口
 *  POST /api/leaderboard   一局结束后上报战绩
 *  GET  /api/leaderboard   前 20 名 + 全服统计
 */
export default async (req: Request) => {
  if (req.method === "POST") {
    let b: any;
    try { b = await req.json(); } catch { return Response.json({ error: "bad json" }, { status: 400 }); }
    const runId = String(b?.runId || "");
    if (!/^[\w-]{8,64}$/.test(runId)) return Response.json({ error: "bad runId" }, { status: 400 });
    if (!CLASS_BY_ID[b.classId]) return Response.json({ error: "bad class" }, { status: 400 });
    const round = Number(b.round), wins = Number(b.wins), losses = Number(b.losses);
    if (![round, wins, losses].every(Number.isInteger)
        || round < 1 || round > MATCH.maxRounds
        || wins < 0 || losses < 0 || wins + losses > round
        || wins > MATCH.winTarget) {
      return Response.json({ error: "bad record" }, { status: 400 });
    }
    // 评分在服务端按同一公式重算，不信任客户端
    const fuses = Math.max(0, Math.min(60, Number(b.fuses) || 0));
    const alive = b.alive ? 20 : 0;
    const score = Math.max(0, wins * 10 - losses * 3 + alive + fuses * 2);
    const row = {
      runId,
      playerName: cleanName(b.playerName),
      classId: b.classId,
      branchName: b.branchName ? String(b.branchName).slice(0, 16) : null,
      round, wins, losses, score,
    };
    await db.insert(runs).values(row).onConflictDoUpdate({ target: runs.runId, set: row });
    const [{ rank }] = await db
      .select({ rank: sql<number>`count(*)::int + 1` })
      .from(runs)
      .where(sql`${runs.score} > ${score}`);
    return Response.json({ ok: true, score, rank });
  }

  if (req.method === "GET") {
    const top = await db
      .select({
        playerName: runs.playerName,
        classId: runs.classId,
        branchName: runs.branchName,
        round: runs.round,
        wins: runs.wins,
        losses: runs.losses,
        score: runs.score,
        createdAt: runs.createdAt,
      })
      .from(runs)
      .orderBy(desc(runs.score), desc(runs.wins), runs.createdAt)
      .limit(20);
    const [{ games }] = await db.select({ games: sql<number>`count(*)::int` }).from(runs);
    const [{ boards, players }] = await db
      .select({
        boards: sql<number>`count(*)::int`,
        players: sql<number>`count(distinct ${ghosts.runId})::int`,
      })
      .from(ghosts)
      .where(sql`${ghosts.createdAt} > now() - interval '24 hours'`);
    return Response.json({ top, games, boards24h: boards, runs24h: players });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/leaderboard" };
