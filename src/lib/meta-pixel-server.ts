import { createHash } from "node:crypto";
import { eventConfig } from "@/lib/event-config";
import {
  purchaseEventId,
  PURCHASE_CONTENT_TYPE,
  PURCHASE_CURRENCY,
} from "@/lib/tracking";

const META_GRAPH_VERSION = "v21.0";

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return digits;
}

export async function sendPurchaseEvent(options: {
  registrationId: string;
  email: string;
  phone?: string | null;
  valueBRL: number;
  contentIds?: string[];
}): Promise<void> {
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn(
      "Meta Purchase (CAPI) ignorado: META_ACCESS_TOKEN não configurado."
    );
    return;
  }

  try {
    const userData: Record<string, string[]> = {
      em: [hash(normalizeEmail(options.email))],
      external_id: [hash(options.registrationId)],
    };

    if (options.phone) {
      userData.ph = [hash(normalizePhone(options.phone))];
    }

    const customData: Record<string, string | number | string[]> = {
      currency: PURCHASE_CURRENCY,
      value: options.valueBRL,
      num_items: 1,
      content_type: PURCHASE_CONTENT_TYPE,
    };

    if (options.contentIds && options.contentIds.length > 0) {
      customData.content_ids = options.contentIds;
    }

    const response = await fetch(
      `https://graph.facebook.com/${META_GRAPH_VERSION}/${eventConfig.metaPixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: "Purchase",
              event_time: Math.floor(Date.now() / 1000),
              event_id: purchaseEventId(options.registrationId),
              action_source: "website",
              user_data: userData,
              custom_data: customData,
            },
          ],
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Meta Purchase (CAPI) erro:",
        response.status,
        await response.text()
      );
    }
  } catch (error) {
    console.error("Meta Purchase (CAPI) falhou (não-bloqueante):", error);
  }
}