export interface Event {
  id: string;
  name: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  address: string | null;
  capacity: number;
  price: number;
  status: "active" | "inactive" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string | null;
  mercadopago_payment_id: string | null;
  mercadopago_preference_id: string | null;
  amount_paid: number;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  registration_status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface WaitlistEntry {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string | null;
  status: "waiting" | "notified" | "registered";
  created_at: string;
}

export type EmailNotificationStatus = "pending" | "sending" | "sent" | "failed";

export interface EmailNotification {
  id: string;
  registration_id: string;
  email: string;
  type: string;
  scheduled_for: string;
  sent_at: string | null;
  status: EmailNotificationStatus;
  provider_message_id: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventAvailability {
  event: Event;
  confirmed_count: number;
  spots_left: number;
  is_sold_out: boolean;
  is_last_spots: boolean;
}

export interface ReserveSpotResult {
  success: boolean;
  registration_id?: string;
  spots_left?: number;
  error?: string;
  message?: string;
}

export interface ConfirmRegistrationResult {
  success: boolean;
  registration_id?: string;
  event_name?: string;
  event_date?: string;
  event_start_time?: string;
  event_location?: string;
  error?: string;
  message?: string;
}

export interface WaitlistResult {
  success: boolean;
  error?: string;
  message?: string;
}
