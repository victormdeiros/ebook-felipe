import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, ArrowRight, BookOpen, X, ShieldCheck, Zap, Loader2, CalendarDays, ChevronLeft, CheckCircle2, Download } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getContent } from "@/lib/contentStore";
import { getProducts } from "@/lib/repository";
import { CONFIG } from "@/config";
import ebookMockup from "@/assets/ebook-mockup.png";
import { createMPPreference, getMPCheckoutUrl, MPNotConfiguredError } from "@/lib/mercadopago";

// ── MercadoPago SDK types ────────────────────────────────────
declare global {
  interface Window {
    MercadoPago: new (
      publicKey: string,
      options?: { locale?: string }
    ) => {
      bricks(): {
        create(
          type: string,
          containerId: string,
          settings: {
            initialization: { amount: number; preferenceId?: string; payer?: { email?: string; firstName?: string; lastName?: string } };
            customization?: { visual?: { style?: { theme?: string }; hideFormTitle?: boolean }; paymentMethods?: Record<string, unknown> };
            callbacks: {
              onReady?: () => void;
              onSubmit?: (data: { formData: Record<string, unknown> }) => Promise<void>;
              onError?: (error: unknown) => void;
            };
          }
        ): Promise<{ unmount: () => void }>;
      };
    };
  }
}

function loadMPScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as unknown as { MercadoPago?: unknown }).MercadoPago) { resolve(); return; }
    const existing = document.getElementById("mp-sdk-v2");
    if (existing) { existing.addEventListener("load", () => resolve()); return; }
    const script = document.createElement("script");
    script.id = "mp-sdk-v2";
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar SDK do Mercado Pago."));
    document.head.appendChild(script);
  });
}

const CartDrawer = () => {
  const { isCartOpen, closeCart, cartCount, cartItems, removeItem } = useCart();
  const content = getContent();
  const [productPrices, setProductPrices] = useState<Record<string, number>>({});
  const [isLoadingEbook, setIsLoadingEbook] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [step, setStep] = useState<"cart" | "form" | "payment" | "success">("cart");
  const [checkoutTarget, setCheckoutTarget] = useState<string>("ebook");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [prefId, setPrefId] = useState<string | null>(null);
  const [brickLoading, setBrickLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<{ status: string; product?: string; ebookUrl?: string } | null>(null);
  const brickControllerRef = useRef<{ unmount: () => void } | null>(null);

  // Reset form when drawer closes
  useEffect(() => {
    if (!isCartOpen) {
      setStep("cart");
      setForm({ name: "", email: "", phone: "" });
      setFormErrors({});
      setCheckoutError(null);
      setPrefId(null);
      setBrickLoading(true);
      setPaymentResult(null);
    }
  }, [isCartOpen]);

  // Load product prices from API (source of truth)
  useEffect(() => {
    getProducts().then((products) => {
      const map: Record<string, number> = {};
      for (const p of products) map[p.id] = p.price;
      setProductPrices(map);
    }).catch(() => {});
  }, []);

  // Destroy brick when leaving payment step
  useEffect(() => {
    if (step !== "payment") {
      brickControllerRef.current?.unmount();
      brickControllerRef.current = null;
    }
  }, [step]);

  // Initialize MP Payment Brick when entering payment step
  useEffect(() => {
    if (step !== "payment" || !prefId) return;
    const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
    if (!publicKey) return;
    const capturedForm = { ...form };
    const capturedTarget = checkoutTarget;
    const capturedAmount = Number(productPrices[capturedTarget] ?? (capturedTarget === ctaVagaId ? Number(eventPrice) : Number(ebookPrice)));
    const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
    let cancelled = false;

    const init = async () => {
      setBrickLoading(true);
      try {
        await loadMPScript();
        if (cancelled) return;
        // Wait for AnimatePresence to finish exit animation and render the container
        let retries = 0;
        while (!document.getElementById("mp-payment-brick") && retries < 30) {
          await new Promise(r => setTimeout(r, 50));
          retries++;
        }
        if (cancelled) return;
        if (!document.getElementById("mp-payment-brick")) throw new Error("container_not_found");
        const mp = new window.MercadoPago(publicKey, { locale: "pt-BR" });
        const controller = await mp.bricks().create("payment", "mp-payment-brick", {
          initialization: {
            amount: capturedAmount,
            preferenceId: prefId,
          },
          customization: {
            visual: { style: { theme: "dark" }, hideFormTitle: true },
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              mercadoPago: "all",
              maxInstallments: 12,
              ...(capturedAmount >= 5 ? { ticket: "all" } : {})
            },
          },
          callbacks: {
            onReady: () => setBrickLoading(false),
            onSubmit: ({ formData }) =>
              new Promise<void>(async (resolve, reject) => {
                try {
                  const res = await fetch(`${apiUrl}/api/mp/process-payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData, metadata: { product: capturedTarget } }),
                  });
                  const data = await res.json() as { status: string; product?: string; ebookUrl?: string; error?: string };
                  if (!res.ok) { setCheckoutError(data.error ?? "Erro ao processar pagamento."); reject(new Error(data.error)); return; }
                  if (data.status === "approved" || data.status === "pending") {
                    setPaymentResult(data);
                    setStep("success");
                    resolve();
                  } else {
                    setCheckoutError("Pagamento não aprovado. Tente outro método.");
                    reject(new Error("not_approved"));
                  }
                } catch (e) {
                  setCheckoutError("Erro de conexão. Verifique sua internet e tente novamente.");
                  reject(e);
                }
              }),
            onError: (e) => console.error("[mp brick]", e),
          },
        });
        if (!cancelled) brickControllerRef.current = controller;
        else controller.unmount();
      } catch (e) {
        if (!cancelled) {
          console.error("[mp brick init]", e);
          setBrickLoading(false);
          setCheckoutError("Erro ao carregar checkout. Tentando redirecionar…");
          // fallback: redirect to init_point
          setTimeout(() => {
            if (!cancelled) { setStep("form"); setCheckoutError("Não foi possível carregar o checkout. Tente novamente."); }
          }, 2000);
        }
      }
    };

    init();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, prefId]);

  const ctaAcessoId = content.ctaAcessoProductId || "ebook";
  const ctaVagaId   = content.ctaVagaProductId   || "event";

  const hasEbook = cartItems.some((i) => i.id === ctaAcessoId);
  const hasEvent = cartItems.some((i) => i.id === ctaVagaId);

  const ebookPrice = productPrices[ctaAcessoId] != null ? String(productPrices[ctaAcessoId]) : (content.price || String(CONFIG.PRODUCT_PRICE));
  const eventPrice = productPrices[ctaVagaId]   != null ? String(productPrices[ctaVagaId])   : (content.eventPrice || String(CONFIG.EVENT_PRICE));

  const totalPrice = (
    (hasEbook ? Number(ebookPrice) : 0) +
    (hasEvent ? Number(eventPrice) : 0)
  ).toFixed(2).replace(".", ",");

  const goToForm = (product: string) => {
    setCheckoutTarget(product);
    setCheckoutError(null);
    setFormErrors({});
    setStep("form");
  };

  const handleFormSubmit = async () => {
    const errors: { name?: string; email?: string; phone?: string } = {};
    if (!form.name.trim() || form.name.trim().length < 2) errors.name = "Nome obrigatório (mín. 2 caracteres)";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "E-mail inválido";
    const phone = form.phone.replace(/\D/g, "");
    if (phone.length < 10) errors.phone = "WhatsApp inválido (com DDD)";
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setFormErrors({});
    setCheckoutError(null);

    const payer = { name: form.name.trim(), email: form.email.trim().toLowerCase(), phone };
    const setLoading = checkoutTarget === "ebook" ? setIsLoadingEbook : setIsLoadingEvent;
    setLoading(true);

    // Save lead immediately so it appears in admin regardless of payment outcome
    const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
    const isEventCheckout = checkoutTarget === ctaVagaId;
    fetch(`${apiUrl}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payer.name,
        email: payer.email,
        whatsapp: payer.phone,
        tags: isEventCheckout ? ["inscricao_evento", "carrinho_abandonado"] : ["carrinho_abandonado"],
      }),
    }).catch(() => {});

    try {
      const result = await createMPPreference(checkoutTarget, payer);
      if (import.meta.env.VITE_MP_PUBLIC_KEY) {
        setPrefId(result.preference_id);
        setStep("payment");
      } else {
        closeCart();
        window.location.href = getMPCheckoutUrl(result);
      }
    } catch (err) {
      if (err instanceof MPNotConfiguredError) {
        const fallbackUrl = checkoutTarget === "ebook"
          ? content.checkoutUrl || CONFIG.PAYMENT_URL
          : content.eventCheckoutUrl || CONFIG.EVENT_PAYMENT_URL;
        if (fallbackUrl && fallbackUrl !== "#" && !fallbackUrl.includes("example")) {
          closeCart();
          window.location.href = fallbackUrl;
        } else {
          setCheckoutError(checkoutTarget === "ebook"
            ? "Checkout do e-book não configurado. Contate o suporte."
            : "Link de inscrição do evento não configurado. Contate o suporte.");
        }
      } else {
        setCheckoutError((err as Error).message || "Erro ao iniciar pagamento. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[50] bg-black/60 backdrop-blur-[2px]"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho de compras"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-[51] flex w-full max-w-[420px] flex-col border-l border-white/10 bg-[#0c0709]/95 backdrop-blur-2xl shadow-[−40px_0_80px_rgba(0,0,0,0.6)]"
          >
            {/* Top inset gradient */}
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 border border-gold/20">
                  <ShoppingCart className="w-4 h-4 text-gold" />
                </div>
                <span className="font-display text-base font-semibold text-off-white tracking-wide">
                  Carrinho
                </span>
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[1.25rem] rounded-full bg-gold px-1.5 text-[10px] font-bold text-background">
                    {cartCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white/90 transition-colors"
                aria-label="Fechar carrinho"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {cartCount === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center justify-center gap-4 py-20 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03]">
                      <ShoppingCart className="w-7 h-7 text-white/20" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-medium text-off-white/50">Carrinho vazio</p>
                      <p className="mt-1 text-xs text-text-muted">
                        Adicione o e-book para continuar.
                      </p>
                    </div>
                  </motion.div>
                ) : step === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-6 py-10 text-center px-2"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/25">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    {paymentResult?.status === "approved" ? (
                      <>
                        <div>
                          <p className="font-display text-lg font-semibold text-off-white">Pagamento aprovado! 🎉</p>
                          <p className="mt-1 text-sm text-text-muted font-body">
                            {paymentResult.product === "event"
                              ? "Sua inscrição está confirmada. Verifique seu e-mail — ele é o seu ingresso."
                              : "Verifique seu e-mail para baixar o e-book."}
                          </p>
                        </div>
                        {paymentResult.product === "ebook" && paymentResult.ebookUrl && (
                          <a
                            href={paymentResult.ebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 min-h-[48px] px-6 rounded-xl font-ui font-bold text-sm text-white w-full justify-center"
                            style={{ background: "#2d7a4f" }}
                          >
                            <Download className="h-4 w-4" />
                            Baixar E-book agora
                          </a>
                        )}
                        {paymentResult.product === "event" && (
                          <div className="w-full rounded-xl border border-gold/20 bg-gold/5 px-5 py-4 text-left">
                            <p className="text-[0.65rem] font-ui text-gold uppercase tracking-[0.12em] mb-1">🎫 Ingresso digital</p>
                            <p className="text-sm text-off-white font-body">E-mail de confirmação enviado. Apresente-o na entrada do evento.</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="font-display text-lg font-semibold text-off-white">Pagamento em análise</p>
                          <p className="mt-1 text-sm text-text-muted font-body">
                            Assim que confirmado, você receberá um e-mail com as instruções.
                          </p>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : step === "payment" ? (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {/* Order mini-summary */}
                    <div className="rounded-xl border border-white/8 bg-black/20 px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-[0.65rem] font-ui text-text-muted uppercase tracking-[0.1em]">
                          {checkoutTarget === "ebook" ? "Manual do Empregador · E-book" : "Segurança Jurídica 360 · Evento"}
                        </p>
                        <p className="font-display text-sm font-bold text-gold mt-0.5">
                          R$ {Number(checkoutTarget === "ebook" ? ebookPrice : eventPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <span className="text-[0.65rem] font-ui text-text-muted/60 bg-white/[0.03] border border-white/8 rounded px-2 py-1">1×</span>
                    </div>
                    {/* Brick container */}
                    <div id={cartItem?.id === "ebook" ? "form-checkout-ebook" : "form-checkout-evento"} className="relative min-h-[200px]">
                      {brickLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 rounded-xl bg-[#0c0709]">
                          <Loader2 className="w-6 h-6 text-gold animate-spin" />
                          <p className="text-sm text-text-muted font-body">Carregando checkout…</p>
                        </div>
                      )}
                      <div id="mp-payment-brick" />
                    </div>
                    {/* MP security badge */}
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-[#009ee3]/15 bg-[#009ee3]/[0.06] px-4 py-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#009ee3] shrink-0" />
                      <p className="text-[0.65rem] font-body text-[#009ee3]/80 leading-tight">
                        Pagamento 100% seguro e criptografado, processado pelo{" "}
                        <span className="font-semibold text-[#009ee3]">Mercado Pago</span>
                      </p>
                    </div>
                  </motion.div>
                ) : step === "form" ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {/* Mini order summary */}
                    <div className="rounded-xl border border-white/8 bg-black/20 px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-[0.65rem] font-ui text-text-muted uppercase tracking-[0.1em]">
                          {checkoutTarget === "ebook" ? "Manual do Empregador · E-book" : "Segurança Jurídica 360 · Evento"}
                        </p>
                        <p className="font-display text-sm font-bold text-gold mt-0.5">
                          R$ {Number(checkoutTarget === "ebook" ? ebookPrice : eventPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <span className="text-[0.65rem] font-ui text-text-muted/60 bg-white/[0.03] border border-white/8 rounded px-2 py-1">1×</span>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block font-ui text-[0.62rem] tracking-[0.1em] text-off-white/60 mb-1.5 uppercase">Nome completo</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && handleFormSubmit()}
                        placeholder="Ex: João da Silva"
                        autoComplete="name"
                        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-off-white placeholder:text-text-muted focus:outline-none transition-all duration-200 ${formErrors.name ? "border-red-400/50" : "border-white/10 focus:border-gold/40"}`}
                        style={{ background: "#1a1114", color: "#f3ece8" }}
                      />
                      {formErrors.name && <p className="mt-1 text-[0.62rem] text-red-400">{formErrors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-ui text-[0.62rem] tracking-[0.1em] text-off-white/60 mb-1.5 uppercase">E-mail</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && handleFormSubmit()}
                        placeholder="joao@email.com"
                        autoComplete="email"
                        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-off-white placeholder:text-text-muted focus:outline-none transition-all duration-200 ${formErrors.email ? "border-red-400/50" : "border-white/10 focus:border-gold/40"}`}
                        style={{ background: "#1a1114", color: "#f3ece8" }}
                      />
                      {formErrors.email && <p className="mt-1 text-[0.62rem] text-red-400">{formErrors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block font-ui text-[0.62rem] tracking-[0.1em] text-off-white/60 mb-1.5 uppercase">WhatsApp</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && handleFormSubmit()}
                        placeholder="(81) 99999-9999"
                        autoComplete="tel"
                        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-off-white placeholder:text-text-muted focus:outline-none transition-all duration-200 ${formErrors.phone ? "border-red-400/50" : "border-white/10 focus:border-gold/40"}`}
                        style={{ background: "#1a1114", color: "#f3ece8" }}
                      />
                      {formErrors.phone && <p className="mt-1 text-[0.62rem] text-red-400">{formErrors.phone}</p>}
                    </div>

                    <p className="text-[0.62rem] text-text-muted font-body leading-relaxed">
                      Seus dados são usados para confirmar a compra e envio do material. Nunca compartilhamos suas informações.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="items"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    {/* Ebook item */}
                    {hasEbook && (
                    <div className="group relative overflow-hidden rounded-2xl border border-white/8 bg-black/20 p-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.04] to-transparent pointer-events-none" />
                      <div className="flex items-start gap-4">
                        <div className="w-[3.5rem] h-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-support shadow-lg">
                          <img src={content.ebookCoverUrl || ebookMockup} alt="Manual do Empregador" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-sm font-semibold text-off-white leading-snug">Manual do Empregador</p>
                          <p className="mt-1 font-ui text-[0.6rem] tracking-[0.18em] text-text-muted uppercase">E-book digital</p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="font-display text-lg font-bold text-gold">R$ {ebookPrice}</span>
                            <button onClick={() => removeItem(ctaAcessoId)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03] text-white/30 hover:border-red-400/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200" aria-label="Remover e-book">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Event item */}
                    {hasEvent && (
                    <div className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-[#0f0c08] p-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.06] to-transparent pointer-events-none" />
                      <div className="flex items-start gap-4">
                        <div className="w-[3.5rem] h-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-[#1a1508] border border-gold/15 flex items-center justify-center">
                          <CalendarDays className="w-6 h-6 text-gold/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-sm font-semibold text-off-white leading-snug">Segurança Jurídica 360</p>
                          <p className="mt-1 font-ui text-[0.6rem] tracking-[0.18em] text-text-muted uppercase">Inscrição no evento</p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="font-display text-lg font-bold text-gold">R$ {eventPrice}</span>
                            <button onClick={() => removeItem(ctaVagaId)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03] text-white/30 hover:border-red-400/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200" aria-label="Remover evento">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Order summary */}
                    <div className="rounded-2xl border border-white/8 bg-black/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/6">
                        <p className="font-ui text-[0.6rem] tracking-[0.2em] text-text-muted uppercase">Resumo do pedido</p>
                      </div>
                      <div className="px-4 py-3 space-y-2">
                        {hasEbook && (
                        <div className="flex justify-between text-xs text-off-white/60 font-body">
                          <span>E-book</span>
                          <span>R$ {ebookPrice}</span>
                        </div>
                        )}
                        {hasEvent && (
                        <div className="flex justify-between text-xs text-off-white/60 font-body">
                          <span>Evento</span>
                          <span>R$ {eventPrice}</span>
                        </div>
                        )}
                        <div className="flex justify-between text-xs text-off-white/60 font-body">
                          <span>Entrega</span>
                          <span className="text-gold">Gratuita</span>
                        </div>
                        <div className="border-t border-white/6 pt-2 flex justify-between font-display font-semibold text-off-white text-sm">
                          <span>Total</span>
                          <span className="text-gold">R$ {totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Trust signals */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 rounded-xl border border-white/6 bg-black/10 px-3 py-2.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-wine/70 shrink-0" />
                        <span className="text-[0.68rem] text-text-muted font-body leading-snug">Pagamento seguro</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl border border-white/6 bg-black/10 px-3 py-2.5">
                        <Zap className="w-3.5 h-3.5 text-gold/70 shrink-0" />
                        <span className="text-[0.68rem] text-text-muted font-body leading-snug">Acesso imediato</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {(cartCount > 0 || step === "success") && (
              <div className="border-t border-white/8 px-6 py-5 space-y-3">
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent pointer-events-none" />

                {checkoutError && step !== "success" && (
                  <p className="text-xs text-red-400 text-center font-body -mb-1" role="alert">
                    {checkoutError}
                  </p>
                )}

                {step === "success" ? (
                  <button
                    onClick={closeCart}
                    className="w-full flex items-center justify-center gap-2 min-h-[48px] rounded-xl font-ui font-bold text-sm text-white border border-white/10 hover:border-white/20 transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    Fechar
                  </button>
                ) : step === "payment" ? (
                  <button
                    onClick={() => setStep("form")}
                    className="w-full text-center font-body text-xs text-text-muted hover:text-off-white/70 transition-colors py-1 flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-3 h-3" />Voltar aos dados
                  </button>
                ) : step === "form" ? (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleFormSubmit}
                      disabled={isLoadingEbook || isLoadingEvent}
                      aria-busy={isLoadingEbook || isLoadingEvent}
                      className="relative w-full flex items-center justify-center gap-2 min-h-[48px] rounded-xl font-ui font-bold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-8px_rgba(201,168,76,0.5)] overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none" style={{ background: '#2d7a4f' }} onMouseEnter={e => { if(!(e.currentTarget as HTMLButtonElement).disabled)(e.currentTarget as HTMLButtonElement).style.background='#c9a84c' }} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background='#2d7a4f'}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-gold/0 via-white/10 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      {(isLoadingEbook || isLoadingEvent) ? (
                        <><Loader2 className="h-4 w-4 animate-spin" />Aguarde...</>
                      ) : (
                        <>Ir para pagamento<ArrowRight className="h-4 w-4" /></>
                      )}
                    </motion.button>
                    <button
                      onClick={() => setStep("cart")}
                      className="w-full text-center font-body text-xs text-text-muted hover:text-off-white/70 transition-colors py-1 flex items-center justify-center gap-1"
                    >
                      <ChevronLeft className="w-3 h-3" />Voltar ao carrinho
                    </button>
                  </>
                ) : (
                  <>
                    {/* Ebook checkout */}
                    {hasEbook && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => goToForm(ctaAcessoId)}
                      disabled={isLoadingEbook || isLoadingEvent}
                      className="relative w-full flex items-center justify-center gap-2 min-h-[48px] rounded-xl font-ui font-bold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-8px_rgba(201,168,76,0.5)] overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none" style={{ background: '#2d7a4f' }} onMouseEnter={e => { if(!(e.currentTarget as HTMLButtonElement).disabled)(e.currentTarget as HTMLButtonElement).style.background='#c9a84c' }} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background='#2d7a4f'}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-gold/0 via-white/10 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <>Finalizar compra do e-book<ArrowRight className="h-4 w-4" /></>
                    </motion.button>
                    )}

                    {/* Event checkout */}
                    {hasEvent && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => goToForm(ctaVagaId)}
                      disabled={isLoadingEbook || isLoadingEvent}
                      className="relative w-full flex items-center justify-center gap-2 min-h-[48px] rounded-xl border font-ui font-bold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-8px_rgba(201,168,76,0.5)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0" style={{ background: '#2d7a4f', borderColor: '#2d7a4f' }} onMouseEnter={e => { if(!(e.currentTarget as HTMLButtonElement).disabled)(e.currentTarget as HTMLButtonElement).style.background='#c9a84c' }} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background='#2d7a4f'}
                    >
                      <><CalendarDays className="h-4 w-4" />Inscrever no Segurança Jurídica 360<ArrowRight className="h-4 w-4" /></>
                    </motion.button>
                    )}

                    <button
                      onClick={closeCart}
                      className="w-full text-center font-body text-xs text-text-muted hover:text-off-white/70 transition-colors py-1 flex items-center justify-center gap-1"
                    >
                      Continuar navegando
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[0.6rem] text-text-muted font-body">
                      <BookOpen className="w-3 h-3 text-wine/50 shrink-0" />
                      <span>Compra única · sem mensalidade · acesso imediato</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
