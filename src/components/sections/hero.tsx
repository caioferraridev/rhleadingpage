"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Users, ChevronDown } from "lucide-react";
import { eventConfig } from "@/lib/event-config";
import { formatPrice, formatDateShort, formatTime } from "@/lib/utils";
import type { Event } from "@/types/database";

interface HeroProps {
  event: Event;
  spotsLeft: number;
  isSoldOut: boolean;
  isLastSpots: boolean;
  loading?: boolean;
}

export function Hero({ event, spotsLeft, isSoldOut, isLastSpots, loading }: HeroProps) {
  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSoldOut) return;
    document.getElementById("inscricao")?.scrollIntoView({ behavior: "smooth" });
  };

  const badge = useMemo(() => {
    if (isSoldOut) return { text: "VAGAS ESGOTADAS", className: "bg-red-100 text-red-700 border-red-200" };
    if (isLastSpots) return { text: "ÚLTIMAS VAGAS", className: "bg-red-100 text-red-700 border-red-200" };
    return { text: `${spotsLeft} VAGAS DISPONÍVEIS`, className: "bg-green-100 text-green-700 border-green-200" };
  }, [isSoldOut, isLastSpots, spotsLeft]);

  const ctaText = isSoldOut ? "VAGAS ESGOTADAS" : "QUERO GARANTIR MINHA VAGA";

  return (
    <section id="topo" className="relative pt-16 md:pt-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="order-2 lg:order-1">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-bold text-xs mb-6 ${badge.className}`}>
            <Users className="w-4 h-4" />
            {badge.text}
            {!isSoldOut && loading === false && (
              <span className="font-normal">· {spotsLeft} de {event.capacity} restantes</span>
            )}
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Dê o primeiro passo na sua carreira em{" "}
            <span className="text-amber-500">RH e Recrutamento</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
            Palestra presencial para quem está começando ou quer começar a atuar na área
            de RH. Aprenda na prática como funcionam os processos seletivos e o mundo do
            recrutamento.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8 text-sm text-slate-700">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-3">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span className="capitalize">{formatDateShort(event.event_date)}</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-3">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>{formatTime(event.start_time)} às {formatTime(event.end_time)}</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-3">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div>
              <p className="text-2xl font-bold text-slate-900">{formatPrice(event.price)}</p>
              <p className="text-sm text-slate-500">investimento único</p>
            </div>
            <button
              onClick={handleCtaClick}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-lg transition-colors shadow-lg shadow-amber-500/30 w-full sm:w-auto"
            >
              {ctaText}
            </button>
          </div>
        </div>

        <div className="order-1 lg:order-2 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-md mx-auto bg-slate-100">
            <Image
              src={eventConfig.speaker.imageUrl}
              alt={eventConfig.speaker.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6">
              <p className="text-white text-xl font-bold">{eventConfig.speaker.name}</p>
              <p className="text-white/80 text-sm">{eventConfig.speaker.role}</p>
            </div>
          </div>
        </div>
      </div>

      <ChevronDown className="hidden lg:block w-6 h-6 text-slate-400 mx-auto mb-8 animate-bounce" />
    </section>
  );
}
