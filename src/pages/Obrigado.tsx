import { useEffect } from "react";
import { trackPurchase } from "@/lib/tracking";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Download, CalendarDays } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";

const Obrigado = () => {
  const [searchParams] = useSearchParams();
  const product = searchParams.get("product") ?? "ebook";
  const isEvent = product === "event";

  useEffect(() => {
    try {
      const email = searchParams.get("payer_email") ?? "";
      if (email) trackPurchase(email);
    } catch (e) {
      console.error(e);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-support-dark flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-wine/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 text-center max-w-2xl relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-support border border-primary p-8 md:p-12 rounded-2xl shadow-2xl flex flex-col items-center"
        >
          <img src={logoIcon} alt="Felipe Lopes" className="w-16 h-16 mb-8 opacity-80" />

          {/* Success icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="flex justify-center mb-6"
          >
            {isEvent ? (
              <CalendarDays className="w-24 h-24 text-gold" strokeWidth={1.5} />
            ) : (
              <CheckCircle className="w-24 h-24 text-wine" strokeWidth={1.5} />
            )}
          </motion.div>

          {isEvent ? (
            <>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gold mb-6 text-balance">
                Inscrição confirmada!<br/>Até breve.
              </h1>
              <p className="text-off-white font-body text-lg leading-relaxed mb-6 max-w-lg">
                Sua inscrição no <strong>Segurança Jurídica 360</strong> está confirmada. Enviamos um e-mail de confirmação — <strong>ele é o seu ingresso</strong>, guarde-o.
              </p>
              <div className="w-full max-w-md rounded-xl border border-gold/20 bg-gold/5 px-5 py-4 text-left mb-8">
                <p className="text-[0.65rem] font-ui text-gold uppercase tracking-[0.12em] mb-1">🎫 Ingresso digital</p>
                <p className="text-sm text-off-white/80 font-body">Apresente o e-mail de confirmação na entrada do evento. Em breve você receberá os detalhes de local e horário.</p>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-wine mb-6 text-balance">
                Compra aprovada!<br/>Obrigado pela confiança.
              </h1>
              <p className="text-off-white font-body text-lg leading-relaxed mb-6 max-w-lg">
                Seu Manual do Empregador está a caminho. Enviamos o link de download para o seu e-mail — verifique sua caixa de entrada (e o spam).
              </p>
              <motion.a
                href="#"
                onClick={(e) => e.preventDefault()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="w-full max-w-md flex items-center justify-center gap-3 bg-wine/10 border border-wine/30 text-wine/80 font-ui font-bold text-base px-8 py-5 rounded-md mb-8 cursor-default"
              >
                <Download className="w-5 h-5" />
                Link de download enviado por e-mail
              </motion.a>
            </>
          )}

          <div className="flex items-center justify-center w-full max-w-md">
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 bg-support hover:bg-support-dark text-secondary-light font-ui text-sm px-6 py-4 rounded-md transition-all duration-300 border border-primary/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Obrigado;
