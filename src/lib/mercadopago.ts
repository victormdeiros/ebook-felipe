/**
 * Mercado Pago — helper client-side
 *
 * Chama o backend Express (/api/mp/preference) para criar uma preferência
 * de pagamento. O Access Token fica seguro no servidor; o frontend recebe
 * apenas as URLs de checkout.
 */

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export interface MPPreferenceResult {
  /** URL de checkout em produção */
  init_point: string;
  /** URL de checkout no sandbox (testes) */
  sandbox_init_point?: string;
  /** ID da preferência no MP */
  preference_id: string;
  /** Produto associado */
  product: "ebook" | "event";
}

export class MPNotConfiguredError extends Error {
  constructor() {
    super("Backend não configurado — MP não disponível.");
    this.name = "MPNotConfiguredError";
  }
}

/**
 * Cria uma preferência de pagamento no backend e retorna as URLs de checkout.
 *
 * @param product - "ebook" (padrão) ou "event"
 * @throws {MPNotConfiguredError} quando VITE_API_URL não está definida
 * @throws {Error} para erros da API
 */
export const createMPPreference = async (
  product: "ebook" | "event" = "ebook",
  payer?: { name: string; email: string; phone: string }
): Promise<MPPreferenceResult> => {
  if (!API_URL) {
    throw new MPNotConfiguredError();
  }

  const res = await fetch(`${API_URL}/api/mp/preference`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product, origin: window.location.origin, payer }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Erro HTTP ${res.status}`);
  }

  const data = await res.json() as MPPreferenceResult;

  if (!data?.init_point) {
    throw new Error("URL de checkout não retornada pelo servidor.");
  }

  return data;
};

/**
 * Retorna a URL de checkout ativa:
 * - Sandbox (VITE_MP_SANDBOX=true): sandbox_init_point
 * - Produção: init_point
 */
export const getMPCheckoutUrl = (result: MPPreferenceResult): string => {
  const isSandbox = import.meta.env.VITE_MP_SANDBOX === "true";
  return isSandbox && result.sandbox_init_point
    ? result.sandbox_init_point
    : result.init_point;
};

/**
 * Verifica se o backend está configurado com MP.
 */
export const getMPStatus = async (): Promise<{
  configured: boolean;
  public_key: string | null;
  products: { ebook: { price: number }; event: { price: number } };
} | null> => {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/mp/status`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

