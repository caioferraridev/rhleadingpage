"use client";

import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  Users,
  GraduationCap,
  Coffee,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { eventConfig } from "@/lib/event-config";
import { formatPrice, formatInstallment, formatDateShort, formatTime } from "@/lib/utils";
import { SpotsIndicator } from "@/components/ui/spots-indicator";
import { openRegistration } from "@/lib/registration-cta";
import type { Event } from "@/types/database";

interface HeroProps {
  event: Event;
  isSoldOut: boolean;
  loading?: boolean;
}

export function Hero({ event, isSoldOut, loading }: HeroProps) {
  const handleCtaClick = () => {
    if (isSoldOut) return;
    openRegistration();
  };

  const total = formatPrice(event.price);
  const installment = formatInstallment(event.price, eventConfig.installmentMonths);

  return (
    <section
      id="topo"
      className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-gradient-to-b from-mist via-white to-white"
    >
      {/* Decorative brand rings / curves (subtle, derived from logo) */}
      <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-teal-100/40 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute top-40 -left-32 w-80 h-80 rounded-full bg-navy-100/50 blur-3xl pointer-events-none" aria-hidden />
      <div className="brand-ring hidden lg:block w-52 h-52 -top-10 left-[8%]" aria-hidden />
      <div className="brand-ring hidden lg:block w-40 h-40 bottom-20 right-[4%]" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          {/* Text column */}
          <div className="order-2 lg:order-1 animate-fade-up">
            {/* Small brand label */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-6 h-6 rounded-md bg-navy flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-teal-300" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-navy-500">
                Academia RH · Bauru/SP
              </span>
            </div>

            <SpotsIndicator isSoldOut={isSoldOut} loading={loading} />

            <div className="mt-6 mb-4">
              <span className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-3.5 py-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" aria-hidden />
                <span className="text-[0.7rem] font-bold uppercase tracking-widest text-teal-700">
                  Primeira edição
                </span>
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black text-navy leading-[1.08] mb-5 tracking-tight">
              <span className="text-brand-gradient">Recrutamento e Seleção</span> na Prática
            </h1>

            <p className="text-lg md:text-xl text-navy-600/80 leading-relaxed max-w-xl mb-8">
              {eventConfig.heroSubtitle}
            </p>

            {/* Event meta */}
            <div className="flex flex-wrap gap-3 mb-9 text-sm text-navy-700">
              <div className="flex items-center gap-2.5 bg-white border border-navy-100 rounded-xl px-4 py-3 shadow-sm">
                <span className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-teal-600" />
                </span>
                <span className="capitalize font-semibold">{formatDateShort(event.event_date)}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white border border-navy-100 rounded-xl px-4 py-3 shadow-sm">
                <span className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-teal-600" />
                </span>
                <span className="font-semibold">
                  {formatTime(event.start_time)} às {formatTime(event.end_time)}
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-white border border-navy-100 rounded-xl px-4 py-3 shadow-sm">
                <span className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-teal-600" />
                </span>
                <span className="font-semibold">{event.location}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 shadow-sm">
                <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-teal-600" />
                </span>
                <span className="font-semibold text-teal-700">Coffee Break incluso</span>
              </div>
            </div>

            {/* Price + installment + CTA */}
            <div className="rounded-2xl border border-navy-100 bg-white/80 backdrop-blur p-5 sm:p-6 mb-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-4xl font-black text-navy leading-none">
                  {eventConfig.installmentMonths}x de {installment}
                </p>
                <p className="text-sm font-semibold text-navy-600">no cartão de crédito</p>
              </div>
              <p className="text-sm font-semibold text-navy-500 mt-2">
                Total: <span className="text-navy-800">{total}</span>
              </p>
            </div>

            <button
              onClick={handleCtaClick}
              className="btn-brand text-base sm:text-lg w-full sm:w-auto px-7 py-4"
            >
              {isSoldOut ? "VAGAS ESGOTADAS" : "GARANTIR MINHA INSCRIÇÃO"}
              {!isSoldOut && <CreditCard className="w-5 h-5" />}
            </button>

            <p className="flex items-center gap-2 text-xs text-navy-500 mt-4">
              <Users className="w-4 h-4 text-teal-600" aria-hidden />
              Pagamento seguro processado pelo Mercado Pago.
            </p>
          </div>

          {/* Photo column */}
          <div className="order-1 lg:order-2 relative animate-fade-up animate-fade-up-delay-1">
            <div className="relative max-w-sm mx-auto lg:max-w-none">
              {/* Framed photo */}
              <div className="relative rounded-[1.6rem] overflow-hidden shadow-[0_40px_80px_-30px_rgba(1,33,74,0.5)] border-4 border-white aspect-[4/5] bg-navy-100">
                <Image
                  src={eventConfig.speaker.imageUrl}
                  alt={eventConfig.speaker.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                  priority
                />
                {/* Brand overlay label */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 text-xs font-bold text-navy shadow-sm">
                    <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                    Academia RH
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-dark via-navy-dark/60 to-transparent p-6 pt-16">
                  <p className="text-white text-xl font-bold">{eventConfig.speaker.name}</p>
                  <p className="text-teal-200/90 text-sm font-medium">{eventConfig.speaker.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChevronDown className="hidden lg:block w-6 h-6 text-navy-300 mx-auto mt-14 animate-bounce" aria-hidden />
    </section>
  );
}