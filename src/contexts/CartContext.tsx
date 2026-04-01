import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface CartContextType {
  cartCount: number;
  isCartOpen: boolean;
  isModalOpen: boolean;
  addToCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  removeFromCart: () => void;
  openModal: () => void;
  closeModal: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // addToCart apenas incrementa o contador — quem chama decide o que abrir
  const addToCart = useCallback(() => setCartCount(1), []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const removeFromCart = useCallback(() => setCartCount(0), []);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        isCartOpen,
        isModalOpen,
        addToCart,
        openCart,
        closeCart,
        removeFromCart,
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
