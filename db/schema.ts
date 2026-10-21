import { pgTable, serial, text, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";

/**
 * 背包快照（「幽灵」）：每个玩家每回合开战前上传一份自己的构筑，
 * 其他玩家打到同一回合时就从这里随机抽一份当对手 —— 和原作一样的异步 PvP。
 */
export const ghosts = pgTable(
  "ghosts",
  {
    id: serial().primaryKey(),
    runId: text("run_id").notNull(),
    playerName: text("player_name").notNull(),
    classId: text("class_id").notNull(),
    branchId: text("branch_id"),
    round: integer().notNull(),
    wins: integer().notNull().default(0),
    losses: integer().notNull().default(0),
    hp: integer().notNull(),
    board: jsonb().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("ghosts_round_idx").on(t.round, t.createdAt)],
);

/** 每局的最终战绩，用于排行榜；同一局重复上报按 run_id 覆盖 */
export const runs = pgTable(
  "runs",
  {
    id: serial().primaryKey(),
    runId: text("run_id").notNull().unique(),
    playerName: text("player_name").notNull(),
    classId: text("class_id").notNull(),
    branchName: text("branch_name"),
    round: integer().notNull(),
    wins: integer().notNull(),
    losses: integer().notNull(),
    score: integer().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("runs_score_idx").on(t.score)],
);
