import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { MongoClient, ObjectId } from "https://deno.land/x/mongo@v0.34.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Whitelist collections the client may touch — prevents arbitrary access.
const ALLOWED_COLLECTIONS = new Set(["artworks", "messages", "notes"]);

// Cache the client across invocations (Deno keeps the isolate warm).
let cachedClient: MongoClient | null = null;
async function getDb() {
  const uri = Deno.env.get("MONGODB_URI");
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (!cachedClient) {
    cachedClient = new MongoClient();
    await cachedClient.connect(uri);
  }
  // Extract db name from URI path (…/dbname?…) or default
  const match = uri.match(/\/([^/?]+)(\?|$)/);
  const dbName = match?.[1] || "sharosa";
  return cachedClient.database(dbName);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Convert string _id to ObjectId where applicable
function normalizeFilter(filter: Record<string, unknown> = {}) {
  if (filter._id && typeof filter._id === "string") {
    try {
      filter._id = new ObjectId(filter._id);
    } catch { /* leave as-is */ }
  }
  return filter;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // --- Auth: require a logged-in user ---
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, 401);
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData, error: claimsErr } = await supabase.auth.getUser(token);
  if (claimsErr || !claimsData?.user) return json({ error: "Unauthorized" }, 401);
  const userId = claimsData.user.id;

  // --- Parse body ---
  let body: {
    action: "find" | "findOne" | "insertOne" | "updateOne" | "deleteOne" | "count";
    collection: string;
    filter?: Record<string, unknown>;
    document?: Record<string, unknown>;
    update?: Record<string, unknown>;
    options?: { limit?: number; sort?: Record<string, 1 | -1>; skip?: number };
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { action, collection } = body;
  if (!action || !collection) return json({ error: "action and collection are required" }, 400);
  if (!ALLOWED_COLLECTIONS.has(collection)) {
    return json({ error: `Collection '${collection}' is not allowed` }, 403);
  }

  try {
    const db = await getDb();
    const col = db.collection(collection);
    const opts = body.options ?? {};
    const limit = Math.min(opts.limit ?? 100, 500); // hard cap

    switch (action) {
      case "find": {
        const docs = await col
          .find(normalizeFilter(body.filter ?? {}))
          .sort(opts.sort ?? { _id: -1 })
          .skip(opts.skip ?? 0)
          .limit(limit)
          .toArray();
        return json({ data: docs });
      }
      case "findOne": {
        const doc = await col.findOne(normalizeFilter(body.filter ?? {}));
        return json({ data: doc });
      }
      case "insertOne": {
        if (!body.document) return json({ error: "document required" }, 400);
        const doc = {
          ...body.document,
          _createdBy: userId,
          _createdAt: new Date(),
        };
        const r = await col.insertOne(doc);
        return json({ data: { _id: r.insertedId, ...doc } });
      }
      case "updateOne": {
        if (!body.filter || !body.update) {
          return json({ error: "filter and update required" }, 400);
        }
        const r = await col.updateOne(
          normalizeFilter(body.filter),
          { ...body.update, $set: { ...(body.update.$set as object ?? {}), _updatedAt: new Date(), _updatedBy: userId } },
        );
        return json({ data: { matched: r.matchedCount, modified: r.modifiedCount } });
      }
      case "deleteOne": {
        if (!body.filter) return json({ error: "filter required" }, 400);
        const r = await col.deleteOne(normalizeFilter(body.filter));
        return json({ data: { deleted: r } });
      }
      case "count": {
        const n = await col.countDocuments(normalizeFilter(body.filter ?? {}));
        return json({ data: { count: n } });
      }
      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err) {
    console.error("Mongo error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: msg }, 500);
  }
});
