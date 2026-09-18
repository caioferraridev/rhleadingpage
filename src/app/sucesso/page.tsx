"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Mail,
  User,
  Loader2,
  AlertCircle,
  Coffee,
  Users,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { WHATSAPP_GROUP_LINK } from "@/lib/whatsapp";
import { formatDate, formatTime } from "@/lib/utils";
import { firePurchase } from "@/lib/meta-pixel-client";
import { eventConfig } from "@/lib/event-config";

type RegistrationData = {
  registration: {
    id: string;
    name: string;
    email: string;
    amount_paid: number;
    is_confirmed: boolean;
    status: string;
    payment_status: string;
  };
  event: {
    id: string;
    name: string;
    event_date: string;
    start_time: string;
    end_time: string;
    location: string;
    address: string | null;
  };
};

export default function SuccessPage() {
  const [state, setState] = useState<{
    loading: boolean;
    data: RegistrationData | null;
    error: string | null;
  }>({ loading: true, data: null, error: null });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const paymentId = params.get("collection_id") ?? params.get("payment_id");
    const preferenceId = params.get("preference_id");

    if (!token && !paymentId && !preferenceId) {
      setState({ loading: false, data: null, error: null });
      return;
    }

    const query = token
      ? `token=${encodeURIComponent(token)}`
      : paymentId
      ? `payment_id=${encodeURIComponent(paymentId)}`
      : `preference_id=${encodeURIComponent(preferenceId ?? "")}`;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 8;

    async function fetchRegistration() {
      try {
        const res = await fetch(`/api/registration?${query}`);
        const json = await res.json();

        if (res.ok && json.registration?.is_confirmed) {
          firePurchase({
            registrationId: json.registration.id,
            valueBRL: (json.registration.amount_paid ?? eventConfig.price) / 100,
            contentIds: json.event?.id ? [`event-${json.event.id}`] : undefined,
          });
          if (!cancelled) setState({ loading: false, data: json, error: null });
          return;
        }

        attempts++;
        if (attempts < maxAttempts && !cancelled) {
          setState({ loading: true, data: null, error: null });
          setTimeout(fetchRegistration, 3000);
        } else {
          if (!cancelled) setState({ loading: false, data: json.registration ? json : null, error: json.error || null });
        }
      } catch {
        attempts++;
        if (attempts < maxAttempts && !cancelled) {
          setTimeout(fetchRegistration, 3000);
        } else if (!cancelled) {
          setState({
            loading: false,
            data: null,
            error: "Erro ao carregar as informações da inscrição.",
          });
        }
      }
    }

    fetchRegistration();
    return () => { cancelled = true; };
  }, []);

  const renderHeader = () => (
    <div className="bg-white rounded-3xl border border-teal-200 shadow-[0_30px_60px_-30px_rgba(1,33,74,0.4)] p-8 md:p-10 text-center">
      <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12 text-teal-600" />
      </div>
      <h1 className="text-3xl font-black text-navy mb-3">Pagamento confirmado!</h1>
      <p className="text-navy-600/80 mb-8">
        Sua inscrição foi registrada com sucesso. Sua vaga na Academia RH está
        garantida. Obrigado pela confiança!
      </p>

      {state.data && (
        <div className="text-left bg-mist rounded-xl p-6 space-y-4 border border-navy-100 mb-8">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-teal-600 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-navy-500 uppercase">Inscrito</p>
              <p className="text-navy-900 font-semibold">{state.data.registration.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-teal-600 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-navy-500 uppercase">E-mail</p>
              <p className="text-navy-900 font-medium break-all">{state.data.registration.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-teal-600 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-navy-500 uppercase">Inscrição</p>
              <p className="text-navy-900 font-semibold">{state.data.event.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-teal-600 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-navy-500 uppercase">Data</p>
              <p className="text-navy-900 font-medium capitalize">{formatDate(state.data.event.event_date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-teal-600 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-navy-500 uppercase">Horário</p>
              <p className="text-navy-900 font-medium">
                {formatTime(state.data.event.start_time)} às {formatTime(state.data.event.end_time)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-teal-600 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-navy-500 uppercase">Local</p>
              <p className="text-navy-900 font-semibold">{state.data.event.location}</p>
              {state.data.event.address && (
                <p className="text-navy-700 text-sm whitespace-pre-line">{state.data.event.address}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Coffee className="w-5 h-5 text-teal-600 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-navy-500 uppercase">Coffee Break</p>
              <p className="text-navy-900 font-semibold">Incluso no evento</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-navy to-navy-600 rounded-2xl p-6 md:p-7 text-left text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-teal-300 mb-2">
          Próximo passo
        </p>
        <h2 className="text-xl font-black mb-2">Entre no grupo oficial da Academia RH</h2>
        <p className="text-navy-100/80 text-sm leading-relaxed mb-5">
          Entre no grupo oficial da Academia RH para receber informações, orientações e
          atualizações sobre o evento.
        </p>
        <a
          href={WHATSAPP_GROUP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-teal text-base w-full py-3.5"
          aria-label="Entrar no grupo oficial do WhatsApp da Academia RH"
        >
          <WhatsAppIcon className="w-5 h-5" />
          Entrar no grupo do WhatsApp
        </a>
      </div>

      <div className="mt-8 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl p-4 text-sm">
        Você também receberá mais detalhes sobre o evento no seu e-mail. Se não encontrar,
        verifique a caixa de spam.
      </div>

      <Link href="/" className="text-teal-600 hover:text-teal-700 font-bold inline-block mt-6">
        Voltar para a página inicial
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-mist flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {state.loading && (
          <div className="bg-white rounded-3xl border border-navy-100 shadow-xl p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
            <p className="text-navy-600">Carregando informações da sua inscrição...</p>
          </div>
        )}

        {!state.loading && state.error && (
          <div className="bg-white rounded-3xl border border-navy-100 shadow-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-navy mb-3">
              Pagamento em processamento
            </h1>
            <p className="text-navy-600 mb-6">{state.error}</p>
            <p className="text-sm text-navy-500 mb-6">
              Sua vaga será confirmada automaticamente assim que o pagamento for aprovado.
              Fique de olho no seu e-mail.
            </p>
            <Link href="/" className="text-teal-600 hover:text-teal-700 font-bold">
              Voltar para a página inicial
            </Link>
          </div>
        )}

        {!state.loading && !state.error && !state.data && (
          <div className="bg-white rounded-3xl border border-navy-100 shadow-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-navy mb-3">Obrigado por fazer parte!</h1>
            <p className="text-navy-600 mb-6">
              Seu pagamento está sendo processado. A confirmação final será enviada para o
              seu e-mail assim que for aprovada.
            </p>
            <Link href="/" className="text-teal-600 hover:text-teal-700 font-bold">
              Voltar para a página inicial
            </Link>
          </div>
        )}

        {!state.loading && !state.error && state.data && state.data.registration.is_confirmed && renderHeader()}

        {!state.loading && !state.error && state.data && !state.data.registration.is_confirmed && (
          <div className="bg-white rounded-3xl border border-teal-200 shadow-xl p-8 text-center">
            <Loader2 className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-navy mb-3">Quase lá!</h1>
            <p className="text-navy-600 mb-6">
              Seu pagamento está sendo confirmado. Assim que a confirmação for concluída,
              sua vaga estará garantida. Você receberá uma confirmação por e-mail.
            </p>
            <Link href="/" className="text-teal-600 hover:text-teal-700 font-bold">
              Voltar para a página inicial
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}