import { useEffect } from "react";
import { trackPurchase } from "@/lib/tracking";
import { motion } from "framer-motion";
import { CheckCircle, Instagram, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { CONFIG } from "@/config";
import logoIcon from "@/assets/logo-icon.png";

const Obrigado = () => {
  useEffect(() => {
    try {
      const leads = JSON.parse(localStorage.getItem(CONFIG.LEAD_STORAGE) || "[]");
      if (leads.length > 0) {
        const email = leads[leads.length - 1].email;
        trackPurchase(email);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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
            <CheckCircle className="w-24 h-24 text-wine" strokeWidth={1.5} />
          </motion.div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-wine mb-6 text-balance">
            Compra aprovada!<br/>Obrigado pela confiança.
          </h1>
          
          <p className="text-off-white font-body text-lg leading-relaxed mb-6 max-w-lg">
            Seu Manual do Empregador está pronto para download. Clique no botão abaixo para baixar agora:
          </p>

          <motion.a
            href={CONFIG.EBOOK_DOWNLOAD_URL}
            download="Manual-do-Empregador-Felipe-Lopes.pdf"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="w-full max-w-md flex items-center justify-center gap-3 bg-wine hover:bg-wine/90 text-white font-ui font-bold text-base px-8 py-5 rounded-md transition-all duration-300 shadow-lg shadow-wine/30 mb-8"
          >
            <Download className="w-5 h-5" />
            Baixar o Manual do Empregador (PDF)
          </motion.a>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <a
              href={CONFIG.OFFICE_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-wine hover:text-background text-wine font-ui font-bold text-sm px-6 py-4 rounded-md transition-all duration-300 border border-wine/30"
            >
              <Instagram className="w-5 h-5" />
              Acompanhar no Instagram
            </a>
            
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
