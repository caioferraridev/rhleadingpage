"use client";

import {
  purchaseEventId,
  PURCHASE_CONTENT_TYPE,
  PURCHASE_CURRENCY,
} from "@/lib/tracking";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    fbqQueue?: unknown[][];
  }
}

const firedEventIds = new Set<string>();

function dispatchWhenReady(params: Record<string, unknown>, attempt = 0) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Purchase", params);
    return;
  }

  if (attempt >= 50) {
    return;
  }

  window.setTimeout(() => dispatchWhenReady(params, attempt + 1), 100);
}

function dispatchFunnelEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  if (typeof window.fbq !== "function") {
    if (!window.fbqQueue) window.fbqQueue = [];
    window.fbqQueue.push(["track", name, params]);
    return;
  }

  window.fbq("track", name, params);
}

interface FunnelEvent {
  valueBRL: number;
  contentIds: string[];
}

/** Visualização da oferta na landing page. */
export function fireViewContent({ valueBRL, contentIds }: FunnelEvent) {
  dispatchFunnelEvent("ViewContent", {
    value: valueBRL,
    currency: PURCHASE_CURRENCY,
    content_type: PURCHASE_CONTENT_TYPE,
    content_ids: contentIds,
  });
}

/** Usuário abriu o formulário de inscrição (início do checkout). */
export function fireInitiateCheckout({ valueBRL, contentIds }: FunnelEvent) {
  dispatchFunnelEvent("InitiateCheckout", {
    value: valueBRL,
    currency: PURCHASE_CURRENCY,
    content_type: PURCHASE_CONTENT_TYPE,
    content_ids: contentIds,
    num_items: 1,
  });
}

export function firePurchase(options: {
  registrationId: string;
  valueBRL: number;
  contentIds?: string[];
}) {
  const eventId = purchaseEventId(options.registrationId);

  if (firedEventIds.has(eventId)) {
    return;
  }
  firedEventIds.add(eventId);

  const params: Record<string, unknown> = {
    value: options.valueBRL,
    currency: PURCHASE_CURRENCY,
    content_type: PURCHASE_CONTENT_TYPE,
    eventID: eventId,
  };

  if (options.contentIds && options.contentIds.length > 0) {
    params.content_ids = options.contentIds;
  }

  dispatchWhenReady(params);
}