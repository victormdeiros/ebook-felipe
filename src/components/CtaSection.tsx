import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, CreditCard, ArrowRight } from "lucide-react";
import { CONFIG } from "@/config";

const CtaSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", whatsapp: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage as requested for Lead Capture
    const leads = JSON.parse(localStorage.getItem(CONFIG.LEAD_STORAGE) || "[]");
    leads.push({ ...formData, data: new Date().toISOString() });
    localStorage.setItem(CONFIG.LEAD_STORAGE, JSON.stringify(leads));
    
    // Redirect to checkout
    window.location.href = CONFIG.REDIRECT_URL;
  };

  return (
    <section id="comprar" className="py-24 lg:py-32 bg-support-dark relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-gold text-balance mb-6">
            Adquira o Manual do Empregador e proteja sua empresa hoje
          </h2>
          <p className="text-secondary-light font-body text-lg">
            Um investimento único que pode evitar passivos de milhares de reais.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-support border border-primary p-8 md:p-12 rounded-2xl shadow-2xl relative"
          >
            <div className="text-center mb-8 border-b border-primary/50 pb-8">
              <span className="inline-block bg-primary/20 text-gold font-body text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-gold/20">
                OFERTA DE LANÇAMENTO
              </span>
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-secondary-light font-body line-through">De R$ 97,00</span>
                <span className="font-display text-5xl md:text-6xl font-bold text-off-white">
                  <span className="text-2xl text-gold align-top inline-block mt-2 mr-1">R$</span>49<span className="text-3xl text-gold/80">,00</span>
                </span>
                <span className="text-gold/80 font-body text-sm mt-2">Pagamento único • Acesso imediato</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label htmlFor="name" className="block text-off-white font-body text-sm mb-1.5">Nome completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Ex: João da Silva"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-support-dark border border-primary/50 rounded-md px-4 py-3 text-off-white font-body focus:outline-none focus:border-gold transition-colors placeholder:text-off-white/20"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-off-white font-body text-sm mb-1.5">E-mail corporativo ou principal</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Ex: joao@suaempresa.com.br"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-support-dark border border-primary/50 rounded-md px-4 py-3 text-off-white font-body focus:outline-none focus:border-gold transition-colors placeholder:text-off-white/20"
                />
              </div>
              <div>
                <label htmlFor="whatsapp" className="block text-off-white font-body text-sm mb-1.5">WhatsApp</label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  required
                  placeholder="(00) 00000-0000"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full bg-support-dark border border-primary/50 rounded-md px-4 py-3 text-off-white font-body focus:outline-none focus:border-gold transition-colors placeholder:text-off-white/20"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-background font-ui font-bold text-sm px-8 py-5 rounded-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/20 mt-4 group"
              >
                <CreditCard className="w-5 h-5" />
                COMPRAR AGORA →
              </button>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-secondary-light font-body text-xs md:text-sm">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gold/70" />
                Pagamento 100% Seguro
              </span>
              <span className="hidden sm:inline text-primary/40">•</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold/70" />
                Garantia de 7 dias
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
