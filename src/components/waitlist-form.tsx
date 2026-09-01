"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface WaitlistFormProps {
  eventId: string;
}

export function WaitlistForm({ eventId }: WaitlistFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!name.trim() || !email.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, event_id: eventId }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Erro ao entrar na lista de espera.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar na lista de espera.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white text-navy-800 placeholder:text-navy-300";

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-teal-600" />
        </div>
        <h3 className="text-xl font-black text-navy mb-2">
          Você entrou na lista de espera da Academia RH.
        </h3>
        <p className="text-navy-600/80">
          Assim que uma vaga for liberada, entraremos em contato pelo e-mail informado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="w-name" className="block text-sm font-semibold text-navy-700 mb-1">
          Nome completo *
        </label>
        <input
          id="w-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Seu nome completo"
          required
        />
        {touched && !name.trim() && (
          <p className="text-sm text-red-600 mt-1">Informe seu nome.</p>
        )}
      </div>

      <div>
        <label htmlFor="w-email" className="block text-sm font-semibold text-navy-700 mb-1">
          E-mail *
        </label>
        <input
          id="w-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="seuemail@exemplo.com"
          required
        />
        {touched && !email.trim() && (
          <p className="text-sm text-red-600 mt-1">Informe seu e-mail.</p>
        )}
      </div>

      <div>
        <label htmlFor="w-phone" className="block text-sm font-semibold text-navy-700 mb-1">
          Telefone / WhatsApp
        </label>
        <input
          id="w-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
          placeholder="(14) 99999-9999"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" loading={loading} className="w-full btn-teal !shadow-none">
        {loading ? "Enviando..." : "Entrar na lista de espera"}
      </Button>

      <p className="text-xs text-navy-400 text-center">
        Fique tranquilo(a): não enviaremos spam. Apenas te avisaremos caso uma vaga seja liberada.
      </p>
    </form>
  );
}
