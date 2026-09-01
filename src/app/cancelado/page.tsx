import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CanceledPage() {
  return (
    <div className="min-h-screen bg-mist flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl border border-navy-100 shadow-[0_30px_60px_-30px_rgba(1,33,74,0.4)] p-8 md:p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-navy-50 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-navy-400" />
          </div>

          <h1 className="text-2xl font-black text-navy mb-3">
            Pagamento não concluído
          </h1>
          <p className="text-navy-600/80 mb-8">
            Parece que você não concluiu o pagamento. Não se preocupe, sua vaga ainda
            pode estar disponível. Você pode tentar novamente quando quiser.
          </p>

          <Link
            href="/#inscricao"
            className="btn-brand px-6 py-3.5 inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para a inscrição
          </Link>

          <Link
            href="/"
            className="block text-teal-600 hover:text-teal-700 font-semibold mt-4"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
