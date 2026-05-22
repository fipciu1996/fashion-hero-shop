import { kv } from "@vercel/kv";

type ClickRecord = {
  visitorId: string;
  variant: string;
  at: string;
};

type SmokeStats = {
  totalUniqueClicks: number;
  perVariantUniqueClicks: Record<string, number>;
  totalEvents: number;
  recentEvents: ClickRecord[];
};

const state = {
  clicksByVisitor: new Map<string, ClickRecord>(),
  events: [] as ClickRecord[],
};

const KV_KEYS = {
  visitor: (visitorId: string) => `smoke:visitor:${visitorId}`,
  totalUnique: "smoke:total_unique",
  variants: "smoke:variants",
  events: "smoke:events",
};

function hasKvConfig() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function registerSmokeClick(visitorId: string, variant: string) {
  const normalizedVariant = variant || "unknown";
  const at = new Date().toISOString();
  const record: ClickRecord = { visitorId, variant: normalizedVariant, at };

  if (hasKvConfig()) {
    const wasSet = await kv.set(KV_KEYS.visitor(visitorId), JSON.stringify(record), { nx: true });
    const counted = wasSet === "OK";

    if (!counted) {
      return { counted: false };
    }

    await kv.incr(KV_KEYS.totalUnique);
    await kv.hincrby(KV_KEYS.variants, normalizedVariant, 1);
    await kv.lpush(KV_KEYS.events, JSON.stringify(record));
    await kv.ltrim(KV_KEYS.events, 0, 199);
    return { counted: true };
  }

  if (state.clicksByVisitor.has(visitorId)) {
    return { counted: false };
  }

  state.clicksByVisitor.set(visitorId, record);
  state.events.unshift(record);
  state.events = state.events.slice(0, 200);
  return { counted: true };
}

export async function getSmokeStats(): Promise<SmokeStats> {
  if (hasKvConfig()) {
    const [totalUniqueRaw, variantsRaw, eventsRaw, totalEventsRaw] = await Promise.all([
      kv.get<number>(KV_KEYS.totalUnique),
      kv.hgetall<Record<string, number | string>>(KV_KEYS.variants),
      kv.lrange<string[]>(KV_KEYS.events, 0, 49),
      kv.llen(KV_KEYS.events),
    ]);

    const perVariantUniqueClicks: Record<string, number> = {};
    if (variantsRaw) {
      for (const [variant, count] of Object.entries(variantsRaw)) {
        const normalizedCount = typeof count === "number" ? count : Number.parseInt(String(count), 10);
        perVariantUniqueClicks[variant] = Number.isNaN(normalizedCount) ? 0 : normalizedCount;
      }
    }

    const recentEvents: ClickRecord[] = [];
    if (eventsRaw) {
      for (const raw of eventsRaw) {
        if (typeof raw !== "string") continue;
        try {
          const parsed = JSON.parse(raw) as ClickRecord;
          if (parsed && typeof parsed.visitorId === "string" && typeof parsed.variant === "string" && typeof parsed.at === "string") {
            recentEvents.push(parsed);
          }
        } catch {
          // Ignore malformed entries.
        }
      }
    }

    return {
      totalUniqueClicks: totalUniqueRaw ?? 0,
      perVariantUniqueClicks,
      totalEvents: totalEventsRaw ?? 0,
      recentEvents,
    };
  }

  const perVariantUniqueClicks: Record<string, number> = {};

  for (const click of state.clicksByVisitor.values()) {
    perVariantUniqueClicks[click.variant] = (perVariantUniqueClicks[click.variant] ?? 0) + 1;
  }

  return {
    totalUniqueClicks: state.clicksByVisitor.size,
    perVariantUniqueClicks,
    totalEvents: state.events.length,
    recentEvents: state.events.slice(0, 50),
  };
}
