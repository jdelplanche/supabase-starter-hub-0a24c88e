interface CheckHandleResult {
  allowed: boolean;
  reason?: "too_short" | "reserved" | "taken" | "ok";
  message?: string;
}

export function validateHandle(handle: string, isVipGranted: boolean): CheckHandleResult {
  const cleanHandle = handle.trim().toLowerCase();

  if (cleanHandle.length < 3) {
    return {
      allowed: false,
      reason: "too_short",
      message: "Een handle moet minimaal 3 tekens lang zijn.",
    };
  }

  if (cleanHandle.length >= 3 && cleanHandle.length <= 4) {
    if (!isVipGranted) {
      return {
        allowed: false,
        reason: "reserved",
        message: `De handle "${cleanHandle}" bestaat uit ${cleanHandle.length} tekens en is gereserveerd. Vraag een VIP-grant aan of kies een langere handle.`,
      };
    }
  }

  return {
    allowed: true,
    reason: "ok",
    message: "Handle is beschikbaar!",
  };
}

export type { CheckHandleResult };
