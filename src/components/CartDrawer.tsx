import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, ArrowRight, BookOpen, X, ShieldCheck, Zap, Loader2, CalendarDays } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getContent } from "@/lib/contentStore";
import { CONFIG } from "@/config";
import ebookMockup from "@/assets/ebook-mockup.png";
import { createMPPreference, getMPCheckoutUrl, MPNotConfiguredError } from "@/lib/mercadopago";

const CartDrawer = () => {
  const { isCartOpen, closeCart, cartCount, cartItems, removeItem } = useCart();
  const content = getContent();
  const [isLoadingEbook, setIsLoadingEbook] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const hasEbook = cartItems.some((i) => i.id === "ebook");
  const hasEvent = cartItems.some((i) => i.id === "event");

  const ebookPrice = content.price || String(CONFIG.PRODUCT_PRICE);
  const eventPrice = content.eventPrice || String(CONFIG.EVENT_PRICE);

  const totalPrice = (
    (hasEbook ? Number(ebookPrice) : 0) +
    (hasEvent ? Number(eventPrice) : 0)
  ).toFixed(2).replace(".", ",");

  const handleCheckoutEbook = async () => {
    setCheckoutError(null);
    setIsLoadingEbook(true);
    try {
      const result = await createMPPreference("ebook");
      const url = getMPCheckoutUrl(result);
      closeCart();
      window.location.href = url;
    } catch (err) {
      if (err instanceof MPNotConfiguredError) {
        const url = content.checkoutUrl || CONFIG.PAYMENT_URL;
        if (url && url !== "#" && !url.includes("example")) {
          closeCart();
          window.location.href = url;
        } else {
          setCheckoutError("Checkout do e-book não configurado. Contate o suporte.");
        }
      } else if (err instanceof TypeError) {
        setCheckoutError("Servidor de pagamento offline. Aguarde um instante e tente novamente.");
      } else {
        setCheckoutError((err as Error).message || "Erro ao iniciar pagamento. Tente novamente.");
      }
    } finally {
      setIsLoadingEbook(false);
    }
  };

  const handleCheckoutEvent = async () => {
    setCheckoutError(null);
    setIsLoadingEvent(true);
    try {
      const result = await createMPPreference("event");
      const url = getMPCheckoutUrl(result);
      closeCart();
      window.location.href = url;
    } catch (err) {
      if (err instanceof MPNotConfiguredError) {
        const url = content.eventCheckoutUrl || CONFIG.EVENT_PAYMENT_URL;
        if (url && url !== "#") {
          closeCart();
          window.location.href = url;
        } else {
          setCheckoutError("Link de inscrição do evento não configurado. Contate o suporte.");
        }
      } else if (err instanceof TypeError) {
        setCheckoutError("Servidor de pagamento offline. Aguarde um instante e tente novamente.");
      } else {
        setCheckoutError((err as Error).message || "Erro ao iniciar pagamento. Tente novamente.");
      }
    } finally {
      setIsLoadingEvent(false);
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
                            <button onClick={() => removeItem("ebook")} className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03] text-white/30 hover:border-red-400/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200" aria-label="Remover e-book">
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
                            <button onClick={() => removeItem("event")} className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03] text-white/30 hover:border-red-400/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200" aria-label="Remover evento">
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
            {cartCount > 0 && (
              <div className="border-t border-white/8 px-6 py-5 space-y-3">
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent pointer-events-none" />

                {checkoutError && (
                  <p className="text-xs text-red-400 text-center font-body -mb-1" role="alert">
                    {checkoutError}
                  </p>
                )}

                {/* Ebook checkout */}
                {hasEbook && (
                <motion.button
                  whileTap={isLoadingEbook ? {} : { scale: 0.98 }}
                  onClick={handleCheckoutEbook}
                  disabled={isLoadingEbook || isLoadingEvent}
                  aria-busy={isLoadingEbook}
                  className="relative w-full flex items-center justify-center gap-2 min-h-[48px] rounded-xl font-ui font-bold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-8px_rgba(201,168,76,0.5)] overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none" style={{ background: '#2d7a4f' }} onMouseEnter={e => { if(!(e.currentTarget as HTMLButtonElement).disabled)(e.currentTarget as HTMLButtonElement).style.background='#c9a84c' }} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background='#2d7a4f'}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-gold/0 via-white/10 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {isLoadingEbook ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Aguarde...</>
                  ) : (
                    <>Finalizar compra do e-book<ArrowRight className="h-4 w-4" /></>
                  )}
                </motion.button>
                )}

                {/* Event checkout */}
                {hasEvent && (
                <motion.button
                  whileTap={isLoadingEvent ? {} : { scale: 0.98 }}
                  onClick={handleCheckoutEvent}
                  disabled={isLoadingEbook || isLoadingEvent}
                  aria-busy={isLoadingEvent}
                  className="relative w-full flex items-center justify-center gap-2 min-h-[48px] rounded-xl border font-ui font-bold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-8px_rgba(201,168,76,0.5)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0" style={{ background: '#2d7a4f', borderColor: '#2d7a4f' }} onMouseEnter={e => { if(!(e.currentTarget as HTMLButtonElement).disabled)(e.currentTarget as HTMLButtonElement).style.background='#c9a84c' }} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background='#2d7a4f'}
                >
                  {isLoadingEvent ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Aguarde...</>
                  ) : (
                    <><CalendarDays className="h-4 w-4" />Inscrever no Segurança Jurídica 360<ArrowRight className="h-4 w-4" /></>
                  )}
                </motion.button>
                )}

                <button
                  onClick={closeCart}
                  className="w-full text-center font-body text-xs text-text-muted hover:text-off-white/70 transition-colors py-1"
                >
                  Continuar navegando
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[0.6rem] text-text-muted font-body">
                  <BookOpen className="w-3 h-3 text-wine/50 shrink-0" />
                  <span>Compra única · sem mensalidade · acesso imediato</span>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
