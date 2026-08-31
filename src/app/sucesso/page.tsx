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
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

type RegistrationData = {
  registration: {
    name: string;
    email: string;
    is_confirmed: boolean;
    status: string;
    payment_status: string;
  };
  event: {
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
    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    if (!sessionId) {
      setState({ loading: false, data: null, error: null });
      return;
    }

    async function fetchRegistration() {
      try {
        const res = await fetch(`/api/registration?session_id=${sessionId}`);
        const json = await res.json();

        if (!res.ok) {
          setState({ loading: false, data: null, error: json.error || "Erro ao carregar." });
          return;
        }

        setState({ loading: false, data: json, error: null });
      } catch {
        setState({
          loading: false,
          data: null,
          error: "Erro ao carregar as informações da inscrição.",
        });
      }
    }

    fetchRegistration();
  }, []);

  const renderHeader = () => (
    <div className="bg-white rounded-3xl border border-green-200 shadow-xl p-8 md:p-10 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-3">Inscrição confirmada!</h1>
      <p className="text-slate-600 mb-8">
        Sua vaga na Academia RH está garantida. Obrigado pela confiança!
      </p>

      <div className="text-left bg-slate-50 rounded-xl p-6 space-y-4">
        {state.data && (
          <>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Inscrito</p>
                <p className="text-slate-900 font-medium">{state.data.registration.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">E-mail</p>
                <p className="text-slate-900 font-medium break-all">{state.data.registration.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Evento</p>
                <p className="text-slate-900 font-medium">{state.data.event.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Data e horário</p>
                <p className="text-slate-900 font-medium capitalize">
                  {formatDate(state.data.event.event_date)} ·{" "}
                  {formatTime(state.data.event.start_time)} às {formatTime(state.data.event.end_time)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Local</p>
                <p className="text-slate-900 font-medium">
                  {state.data.event.location}
                  {state.data.event.address && ` - ${state.data.event.address}`}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm">
        Você receberá mais detalhes sobre o evento no seu e-mail. Se não encontrar,
        verifique a caixa de spam.
      </div>

      <Link href="/" className="text-amber-600 hover:text-amber-700 font-semibold inline-block mt-6">
        Voltar para a página inicial
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {state.loading && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-slate-600">Carregando informações da sua inscrição...</p>
          </div>
        )}

        {!state.loading && state.error && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Pagamento em processamento
            </h1>
            <p className="text-slate-600 mb-6">{state.error}</p>
            <p className="text-sm text-slate-500 mb-6">
              Sua vaga será confirmada automaticamente assim que o pagamento for aprovado.
              Fique de olho no seu e-mail.
            </p>
            <Link href="/" className="text-amber-600 hover:text-amber-700 font-semibold">
              Voltar para a página inicial
            </Link>
          </div>
        )}

        {!state.loading && !state.error && !state.data && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Obrigado por fazer parte!</h1>
            <p className="text-slate-600 mb-6">
              Seu pagamento está sendo processado. A confirmação final será enviada para o
              seu e-mail assim que for aprovada.
            </p>
            <Link href="/" className="text-amber-600 hover:text-amber-700 font-semibold">
              Voltar para a página inicial
            </Link>
          </div>
        )}

        {!state.loading && !state.error && state.data && state.data.registration.is_confirmed && renderHeader()}

        {!state.loading && !state.error && state.data && !state.data.registration.is_confirmed && (
          <div className="bg-white rounded-3xl border border-amber-200 shadow-xl p-8 text-center">
            <Loader2 className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Quase lá!</h1>
            <p className="text-slate-600 mb-6">
              Seu pagamento está sendo confirmado. Assim que a confirmação for concluída,
              sua vaga estará garantida. Você receberá uma confirmação por e-mail.
            </p>
            <Link href="/" className="text-amber-600 hover:text-amber-700 font-semibold">
              Voltar para a página inicial
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
