import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CanceledPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-slate-400" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Pagamento não concluído
          </h1>
          <p className="text-slate-600 mb-8">
            Parece que você não concluiu o pagamento. Não se preocupe, sua vaga ainda
            pode estar disponível. Você pode tentar novamente quando quiser.
          </p>

          <Link
            href="/#inscricao"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3.5 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para a inscrição
          </Link>

          <Link
            href="/"
            className="block text-slate-500 hover:text-slate-700 font-medium mt-4"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
