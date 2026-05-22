export const ADMIN_AUTH_COOKIE = "fh_admin_auth";
export const SMOKE_VISITOR_COOKIE = "fh_smoke_visitor";

export function makeVisitorId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
