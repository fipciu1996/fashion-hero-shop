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

export function registerSmokeClick(visitorId: string, variant: string) {
  const normalizedVariant = variant || "unknown";
  const at = new Date().toISOString();
  const record: ClickRecord = { visitorId, variant: normalizedVariant, at };

  if (state.clicksByVisitor.has(visitorId)) {
    return { counted: false };
  }

  state.clicksByVisitor.set(visitorId, record);
  state.events.unshift(record);
  state.events = state.events.slice(0, 200);
  return { counted: true };
}

export function getSmokeStats(): SmokeStats {
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
