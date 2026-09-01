"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  UserCheck,
  Clock,
  ListOrdered,
  Loader2,
  LogOut,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { formatPrice, formatDateShort } from "@/lib/utils";
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
    spots_left: number;
    waitlist_count: number;
  };
}

const AUTH_KEY = "academia_rh_admin_token";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEY);
    if (token) {
      setAuthed(true);
    }
    setAuthChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/admin", {
        headers: { Authorization: `Bearer ${password}` },
      });

      if (res.status === 401) {
        setAuthError("Senha incorreta.");
        setAuthLoading(false);
        return;
      }

      if (!res.ok) {
        setAuthError("Erro ao autenticar.");
        setAuthLoading(false);
        return;
      }

      localStorage.setItem(AUTH_KEY, "authenticated");
      setAuthed(true);
      setAuthLoading(false);
    } catch {
      setAuthError("Erro ao autenticar.");
      setAuthLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem(AUTH_KEY);
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin", {
        headers: { Authorization: `Bearer authenticated` },
      });

      if (res.status === 401) {
        localStorage.removeItem(AUTH_KEY);
        setAuthed(false);
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
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    setData(null);
  };

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
      label: "Vagas preenchidas",
      value: `${data.stats.confirmed} / ${data.event.capacity}`,
      icon: UserCheck,
      color: "text-teal-600 bg-teal-50",
    },
    {
      label: "Vagas disponíveis",
      value: `${data.stats.spots_left}`,
      icon: Users,
      color: "text-navy bg-navy-50",
    },
    {
      label: "Pagamentos pendentes",
      value: `${data.stats.pending}`,
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Lista de espera",
      value: `${data.stats.waitlist_count}`,
      icon: ListOrdered,
      color: "text-cyan-600 bg-cyan-50",
    },
  ];

  return (
    <div className="min-h-screen bg-mist">
      <header className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">Painel Administrativo</h1>
            <p className="text-sm text-navy-200">Academia RH - {data.event.location}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Atualizar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Event info */}
        <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-8">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-xs text-navy-500 uppercase font-bold">Evento</p>
              <p className="font-semibold text-navy">{data.event.name}</p>
            </div>
            <div>
              <p className="text-xs text-navy-500 uppercase font-bold">Data</p>
              <p className="font-semibold text-navy flex items-center gap-1">
                <Calendar className="w-4 h-4 text-teal-600" />
                {formatDateShort(data.event.event_date)} · {data.event.start_time}
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

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl border border-navy-100 p-5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-navy">{stat.value}</p>
                <p className="text-sm text-navy-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Registrations */}
        <div className="bg-white rounded-2xl border border-navy-100 mb-8">
          <div className="p-6 pb-4 border-b border-navy-100 flex items-center justify-between">
            <h2 className="text-lg font-black text-navy">Inscrições</h2>
            <span className="text-sm text-navy-500">
              {data.registrations.length} registros
            </span>
          </div>

          {data.registrations.length === 0 ? (
            <div className="text-center py-12 text-navy-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-navy-200" />
              <p>Nenhuma inscrição registrada ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-navy-500 text-xs uppercase">
                    <th className="px-6 py-3">Nome</th>
                    <th className="px-6 py-3">E-mail</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Pagamento</th>
                    <th className="px-6 py-3">Valor</th>
                    <th className="px-6 py-3">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {data.registrations.map((reg) => (
                    <tr key={reg.id} className="border-t border-navy-100">
                      <td className="px-6 py-3 font-semibold text-navy">{reg.name}</td>
                      <td className="px-6 py-3 text-navy-500">{reg.email}</td>
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
                          {reg.registration_status === "confirmed"
                            ? "Confirmada"
                            : reg.registration_status === "pending"
                            ? "Pendente"
                            : "Cancelada"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            reg.payment_status === "paid"
                              ? "bg-teal-50 text-teal-700"
                              : reg.payment_status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {reg.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-3">{formatPrice(reg.amount_paid)}</td>
                      <td className="px-6 py-3 text-navy-500">
                        {new Date(reg.created_at).toLocaleDateString("pt-BR")}
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
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-navy-500">
                        {new Date(entry.created_at).toLocaleDateString("pt-BR")}
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
