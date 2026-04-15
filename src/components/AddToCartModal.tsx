import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingCart, ArrowRight, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getContent } from "@/lib/contentStore";
import ebookMockup from "@/assets/ebook-mockup.png";

const AddToCartModal = () => {
  const { isModalOpen, closeModal, openCart } = useCart();
  const content = getContent();
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      const t = setTimeout(() => setShowCheck(true), 120);
      return () => clearTimeout(t);
    } else {
      setShowCheck(false);
    }
  }, [isModalOpen]);

  const handleViewCart = () => {
    closeModal();
    setTimeout(() => openCart(), 220);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-[3px]"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Item adicionado ao carrinho"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-[61] w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0608]/90 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
              {/* Top gradient bar */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              {/* Ambient glow */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-gold/10 blur-[60px] pointer-events-none" />

              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white/90 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-7">
                {/* Success checkmark */}
                <div className="mb-6 flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={showCheck ? { scale: 1 } : { scale: 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.05 }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/15 border border-gold/30"
                  >
                    <Check className="h-6 w-6 text-gold" strokeWidth={2.5} />
                  </motion.div>
                  <div>
                    <p className="font-ui text-[0.65rem] tracking-[0.22em] text-gold mb-0.5">
                      ADICIONADO AO CARRINHO
                    </p>
                    <h3 className="font-display text-lg font-semibold text-off-white leading-snug">
                      Item salvo com sucesso!
                    </h3>
                  </div>
                </div>

                {/* Product card */}
                <div className="mb-6 flex items-center gap-4 rounded-2xl border border-white/8 bg-black/25 p-4">
                  <div className="w-14 h-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-support shadow-lg">
                    <img
                      src={content.ebookCoverUrl || ebookMockup}
                      alt="Manual do Empregador Seguro"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-semibold text-off-white leading-snug">
                      Manual do Empregador Seguro
                    </p>
                    <p className="mt-1 text-xs text-text-muted font-body">
                      E-book digital · Acesso imediato
                    </p>
                    <p className="mt-2 font-display text-base font-bold text-gold">
                      R$ {content.price || "49"}
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleViewCart}
                    className="flex w-full items-center justify-center gap-2 min-h-[52px] rounded-xl bg-gold hover:bg-gold-light active:bg-gold-dark font-ui font-bold text-sm text-background transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-8px_rgba(201,168,76,0.45)]"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Ver carrinho
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>

                  <button
                    onClick={closeModal}
                    className="w-full min-h-[44px] rounded-xl border border-white/8 bg-white/[0.03] font-body text-sm text-off-white/60 hover:text-off-white/90 hover:bg-white/[0.06] transition-all duration-200"
                  >
                    Continuar navegando
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddToCartModal;
