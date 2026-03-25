import type { ChangeEventHandler, FocusEventHandler, FormEventHandler } from "react";
import { ArrowRight, BadgeCheck, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CheckoutFields = {
  name: string;
  email: string;
  whatsapp: string;
};

type CheckoutErrors = Partial<Record<keyof CheckoutFields, string>>;
type CheckoutTouched = Partial<Record<keyof CheckoutFields, boolean>>;

interface GlassCheckoutCardProps {
  className?: string;
  formData: CheckoutFields;
  errors: CheckoutErrors;
  touched: CheckoutTouched;
  isSubmitting?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onFocus?: FocusEventHandler<HTMLFormElement>;
  title?: string;
  description?: string;
  eyebrow?: string;
  buttonLabel?: string;
}

const inputBaseClass =
  "h-12 rounded-xl border-white/10 bg-black/20 px-4 text-sm text-off-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-wine focus-visible:ring-offset-0";

export function GlassCheckoutCard({
  className,
  formData,
  errors,
  touched,
  isSubmitting = false,
  onChange,
  onBlur,
  onSubmit,
  onFocus,
  title = "Continue para o checkout seguro",
  description = "Seus dados liberam o ambiente oficial de pagamento e o acesso imediato ao material apos a confirmacao.",
  eyebrow = "Cadastro de compra",
  buttonLabel = "Ir para o checkout",
}: GlassCheckoutCardProps) {
  const inputClass = (field: keyof CheckoutFields) =>
    cn(
      inputBaseClass,
      errors[field] && touched[field]
        ? "border-red-400/70 focus-visible:ring-red-400"
        : "border-white/10 focus-visible:border-wine",
    );

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/10 bg-white/8 shadow-[0_30px_120px_-45px_rgba(0,0,0,0.7)] backdrop-blur-2xl",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(183,89,97,0.28),_transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))]" aria-hidden="true" />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" aria-hidden="true" />

      <CardContent className="relative p-6 md:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72">
              <BadgeCheck className="h-3.5 w-3.5 text-wine" />
              {eyebrow}
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-off-white md:text-[2rem]">
                {title}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/64">{description}</p>
            </div>
          </div>

          <div className="hidden rounded-2xl border border-white/10 bg-black/20 p-4 text-white/78 md:block">
            <CreditCard className="h-5 w-5 text-wine" />
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-off-white">
            <div className="mb-1 flex items-center gap-2 text-white/80">
              <ShieldCheck className="h-4 w-4 text-wine" />
              Ambiente seguro
            </div>
            <p className="text-xs leading-relaxed text-white/52">O pagamento acontece apenas no checkout oficial.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-off-white">
            <div className="mb-1 flex items-center gap-2 text-white/80">
              <LockKeyhole className="h-4 w-4 text-wine" />
              Dados essenciais
            </div>
            <p className="text-xs leading-relaxed text-white/52">Coletamos apenas contato para liberar sua compra.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-off-white">
            <div className="mb-1 flex items-center gap-2 text-white/80">
              <BadgeCheck className="h-4 w-4 text-wine" />
              Acesso imediato
            </div>
            <p className="text-xs leading-relaxed text-white/52">Liberacao do material apos confirmacao do checkout.</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={onSubmit} onFocus={onFocus} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="checkout-name" className="text-sm font-medium text-white/86">
              Nome completo
            </Label>
            <Input
              id="checkout-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Ex: Joao da Silva"
              value={formData.name}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={Boolean(errors.name && touched.name)}
              aria-describedby={errors.name && touched.name ? "checkout-name-error" : undefined}
              className={inputClass("name")}
            />
            {errors.name && touched.name ? (
              <p id="checkout-name-error" role="alert" className="text-xs text-red-300">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="checkout-email" className="text-sm font-medium text-white/86">
              E-mail
            </Label>
            <Input
              id="checkout-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Ex: joao@suaempresa.com.br"
              value={formData.email}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={Boolean(errors.email && touched.email)}
              aria-describedby={errors.email && touched.email ? "checkout-email-error" : undefined}
              className={inputClass("email")}
            />
            {errors.email && touched.email ? (
              <p id="checkout-email-error" role="alert" className="text-xs text-red-300">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="checkout-whatsapp" className="text-sm font-medium text-white/86">
              WhatsApp
            </Label>
            <Input
              id="checkout-whatsapp"
              name="whatsapp"
              type="tel"
              autoComplete="tel"
              placeholder="(00) 00000-0000"
              value={formData.whatsapp}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={Boolean(errors.whatsapp && touched.whatsapp)}
              aria-describedby="checkout-whatsapp-hint checkout-whatsapp-error"
              className={inputClass("whatsapp")}
            />
            <p id="checkout-whatsapp-hint" className="text-xs text-white/42">
              Use um numero valido para receber orientacoes da compra, se necessario.
            </p>
            {errors.whatsapp && touched.whatsapp ? (
              <p id="checkout-whatsapp-error" role="alert" className="text-xs text-red-300">
                {errors.whatsapp}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/62">
            O valor, as formas de pagamento e a confirmacao final aparecem apenas no checkout protegido.
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 w-full rounded-xl text-sm font-semibold bg-gold hover:bg-gold-light text-background border-0 hover:shadow-[0_8px_24px_-6px_rgba(201,168,76,0.5)]">
            {buttonLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}