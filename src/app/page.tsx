import { getAdminClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { WhoFor } from "@/components/sections/who-for";
import { Speaker } from "@/components/sections/speaker";
import { EventInfo } from "@/components/sections/event-info";
import { RegistrationSection } from "@/components/sections/registration";
import { FAQ } from "@/components/sections/faq";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { eventConfig } from "@/lib/event-config";
import { jsonLdSafe } from "@/lib/security";
import { SITE_URL } from "@/lib/site-url";

async function getEventData() {
  try {
    const supabase = getAdminClient();
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "active")
      .single();

    if (error || !event) {
      return null;
    }

    const { count } = await supabase
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .eq("event_id", event.id)
      .eq("registration_status", "confirmed")
      .eq("payment_status", "paid");

    const confirmedCount = count ?? 0;
    const spotsLeft = event.capacity - confirmedCount;

    return {
      event,
      isSoldOut: spotsLeft <= 0,
    };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const data = await getEventData();

  const fallbackEvent = {
    id: "fallback",
    name: eventConfig.name,
    description: eventConfig.description,
    event_date: eventConfig.date,
    start_time: eventConfig.startTime,
    end_time: eventConfig.endTime,
    location: eventConfig.location,
    address: eventConfig.address,
    capacity: eventConfig.capacity,
    price: eventConfig.price,
    status: "active" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const event = data?.event ?? fallbackEvent;
  const isSoldOut = data?.isSoldOut ?? false;
  const loading = false;

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <Hero
          event={event}
          isSoldOut={isSoldOut}
          loading={loading}
        />
        <About />
        <WhoFor />
        <Speaker />
        <EventInfo event={event} />
        <RegistrationSection
          event={event}
          isSoldOut={isSoldOut}
          loading={loading}
        />
        <FAQ />
      </main>
      <Footer />
      <MobileStickyCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdSafe({
            "@context": "https://schema.org",
            "@type": "Event",
            name: eventConfig.name,
            startDate: `${event.event_date}T${event.start_time}`,
            endDate: `${event.event_date}T${event.end_time}`,
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: {
              "@type": "Place",
              name: event.location,
              address: {
                "@type": "PostalAddress",
                streetAddress: event.address,
                addressLocality: "Bauru",
                addressRegion: "SP",
                addressCountry: "BR",
              },
            },
            offers: {
              "@type": "Offer",
              url: `${SITE_URL}/`,
              price: event.price / 100,
              priceCurrency: "BRL",
              availability:
                isSoldOut
                  ? "https://schema.org/SoldOut"
                  : "https://schema.org/InStock",
            },
          }),
        }}
      />
    </>
  );
}
