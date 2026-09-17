import { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export const NAME_MAX_LENGTH = 200;
export const PHONE_MAX_LENGTH = 40;
export const EMAIL_MAX_LENGTH = 254;

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > EMAIL_MAX_LENGTH) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function sanitizeName(name: string): string {
  const cleaned = name
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.slice(0, NAME_MAX_LENGTH);
}

export interface JsonBodyError {
  status: number;
  message: string;
}

export async function readJsonBody(
  request: NextRequest,
  maxBytes: number
): Promise<unknown> {
  const text = await request.text();
  if (text.length > maxBytes) {
    const error = new Error("Payload too large") as Error & { status?: number };
    error.status = 413;
    throw error;
  }
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    const error = new Error("Invalid JSON") as Error & { status?: number };
    error.status = 400;
    throw error;
  }
}

export function errorStatus(err: unknown): number {
  return typeof err === "object" && err !== null && "status" in err
    ? (Number((err as { status?: number }).status) || 500)
    : 500;
}

export function jsonLdSafe(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}