import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { getContent } from "@/lib/contentStore";

export type CartItemId = string;

export interface CartItem {
  id: CartItemId;
  name: string;
  price: string;
}

export interface CheckoutIntent {
  productId: CartItemId;
  requestedAt: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  isModalOpen: boolean;
  checkoutIntent: CheckoutIntent | null;
  addToCart: () => void;
  addEventToCart: () => void;
  startEventCheckout: () => void;
  clearCheckoutIntent: () => void;
  openCart: () => void;
  closeCart: () => void;
  removeFromCart: () => void;
  removeItem: (id: CartItemId) => void;
  openModal: () => void;
  closeModal: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutIntent, setCheckoutIntent] = useState<CheckoutIntent | null>(null);

  const addItem = useCallback((item: CartItem) => {
    setCartItems((prev) =>
      prev.find((current) => current.id === item.id) ? prev : [...prev, item],
    );
  }, []);

  const addToCart = useCallback(() => {
    const id = getContent().ctaAcessoProductId || "ebook";
    addItem({ id, name: "Manual do Empregador", price: "" });
  }, [addItem]);

  const addEventToCart = useCallback(() => {
    const id = getContent().ctaVagaProductId || "event";
    addItem({ id, name: "Segurança Jurídica 360", price: "" });
  }, [addItem]);

  const startEventCheckout = useCallback(() => {
    const id = getContent().ctaVagaProductId || "event";
    addItem({ id, name: "Segurança Jurídica 360", price: "" });
    setCheckoutIntent({ productId: id, requestedAt: Date.now() });
    setIsCartOpen(true);
  }, [addItem]);

  const clearCheckoutIntent = useCallback(() => setCheckoutIntent(null), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const removeFromCart = useCallback(() => {
    setCartItems((prev) => prev.filter((item) => item.id !== "ebook"));
  }, []);

  const removeItem = useCallback((id: CartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.length,
        isCartOpen,
        isModalOpen,
        checkoutIntent,
        addToCart,
        addEventToCart,
        startEventCheckout,
        clearCheckoutIntent,
        openCart,
        closeCart,
        removeFromCart,
        removeItem,
        openModal,
        closeModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
