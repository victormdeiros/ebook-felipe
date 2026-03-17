import { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Lock, ShieldCheck, CreditCard, Loader2 } from "lucide-react";
import { CONFIG } from "@/config";
import { trackFormStart } from "@/lib/tracking";
import { getContent } from "@/lib/contentStore";
import { saveLead } from "@/lib/repository";

type FormErrors = { name?: string; email?: string; whatsapp?: string };

const CtaSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({ name: "", email: "", whatsapp: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formStarted = useRef(false);
  const content = getContent();

  const handleFormFocus = () => {
    if (!formStarted.current) {
      formStarted.current = true;
      trackFormStart();
    }
  };

  const validate = (data: typeof formData): FormErrors => {
    const errs: FormErrors = {};
    if (!data.name.trim()) errs.name = "Informe seu nome completo.";
    if (!data.email.trim()) errs.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "E-mail inválido.";
    if (!data.whatsapp.trim()) errs.whatsapp = "Informe seu WhatsApp.";
    else if (data.whatsapp.replace(/\D/g, "").length < 10) errs.whatsapp = "Número incompleto.";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, whatsapp: true });

    if (Object.keys(validationErrors).length > 0) {
      const firstError = document.querySelector<HTMLInputElement>('[aria-invalid="true"]');
      firstError?.focus();
      return;
    }

    setIsSubmitting(true);

    // Save lead via repository (Supabase + localStorage fallback)
    await saveLead({ ...formData, data: new Date().toISOString() });

    // Brief delay for UX feedback
    await new Promise((r) => setTimeout(r, 400));

    // Redirect to payment URL — append prefilled_email for Stripe Payment Links
    const base = content.checkoutUrl || CONFIG.PAYMENT_URL;
    const url = base.includes("?")
      ? `${base}&prefilled_email=${encodeURIComponent(formData.email)}`
      : `${base}?prefilled_email=${encodeURIComponent(formData.email)}`;
    window.location.href = url;
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full bg-background border rounded-md px-4 py-3.5 text-off-white font-body text-base focus:outline-none transition-colors placeholder:text-white/25 min-h-[48px] ${
      errors[field] && touched[field]
        ? "border-red-400/60 focus:border-red-400"
        : "border-white/8 focus:border-wine"
    }`;

  return (
    <section id="comprar" className="py-24 lg:py-32 section-elevated relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />

      {/* Ambient glows */}
      <div className="absolute top-0 right-0 -m-32 w-80 h-80 bg-wine/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 -m-32 w-80 h-80 bg-primary/8 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-wine text-balance mb-6">
            Adquira o Manual do Empregador e proteja sua empresa hoje
          </h2>
          <p className="text-muted-foreground font-body text-lg">
            Um investimento único que pode evitar passivos de milhares de reais.
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="surface-card p-8 md:p-10 rounded-2xl relative"
          >
            {/* Pricing header */}
            <div className="text-center mb-8 border-b border-white/5 pb-8">
              <span className="inline-block border border-wine/25 text-wine font-body text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                OFERTA DE LANÇAMENTO
              </span>
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-muted-foreground font-body line-through text-sm">De R$ {content.priceOriginal},00</span>
                <span className="font-display text-5xl md:text-6xl font-bold text-off-white mt-1">
                  <span className="text-2xl text-wine align-top inline-block mt-2 mr-1">R$</span>{content.price}<span className="text-3xl text-wine/70">,00</span>
                </span>
                <span className="text-wine/70 font-body text-sm mt-2">Pagamento único &bull; Acesso imediato</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} onFocus={handleFormFocus} className="space-y-4 mb-8" noValidate>
              <div>
                <label htmlFor="name" className="block text-off-white/90 font-body text-sm mb-1.5">
                  Nome completo <span className="text-wine" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Ex: João da Silva"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!(errors.name && touched.name)}
                  aria-describedby={errors.name && touched.name ? "name-error" : undefined}
                  className={inputClass("name")}
                />
                {errors.name && touched.name && (
                  <p id="name-error" role="alert" className="text-red-400 text-xs mt-1.5 font-body">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-off-white/90 font-body text-sm mb-1.5">
                  E-mail corporativo ou principal <span className="text-wine" aria-hidden="true">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="Ex: joao@suaempresa.com.br"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!(errors.email && touched.email)}
                  aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                  className={inputClass("email")}
                />
                {errors.email && touched.email && (
                  <p id="email-error" role="alert" className="text-red-400 text-xs mt-1.5 font-body">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-off-white/90 font-body text-sm mb-1.5">
                  WhatsApp <span className="text-wine" aria-hidden="true">*</span>
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  required
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!(errors.whatsapp && touched.whatsapp)}
                  aria-describedby="whatsapp-hint whatsapp-error"
                  className={inputClass("whatsapp")}
                />
                <p id="whatsapp-hint" className="text-white/30 text-xs mt-1 font-body">
                  Insira o DDD + número com 9 dígitos
                </p>
                {errors.whatsapp && touched.whatsapp && (
                  <p id="whatsapp-error" role="alert" className="text-red-400 text-xs mt-1 font-body">{errors.whatsapp}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-wine hover:bg-wine-light text-background font-ui font-bold text-sm px-8 min-h-[52px] rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(200,121,124,0.3)] mt-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    PROCESSANDO...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    COMPRAR AGORA
                  </>
                )}
              </button>
            </form>

            {/* Trust signals */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-muted-foreground font-body text-xs sm:text-sm">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-wine/60" />
                Pagamento 100% Seguro
              </span>
              <span className="hidden sm:inline text-white/10">&bull;</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-wine/60" />
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
