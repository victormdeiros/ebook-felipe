import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CtaSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      navigate("/obrigado");
    }, 800);
  };

  return (
    <section id="cta-final" className="py-24 lg:py-32 hero-gradient relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-foreground text-balance mb-6">
              Garanta agora o seu acesso ao e-book
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              Tenha em mãos um guia prático que pode ajudar a tornar a gestão da sua empresa mais segura e organizada.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Seu nome"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface border-0 text-foreground placeholder:text-muted-foreground/50 px-5 py-4 rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border-0 text-foreground placeholder:text-muted-foreground/50 px-5 py-4 rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
            />
            <input
              type="text"
              placeholder="Empresa (opcional)"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full bg-surface border-0 text-foreground placeholder:text-muted-foreground/50 px-5 py-4 rounded-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-ui text-sm bg-primary hover:bg-primary-deep text-primary-foreground px-8 py-4 rounded-md transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_-5px_rgba(62,21,23,0.5)] disabled:opacity-50"
            >
              {isSubmitting ? "PROCESSANDO..." : "QUERO BAIXAR O EBOOK"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
