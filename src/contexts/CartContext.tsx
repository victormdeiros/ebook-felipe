import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type CartItemId = "ebook" | "event";

export interface CartItem {
  id: CartItemId;
  name: string;
  price: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  isModalOpen: boolean;
  addToCart: () => void;
  addEventToCart: () => void;
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

  const addToCart = useCallback(() => {
    setCartItems((prev) =>
      prev.find((i) => i.id === "ebook")
        ? prev
        : [...prev, { id: "ebook", name: "Manual do Empregador", price: "" }]
    );
  }, []);

  const addEventToCart = useCallback(() => {
    setCartItems((prev) =>
      prev.find((i) => i.id === "event")
        ? prev
        : [...prev, { id: "event", name: "Segurança Jurídica 360", price: "" }]
    );
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // backward compat: removes ebook
  const removeFromCart = useCallback(() => {
    setCartItems((prev) => prev.filter((i) => i.id !== "ebook"));
  }, []);

  const removeItem = useCallback((id: CartItemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
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
        addToCart,
        addEventToCart,
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
