import type { Config } from "@netlify/functions";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { ghosts } from "../../db/schema.js";
import { validateGhost } from "../../src/js/core/ghost.js";

/**
 * 背包快照接口
 *  POST /api/ghosts           上传自己这一回合的背包
 *  GET  /api/ghosts?round=N   随机抽一个别人在第 N 回合的背包当对手
 */
export default async (req: Request) => {
  if (req.method === "POST") {
    let body: any;
    try { body = await req.json(); } catch { return Response.json({ error: "bad json" }, { status: 400 }); }
    const runId = String(body?.runId || "").slice(0, 64);
    if (!/^[\w-]{8,64}$/.test(runId)) return Response.json({ error: "bad runId" }, { status: 400 });
    const g = validateGhost(body);
    if (!g) return Response.json({ error: "invalid board" }, { status: 400 });

    // 同一局同一回合只留一份（玩家可能重试）
    await db.delete(ghosts).where(and(eq(ghosts.runId, runId), eq(ghosts.round, g.round)));
    const [row] = await db.insert(ghosts).values({ runId, ...g }).returning({ id: ghosts.id });
    return Response.json({ ok: true, id: row.id }, { status: 201 });
  }

  if (req.method === "GET") {
    const url = new URL(req.url);
    const round = Number(url.searchParams.get("round"));
    if (!Number.isInteger(round) || round < 1 || round > 30) {
      return Response.json({ error: "bad round" }, { status: 400 });
    }
    const runId = url.searchParams.get("runId") || "";

    // 只在最近的一批里随机，保证对手的版本和强度都比较新
    const recent = db
      .select({ id: ghosts.id })
      .from(ghosts)
      .where(and(eq(ghosts.round, round), ne(ghosts.runId, runId)))
      .orderBy(desc(ghosts.createdAt))
      .limit(200)
      .as("recent");
    const [pick] = await db
      .select({ id: recent.id })
      .from(recent)
      .orderBy(sql`random()`)
      .limit(1);
    if (!pick) return Response.json({ ghost: null });

    const [row] = await db
      .select({
        playerName: ghosts.playerName,
        classId: ghosts.classId,
        branchId: ghosts.branchId,
        round: ghosts.round,
        wins: ghosts.wins,
        losses: ghosts.losses,
        hp: ghosts.hp,
        board: ghosts.board,
      })
      .from(ghosts)
      .where(eq(ghosts.id, pick.id));
    return Response.json({ ghost: row || null });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/ghosts" };
