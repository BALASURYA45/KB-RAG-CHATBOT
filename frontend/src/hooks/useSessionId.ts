import { useMemo } from "react";

function createSessionId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useSessionId() {
  return useMemo(createSessionId, []);
}
