import { beforeEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "@/lib/repository";
import { trackBeginCheckout, trackCtaClick, trackWhatsAppClick } from "@/lib/tracking";

vi.mock("@/lib/repository", () => ({
  trackEvent: vi.fn(),
}));

describe("marketing tracking helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.dataLayer = [];
  });

  it("tracks CTA clicks with source metadata", () => {
    trackCtaClick("event_primary_ticket", { source: "hero" });

    expect(trackEvent).toHaveBeenCalledWith(
      "cta_click",
      expect.objectContaining({
        cta_id: "event_primary_ticket",
        source: "hero",
      }),
    );
    expect(window.dataLayer).toContainEqual(
      expect.objectContaining({
        event: "cta_click",
        cta_id: "event_primary_ticket",
        source: "hero",
      }),
    );
  });

  it("tracks begin_checkout with ecommerce payload", () => {
    trackBeginCheckout({
      itemId: "event",
      itemName: "Seguranca Juridica 360",
      itemCategory: "Evento",
      value: 67,
    });

    expect(trackEvent).toHaveBeenCalledWith(
      "begin_checkout",
      expect.objectContaining({
        item_id: "event",
        value: 67,
      }),
    );
    expect(window.dataLayer).toContainEqual(
      expect.objectContaining({
        event: "begin_checkout",
        ecommerce: expect.objectContaining({
          currency: "BRL",
          value: 67,
        }),
      }),
    );
  });

  it("tracks WhatsApp clicks separately from checkout clicks", () => {
    trackWhatsAppClick({ source: "event_secondary_cta" });

    expect(trackEvent).toHaveBeenCalledWith(
      "whatsapp_click",
      expect.objectContaining({
        source: "event_secondary_cta",
      }),
    );
    expect(window.dataLayer).toContainEqual(
      expect.objectContaining({
        event: "whatsapp_click",
        source: "event_secondary_cta",
      }),
    );
  });
});
