"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Users,
  UserCheck,
  Clock,
  ListOrdered,
  Loader2,
  LogOut,
  RefreshCw,
  Calendar,
  XCircle,
  Wallet,
  Search,
  UserX,
} from "lucide-react";
import { formatPrice, formatDateShort } from "@/lib/utils";
import { eventConfig } from "@/lib/event-config";
import type { Event, Registration, WaitlistEntry } from "@/types/database";

interface AdminData {
  event: Event;
  registrations: Registration[];
  waitlist: WaitlistEntry[];
  stats: {
    total_registrations: number;
    confirmed: number;
    pending: number;
    failed: number;
    cancelled: number;
    total_received: number;
    spots_left: number;
    waitlist_count: number;
  };
}

const AUTH_KEY = "academia_rh_admin_token";

function formatDateBR(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortId(id: string): string {
  if (id.length <= 12) return id;
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}

function registrationStatusLabel(status: string): string {
  switch (status) {
    case "confirmed":
      return "Confirmada";
    case "pending":
      return "Pendente";
    case "cancelled":
      return "Cancelada";
    default:
      return status;
  }
}

function paymentStatusLabel(status: string): string {
  switch (status) {
    case "paid":
      return "Pago";
    case "pending":
      return "Pendente";
    case "failed":
      return "Falhou";
    case "refunded":
      return "Reembolsado";
    default:
      return status;
  }
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const token = localStorage.getItem(AUTH_KEY);
      if (token) {
        setAuthed(true);
      }
    } catch {
      // storage indisponível (ex.: modo privado restrito) — segue para o login
    }
    setAuthChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const token = password.trim();

    try {
      const res = await fetch("/api/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        setAuthError("Senha incorreta.");
        setAuthLoading(false);
        return;
      }

      if (res.status === 429) {
        setAuthError("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
        setAuthLoading(false);
        return;
      }

      if (!res.ok) {
        setAuthError("Erro ao autenticar.");
        setAuthLoading(false);
        return;
      }

      try {
        localStorage.setItem(AUTH_KEY, token);
      } catch {
        // armazenamento indisponível: mantém autenticado apenas em memória
      }
      setAuthed(true);
      setAuthLoading(false);
    } catch {
      setAuthError("Erro ao autenticar.");
      setAuthLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    let token = "";
    try {
      token = localStorage.getItem(AUTH_KEY) ?? "";
    } catch {
      token = "";
    }
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        try {
          localStorage.removeItem(AUTH_KEY);
        } catch {
          // ignore
        }
        setAuthed(false);
        setLoading(false);
        return;
      }

      if (res.status === 429) {
        setError("Muitas tentativas. Aguarde alguns minutos.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError("Erro ao carregar dados.");
        setLoading(false);
        return;
      }

      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch {
      setError("Erro ao carregar dados.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) {
      fetchData();
    }
  }, [authed, fetchData]);

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      // ignore
    }
    setAuthed(false);
    setData(null);
  };

  const filteredRegistrations = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data.registrations;
    return data.registrations.filter((r) =>
      [r.name, r.email, r.phone ?? "", r.id].some((field) =>
        field.toLowerCase().includes(q)
      )
    );
  }, [data, search]);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <div className="bg-white rounded-3xl border border-navy-100 shadow-[0_30px_60px_-30px_rgba(1,33,74,0.4)] p-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy to-navy-600 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-6 h-6 text-teal-300" />
            </div>
            <h1 className="text-2xl font-black text-navy mb-2 text-center">
              Painel Administrativo
            </h1>
            <p className="text-navy-500 text-sm text-center mb-6">
              Área restrita · Academia RH
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">
                  Senha de acesso
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-navy-800 placeholder:text-navy-300"
                  placeholder="Digite a senha"
                  required
                  autoComplete="current-password"
                />
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full btn-brand px-6 py-3 disabled:opacity-50"
              >
                {authLoading ? "Verificando..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button onClick={fetchData} className="text-teal-600 font-bold">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const stats = [
    {
      label: "Total de inscrições",
      value: `${data.stats.total_registrations}`,
      icon: Users,
      color: "text-navy bg-navy-50",
    },
    {
      label: "Confirmadas · pagas",
      value: `${data.stats.confirmed}`,
      icon: UserCheck,
      color: "text-teal-600 bg-teal-50",
    },
    {
      label: "Pendentes",
      value: `${data.stats.pending}`,
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Canceladas",
      value: `${data.stats.cancelled}`,
      icon: XCircle,
      color: "text-red-500 bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-mist">
      <header className="bg-navy text-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">Painel Administrativo</h1>
            <p className="text-sm text-navy-200">
              Academia RH · {eventConfig.editionTitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Atualizar dados"
              aria-label="Atualizar dados"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Sair"
              aria-label="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Event info */}
        <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-8">
          <div className="flex flex-wrap gap-x-6 gap-y-4 text-sm">
            <div>
              <p className="text-xs text-navy-500 uppercase font-bold">Evento</p>
              <p className="font-semibold text-navy">{data.event.name}</p>
            </div>
            <div>
              <p className="text-xs text-navy-500 uppercase font-bold">Tema da 1ª edição</p>
              <p className="font-semibold text-navy">Recrutamento e Seleção</p>
            </div>
            <div>
              <p className="text-xs text-navy-500 uppercase font-bold">Data</p>
              <p className="font-semibold text-navy flex items-center gap-1">
                <Calendar className="w-4 h-4 text-teal-600" />
                {formatDateShort(data.event.event_date)} · {data.event.start_time} às{" "}
                {data.event.end_time}
              </p>
            </div>
            <div>
              <p className="text-xs text-navy-500 uppercase font-bold">Preço</p>
              <p className="font-semibold text-navy">{formatPrice(data.event.price)}</p>
            </div>
            <div>
              <p className="text-xs text-navy-500 uppercase font-bold">Local</p>
              <p className="font-semibold text-navy">{data.event.location}</p>
            </div>
          </div>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-navy-100 p-5"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-navy">{stat.value}</p>
                <p className="text-sm text-navy-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Capacity + revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="lg:col-span-3 bg-white rounded-2xl border border-navy-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-navy">Capacidade</h2>
              <span className="text-sm font-bold text-navy-500">
                Capacidade total · {data.event.capacity} participantes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="rounded-xl bg-navy-50 border border-navy-100 p-4 text-center">
                <p className="text-2xl font-black text-navy">{data.event.capacity}</p>
                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mt-1">
                  Capacidade
                </p>
              </div>
              <div className="rounded-xl bg-teal-50 border border-teal-100 p-4 text-center">
                <p className="text-2xl font-black text-teal-700">
                  {data.stats.confirmed}
                </p>
                <p className="text-xs font-semibold text-teal-700/70 uppercase tracking-wide mt-1">
                  Confirmados
                </p>
              </div>
              <div className="rounded-xl bg-mist border border-navy-100 p-4 text-center">
                <p className="text-2xl font-black text-navy">{data.stats.spots_left}</p>
                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mt-1">
                  Disponíveis
                </p>
              </div>
              <div className="rounded-xl bg-cyan-50 border border-cyan-100 p-4 text-center">
                <p className="text-2xl font-black text-cyan-700">
                  {data.stats.waitlist_count}
                </p>
                <p className="text-xs font-semibold text-cyan-700/70 uppercase tracking-wide mt-1">
                  Lista de espera
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 rounded-full bg-navy-50 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all"
                style={{
                  width: `${
                    data.event.capacity > 0
                      ? Math.min(
                          100,
                          (data.stats.confirmed / data.event.capacity) * 100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-navy-500 mt-2">
              Ocupação de vagas confirmadas/pagas. A página pública continua exibindo
              apenas &quot;Vagas limitadas&quot; e direciona para a lista de espera
              quando a capacidade é atingida.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-navy-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-teal-600" />
              </span>
              <h2 className="text-lg font-black text-navy">Recebido</h2>
            </div>
            <p className="text-3xl font-black text-navy mt-auto">
              {formatPrice(data.stats.total_received)}
            </p>
            <p className="text-sm text-navy-500 mt-1">
              Total pago via Mercado Pago
            </p>
            {data.stats.failed > 0 && (
              <p className="text-xs text-navy-500 mt-3 flex items-center gap-1">
                <UserX className="w-3.5 h-3.5 text-red-400" />
                {data.stats.failed} inscrições com pagamento falhou
              </p>
            )}
          </div>
        </div>

        {/* Registrations */}
        <div className="bg-white rounded-2xl border border-navy-100 mb-8">
          <div className="p-6 pb-4 border-b border-navy-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-navy">Inscrições</h2>
              <span className="text-sm text-navy-500">
                {data.registrations.length} registros
                {search.trim() && (
                  <span className="text-teal-600">
                    {" "}
                    · {filteredRegistrations.length} filtrados
                  </span>
                )}
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-navy-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, e-mail, telefone ou ID"
                className="w-full sm:w-80 pl-9 pr-4 py-2.5 rounded-xl border border-navy-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-sm text-navy-800 placeholder:text-navy-300"
              />
            </div>
          </div>

          {data.registrations.length === 0 ? (
            <div className="text-center py-12 text-navy-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-navy-200" />
              <p>Nenhuma inscrição registrada ainda.</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-12 text-navy-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-navy-200" />
              <p>Nenhuma inscrição encontrada para a busca.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-navy-500 text-xs uppercase">
                    <th className="px-6 py-3">Nome</th>
                    <th className="px-6 py-3">E-mail</th>
                    <th className="px-6 py-3">Telefone</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Pagamento</th>
                    <th className="px-6 py-3">Valor</th>
                    <th className="px-6 py-3">Inscrição</th>
                    <th className="px-6 py-3">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="border-t border-navy-100">
                      <td className="px-6 py-3 font-semibold text-navy whitespace-nowrap">
                        {reg.name}
                      </td>
                      <td className="px-6 py-3 text-navy-500">{reg.email}</td>
                      <td className="px-6 py-3 text-navy-500 whitespace-nowrap">
                        {reg.phone || "—"}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            reg.registration_status === "confirmed"
                              ? "bg-teal-50 text-teal-700"
                              : reg.registration_status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {registrationStatusLabel(reg.registration_status)}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            reg.payment_status === "paid"
                              ? "bg-teal-50 text-teal-700"
                              : reg.payment_status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : reg.payment_status === "refunded"
                              ? "bg-navy-50 text-navy-600"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {paymentStatusLabel(reg.payment_status)}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {reg.payment_status === "paid"
                          ? formatPrice(reg.amount_paid)
                          : "—"}
                      </td>
                      <td className="px-6 py-3 text-navy-500 whitespace-nowrap">
                        {formatDateBR(reg.created_at)}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className="text-navy-300 font-mono text-xs"
                          title={reg.id}
                        >
                          {shortId(reg.id)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Waitlist */}
        <div className="bg-white rounded-2xl border border-navy-100">
          <div className="p-6 pb-4 border-b border-navy-100 flex items-center justify-between">
            <h2 className="text-lg font-black text-navy">Lista de espera</h2>
            <span className="text-sm text-navy-500">
              {data.waitlist.length} pessoas
            </span>
          </div>

          {data.waitlist.length === 0 ? (
            <div className="text-center py-12 text-navy-500">
              <ListOrdered className="w-12 h-12 mx-auto mb-3 text-navy-200" />
              <p>Ninguém na lista de espera ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-navy-500 text-xs uppercase">
                    <th className="px-6 py-3">Nome</th>
                    <th className="px-6 py-3">E-mail</th>
                    <th className="px-6 py-3">Telefone</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {data.waitlist.map((entry) => (
                    <tr key={entry.id} className="border-t border-navy-100">
                      <td className="px-6 py-3 font-semibold text-navy">{entry.name}</td>
                      <td className="px-6 py-3 text-navy-500">{entry.email}</td>
                      <td className="px-6 py-3 text-navy-500">{entry.phone || "—"}</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700">
                          {entry.status === "waiting"
                            ? "Aguardando"
                            : entry.status === "registered"
                            ? "Inscrito"
                            : "Notificado"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-navy-500">
                        {formatDateBR(entry.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}