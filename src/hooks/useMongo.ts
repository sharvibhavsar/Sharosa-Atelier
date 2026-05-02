import { supabase } from "../integrations/supabase/client";

type FindOpts = { limit?: number; sort?: Record<string, 1 | -1>; skip?: number };

async function call<T = unknown>(payload: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("mongo", { body: payload });
  if (error) throw error;
  if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
  return (data as { data: T }).data;
}

/**
 * Tiny client for the `mongo` edge function.
 * Requires the user to be logged in (the function validates the JWT).
 *
 * Example:
 *   const docs = await mongo.find("messages", { archived: false }, { limit: 20 });
 *   await mongo.insertOne("messages", { name: "Sha", text: "hi" });
 */
export const mongo = {
  find: <T = Record<string, unknown>>(collection: string, filter: Record<string, unknown> = {}, options: FindOpts = {}) =>
    call<T[]>({ action: "find", collection, filter, options }),

  findOne: <T = Record<string, unknown>>(collection: string, filter: Record<string, unknown>) =>
    call<T | null>({ action: "findOne", collection, filter }),

  insertOne: <T = Record<string, unknown>>(collection: string, document: Record<string, unknown>) =>
    call<T>({ action: "insertOne", collection, document }),

  updateOne: (collection: string, filter: Record<string, unknown>, update: Record<string, unknown>) =>
    call<{ matched: number; modified: number }>({ action: "updateOne", collection, filter, update }),

  deleteOne: (collection: string, filter: Record<string, unknown>) =>
    call<{ deleted: number }>({ action: "deleteOne", collection, filter }),

  count: (collection: string, filter: Record<string, unknown> = {}) =>
    call<{ count: number }>({ action: "count", collection, filter }),
};
