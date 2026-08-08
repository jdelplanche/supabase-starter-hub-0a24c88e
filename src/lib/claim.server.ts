/**
 * Server-only helpers for the /claim flow: reading the caller's current handle
 * and atomically writing a free handle onto their profile.
 */

export async function readMyHandle(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("username, display_name")
    .eq("id", userId)
    .maybeSingle();
  return {
    handle: (data?.username as string | null) ?? null,
    displayName: (data?.display_name as string | null) ?? null,
  };
}

export async function claimHandleFor(userId: string, raw: string) {
  const { normalizeHandle, isHandleFree } = await import("./onboarding.server");
  const normalized = normalizeHandle(raw);

  const availability = await isHandleFree(normalized);
  if (!availability.ok) {
    return { ok: false as const, handle: normalized, reason: availability.reason };
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin
    .from("profiles")
    .upsert({ id: userId, username: normalized }, { onConflict: "id" });

  if (error) {
    const taken = /duplicate|unique/i.test(error.message);
    return {
      ok: false as const,
      handle: normalized,
      reason: taken ? "That handle was just claimed by someone else." : error.message,
    };
  }

  return { ok: true as const, handle: normalized };
}
