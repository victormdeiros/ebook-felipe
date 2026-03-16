import { motion } from "framer-motion";
import { Download } from "lucide-react";
import logoBranca from "@/assets/logo-branca.png";
import { Link } from "react-router-dom";

const Obrigado = () => {
  return (
    <main className="min-h-screen hero-gradient flex items-center justify-center">
      <div className="container mx-auto px-6 text-center max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src={logoBranca} alt="Felipe Lopes Advogados" className="h-12 mx-auto mb-12" />

          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
            Seu acesso está liberado.
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-10">
            Obrigado pelo interesse no nosso material. Clique no botão abaixo para acessar o e-book.
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-3 font-ui text-sm bg-primary hover:bg-primary-deep text-primary-foreground px-8 py-4 rounded-md transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_-5px_rgba(62,21,23,0.5)]"
          >
            <Download className="w-4 h-4" />
            BAIXAR EBOOK
          </a>

          <p className="text-muted-foreground/60 text-sm mt-12">
            Esperamos que o conteúdo seja útil para tornar a gestão da sua empresa mais segura.
          </p>

          <Link to="/" className="text-accent text-sm mt-8 inline-block hover:underline">
            ← Voltar à página inicial
          </Link>
        </motion.div>
      </div>
    </main>
  );
};

export default Obrigado;
