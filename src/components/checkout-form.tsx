"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/button";

interface CheckoutFormProps {
  onSubmit: (data: { name: string; email: string; phone: string }) => Promise<string>;
  onCancel?: () => void;
}

export function CheckoutForm({ onSubmit, onCancel }: CheckoutFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      const url = await onSubmit({ name, email, phone });
      window.location.href = url;
    } catch (err) {
      if (
        err instanceof Error &&
        (err.message === "__NOT_AVAILABLE__" || err.message === "EVENT_NOT_AVAILABLE")
      ) {
        setLoading(false);
        return;
      }
      setError(err instanceof Error ? err.message : "Erro ao processar.");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white text-navy-800 placeholder:text-navy-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-navy-700 mb-1">
          Nome completo *
        </label>
        <input
          id="name"
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
        <label htmlFor="email" className="block text-sm font-semibold text-navy-700 mb-1">
          E-mail *
        </label>
        <input
          id="email"
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
        <label htmlFor="phone" className="block text-sm font-semibold text-navy-700 mb-1">
          Telefone / WhatsApp
        </label>
        <input
          id="phone"
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

      <Button type="submit" size="lg" loading={loading} className="w-full btn-brand !shadow-none">
        {loading ? "Redirecionando para pagamento..." : "Ir para o pagamento seguro"}
      </Button>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-center text-sm text-navy-500 hover:text-navy py-2"
        >
          Voltar
        </button>
      )}

      <p className="text-xs text-navy-400 text-center">
        Pagamento seguro processado pelo Mercado Pago. Você será redirecionado
        para concluir a compra.
      </p>
    </form>
  );
}
