import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CartDrawer from "@/components/CartDrawer";
import EventLandingSections from "@/components/EventLandingSections";
import { CartProvider } from "@/contexts/CartContext";

const renderEventCheckout = () =>
  render(
    <CartProvider>
      <EventLandingSections />
      <CartDrawer />
    </CartProvider>,
  );

describe("event landing checkout flow", () => {
  it("keeps the event landing page free of heavy video embeds", () => {
    renderEventCheckout();

    expect(document.querySelector("video")).not.toBeInTheDocument();
  });

  it("opens the event lead form directly from the primary ticket CTA", async () => {
    renderEventCheckout();

    fireEvent.click(screen.getAllByRole("button", { name: /participar do grupo vip/i })[0]);

    expect(await screen.findByText(/nome completo/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/resumo do pedido/i)).not.toBeInTheDocument();
    });
  });
});
