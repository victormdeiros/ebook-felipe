import { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, Lock, ShieldCheck } from "lucide-react";
import { GlassCheckoutCard } from "@/components/ui/glass-checkout-card-shadcnui";
import { trackFormStart } from "@/lib/tracking";
import { getContent } from "@/lib/contentStore";
import { saveLead } from "@/lib/repository";
import { useCart } from "@/contexts/CartContext";

type FormErrors = { name?: string; email?: string; whatsapp?: string };

const CtaSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({ name: "", email: "", whatsapp: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formStarted = useRef(false);
  const content = getContent();
  const { addToCart, openCart } = useCart();

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

    // Adiciona ao carrinho e abre o drawer para finalizar a compra
    addToCart();
    openCart();

    setIsSubmitting(false);
  };

  return (
    <section id="checkout" className="py-24 lg:py-32 section-elevated relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />

      {/* Ambient glows */}
      <div className="absolute top-0 right-0 -m-32 w-80 h-80 bg-wine/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 -m-32 w-80 h-80 bg-primary/8 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-wine text-balance mb-6">
            Formalize a compra com um checkout coerente com a proposta do material
          </h2>
          <p className="text-muted-foreground font-body text-lg">
            Você cadastra seus dados aqui e conclui o pagamento em ambiente seguro, sem fricção nem duplicidade na jornada.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] lg:items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-wine/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-wine/90">
                <BadgeCheck className="h-3.5 w-3.5" />
                Jornada padronizada de compra
              </span>
              <h3 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-off-white md:text-4xl">
                Garanta seu acesso ao material e avance para a etapa final da compra em poucos segundos.
              </h3>
              <p className="max-w-2xl text-base leading-relaxed text-white/68 md:text-lg">
                Você informa seus dados uma única vez, segue para o checkout com mais agilidade e assegura acesso a um conteúdo pensado para orientar decisões trabalhistas com critério prático.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-black/15 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-off-white">
                  <Lock className="h-4 w-4 text-wine" />
                  Checkout sem exposição de dados sensíveis
                </div>
                <p className="text-sm leading-relaxed text-white/58">
                  Nenhum dado de cartão é coletado na landing. O pagamento acontece no ambiente oficial, com o seu e-mail já encaminhado.
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/15 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-off-white">
                  <ShieldCheck className="h-4 w-4 text-wine" />
                  Cadastro único, fluxo direto
                </div>
                <p className="text-sm leading-relaxed text-white/58">
                  O mesmo formulário abastece seu registro de interesse e acelera a passagem para a etapa final da compra.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/56">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-wine/80" />
                Sem exibir valor na landing
              </span>
              <span className="inline-flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-wine/80" />
                Redirecionamento imediato ao checkout
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            <GlassCheckoutCard
              formData={formData}
              errors={errors}
              touched={touched}
              isSubmitting={isSubmitting}
              onChange={handleChange}
              onBlur={handleBlur}
              onSubmit={handleSubmit}
              onFocus={handleFormFocus}
              eyebrow="Checkout do Manual"
              title="Cadastre-se para concluir a compra"
              description="Preencha os dados abaixo para seguir ao pagamento e receber um material criado para orientar a empresa em contratações, rotina trabalhista e prevenção de riscos."
              buttonLabel={isSubmitting ? "Aguarde..." : "Confirmar e ir ao checkout →"}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
