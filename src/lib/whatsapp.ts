import { eventConfig } from "@/lib/event-config";

export const WHATSAPP_NUMBER = eventConfig.whatsappNumber;
export const WHATSAPP_MESSAGE = eventConfig.whatsappMessage;
export const WHATSAPP_GROUP_LINK = eventConfig.whatsappGroupLink;

export function getWhatsAppLink(message: string = WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppDisplayNumber(): string {
  const ddd = WHATSAPP_NUMBER.slice(2, 4);
  const first = WHATSAPP_NUMBER.slice(4, 9);
  const second = WHATSAPP_NUMBER.slice(9);
  return `(${ddd}) ${first}-${second}`;
}