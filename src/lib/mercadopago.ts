/**
 * Mercado Pago — helper client-side
 *
 * Chama a Supabase Edge Function `create-mp-preference` para criar
 * uma preferência de pagamento no servidor (onde o Access Token fica seguro)
 * e retorna a URL de checkout do Mercado Pago.
 *
 * Fallback: se o Supabase não estiver configurado, lança um erro
 * que o CartDrawer captura e redireciona para a URL estática do config.
 */

import { supabase } from "@/lib/supabase";

export interface MPPreferenceResult {
  /** URL de checkout em produção */
  init_point: string;
  /** URL de checkout no sandbox (testes) */
  sandbox_init_point?: string;
}

export class MPNotConfiguredError extends Error {
  constructor() {
    super("Supabase não configurado — MP não disponível.");
    this.name = "MPNotConfiguredError";
  }
}

/**
 * Cria uma preferência de pagamento via Edge Function e retorna a URL de checkout.
 *
 * @throws {MPNotConfiguredError} quando VITE_SUPABASE_URL/KEY não estão definidas
 * @throws {Error} para erros da API do Mercado Pago
 */
export const createMPPreference = async (): Promise<MPPreferenceResult> => {
  if (!supabase) {
    throw new MPNotConfiguredError();
  }

  const { data, error } = await supabase.functions.invoke(
    "create-mp-preference",
    {
      body: { origin: window.location.origin },
    }
  );

  if (error) {
    throw new Error(error.message || "Erro ao criar preferência de pagamento.");
  }

  if (!data?.init_point) {
    throw new Error("URL de checkout não retornada pelo servidor.");
  }

  return data as MPPreferenceResult;
};

/**
 * Retorna a URL de checkout ativa:
 * - Em produção: init_point do Mercado Pago
 * - Em sandbox (VITE_MP_SANDBOX=true): sandbox_init_point
 */
export const getMPCheckoutUrl = (result: MPPreferenceResult): string => {
  const isSandbox = import.meta.env.VITE_MP_SANDBOX === "true";
  return isSandbox && result.sandbox_init_point
    ? result.sandbox_init_point
    : result.init_point;
};
