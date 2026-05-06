import { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { CONFIG } from "@/config";

type FormData = { name: string; email: string; whatsapp: string; message: string };
type FormErrors = { name?: string; email?: string; whatsapp?: string };

const WHATSAPP_NUMBER = CONFIG.WHATSAPP_NUMBER;

const buildWhatsAppUrl = (data: FormData): string => {
  const text =
    `Olá! Entrei em contato pelo site do Manual do Empregador.\n\n` +
    `Nome: ${data.name}\n` +
    `E-mail: ${data.email}\n` +
    `WhatsApp: ${data.whatsapp}` +
    (data.message ? `\n\nMensagem: ${data.message}` : "");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

const CtaSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", whatsapp: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const firstErrorRef = useRef<HTMLInputElement>(null);

  const validate = (data: FormData): FormErrors => {
    const errs: FormErrors = {};
    if (!data.name.trim()) errs.name = "Informe seu nome completo.";
    if (!data.email.trim()) errs.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "E-mail inválido.";
    if (!data.whatsapp.trim()) errs.whatsapp = "Informe seu WhatsApp.";
    else if (data.whatsapp.replace(/\D/g, "").length < 10) errs.whatsapp = "Número incompleto.";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(formData)[name as keyof FormErrors] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, whatsapp: true });

    if (Object.keys(validationErrors).length > 0) {
      const firstError = document.querySelector<HTMLInputElement>('[aria-invalid="true"]');
      firstError?.focus();
      return;
    }

    // Open WhatsApp with pre-filled message
    window.open(buildWhatsAppUrl(formData), "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  const inputBase =
    "w-full rounded-lg border border-white/10 bg-support px-4 py-3 text-sm text-foreground placeholder:text-text-muted focus:border-wine focus:ring-2 focus:ring-wine/20 transition-colors duration-200 outline-none min-h-[44px]";

  const labelBase = "block font-body text-xs font-medium text-off-white/80 mb-1.5";

  return (
    <section id="checkout" className="py-24 lg:py-32 section-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />
      <div className="absolute top-0 right-0 -m-32 w-80 h-80 bg-wine/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 -m-32 w-80 h-80 bg-primary/8 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/[0.05] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-gold mb-5">
            <BadgeCheck className="h-3.5 w-3.5" />
            Fale com um especialista
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-wine text-balance mb-5">
            Entre em contato
          </h2>
          <p className="text-text-muted font-body text-base">
            Preencha o formulário e entraremos em contato em breve.
          </p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-lg mx-auto"
        >
          <div
            className="rounded-2xl p-8"
            style={{
              background: "var(--support)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 10px 40px -12px rgba(0,0,0,0.6)",
            }}
          >
            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                <p className="font-display text-xl text-off-white">Mensagem enviada!</p>
                <p className="font-body text-sm text-text-muted">
                  O WhatsApp foi aberto com sua mensagem. Entraremos em contato em breve.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", whatsapp: "", message: "" }); setTouched({}); }}
                  className="mt-2 font-ui text-xs text-wine hover:text-wine-light transition-colors cursor-pointer"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form id="form-lead-ebook" onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Nome */}
                <div>
                  <label htmlFor="name" className={labelBase}>
                    Nome completo <span className="text-wine" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Ex: João da Silva"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`${inputBase} ${errors.name ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs text-red-400" role="alert">{errors.name}</p>
                  )}
                </div>

                {/* E-mail */}
                <div>
                  <label htmlFor="email" className={labelBase}>
                    E-mail <span className="text-wine" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Ex: joao@suaempresa.com.br"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`${inputBase} ${errors.email ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs text-red-400" role="alert">{errors.email}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label htmlFor="whatsapp" className={labelBase}>
                    WhatsApp <span className="text-wine" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.whatsapp}
                    aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
                    className={`${inputBase} ${errors.whatsapp ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                  />
                  {errors.whatsapp && (
                    <p id="whatsapp-error" className="mt-1.5 text-xs text-red-400" role="alert">{errors.whatsapp}</p>
                  )}
                </div>

                {/* Mensagem */}
                <div>
                  <label htmlFor="message" className={labelBase}>
                    Mensagem
                    <span className="ml-1 text-text-muted font-normal">(opcional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Como podemos ajudar?"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full rounded-lg border border-white/10 bg-support px-4 py-3 text-sm text-foreground placeholder:text-text-muted focus:border-wine focus:ring-2 focus:ring-wine/20 transition-colors duration-200 outline-none resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 text-white font-ui text-sm font-bold tracking-[0.04em] rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(201,168,76,0.45)] cursor-pointer min-h-[52px]" style={{ background: '#2d7a4f' }} onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background='#c9a84c'} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background='#2d7a4f'}
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar mensagem
                </button>

                <p className="text-center font-body text-[11px] text-text-muted pt-1">
                  Ao enviar, você será redirecionado ao WhatsApp com sua mensagem preenchida.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
