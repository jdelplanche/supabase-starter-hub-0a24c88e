/**
 * Handle allocation rules shared by the onboarding form, the public API and the
 * admin portal. Client-safe: no server-only imports.
 *
 * Short handles (3–4 characters) are a scarce resource. They can never be
 * claimed through normal signup — only a super admin can grant one, and only to
 * a verified account ("VIP handle grant").
 */

export const SHORT_HANDLE_MIN = 3;
export const SHORT_HANDLE_MAX = 4;

/**
 * Mirrors the `profiles_short_handle_rule` database trigger: 3- and 4-character
 * handles are reserved for admin VIP grants, everything from 5 characters up is
 * free to claim. Keep this in sync with the SQL trigger.
 */
export const SHORT_HANDLE_RESERVATION_ENABLED = true;

/** Marker stored in `profiles.handle_grant` when an admin granted a short handle. */
export const VIP_HANDLE_GRANT = "vip";

export const SHORT_HANDLE_MESSAGE =
  "3- and 4-character handles are reserved. Request one from the ROUT team.";

export function normalizeHandleInput(raw: string): string {
  return raw.trim().replace(/^@/, "").toLowerCase();
}

/** True for a handle of exactly 3 or 4 characters, i.e. the protected range. */
export function isShortHandle(handle: string): boolean {
  const len = normalizeHandleInput(handle).length;
  return len >= SHORT_HANDLE_MIN && len <= SHORT_HANDLE_MAX;
}

/**
 * True only when the handle falls in the protected range (exactly 3–4
 * characters) AND the reservation is currently active. Handles of 5+
 * characters never need a grant.
 */
export function needsVipGrant(handle: string): boolean {
  if (!SHORT_HANDLE_RESERVATION_ENABLED) return false;
  return isShortHandle(handle);
}

export const TOO_SHORT_MESSAGE = "Handle must be at least 3 characters long.";

export const RESERVED_LENGTH_MESSAGE =
  "3- and 4-character handles are reserved. Contact support or enter 5+ characters.";

/**
 * The single source of truth for length-based handle errors, shared by the
 * signup form and the admin portal so the copy can never contradict itself.
 * Returns `null` when the length is acceptable (3+ characters, or 5+ while the
 * short-handle reservation is active).
 */
export function handleLengthMessage(handle: string): string | null {
  const len = normalizeHandleInput(handle).length;
  if (len === 0) return null;
  if (len < SHORT_HANDLE_MIN) return TOO_SHORT_MESSAGE;
  if (SHORT_HANDLE_RESERVATION_ENABLED && len <= SHORT_HANDLE_MAX) return RESERVED_LENGTH_MESSAGE;
  return null;
}

