import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, ExternalLink, Loader2, Lock, Save } from "lucide-react";
import { getRuntimeCredentials, saveRuntimeCredentials, type RuntimeCredentialStatus } from "@/lib/repository";

const groups = [
  { title: "Supabase · banco e arquivos", fields: [
    { key: "DATABASE_URL", label: "Conexão PostgreSQL", placeholder: "Cole a connection string do Supabase", secret: true },
    { key: "DATABASE_SSL_CA", label: "Certificado TLS (se necessário)", placeholder: "-----BEGIN CERTIFICATE-----", multiline: true },
    { key: "SUPABASE_SECRET_KEY", label: "Chave secreta do Storage", placeholder: "sb_secret_…", secret: true },
    { key: "SUPABASE_SERVICE_ROLE_KEY", label: "Service role (alternativa legada)", placeholder: "Preencha apenas se usar a chave legada", secret: true },
  ] },
  { title: "Resend · envio de e-mails", fields: [
    { key: "RESEND_API_KEY", label: "Chave API Resend", placeholder: "re_…", secret: true },
    { key: "EMAIL_FROM", label: "Remetente verificado", placeholder: "Manual do Empregador <contato@seudominio.com>" },
  ] },
  { title: "Mercado Pago e endereço do site", fields: [
    { key: "MP_ACCESS_TOKEN", label: "Access Token Mercado Pago", placeholder: "APP_USR-…", secret: true },
    { key: "MP_PUBLIC_KEY", label: "Public Key Mercado Pago", placeholder: "APP_USR-…" },
    { key: "SITE_URL", label: "URL pública do site", placeholder: "https://ebook-felipe-nu.vercel.app" },
  ] },
];

export default function RuntimeCredentialsPanel() {
  const [status, setStatus] = useState<RuntimeCredentialStatus | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let active = true;
    getRuntimeCredentials().then(data => {
      if (!active) return;
      setStatus(data);
      setValues({ EMAIL_FROM: data.EMAIL_FROM, SITE_URL: data.SITE_URL });
    }).catch(err => { if (active) setError(err instanceof Error ? err.message : "Erro ao carregar."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError(""); setSaved(false);
    // Blank secret inputs keep the previously saved credentials.
    const changes = Object.fromEntries(Object.entries(values).filter(([, value]) => value.trim()));
    try {
      const data = await saveRuntimeCredentials(changes);
      setStatus(data);
      setValues({ EMAIL_FROM: data.EMAIL_FROM, SITE_URL: data.SITE_URL });
      setSaved(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Erro ao salvar."); }
    finally { setSaving(false); }
  };
  return (
    <section className="surface-card rounded-xl p-5 sm:p-6 space-y-5" aria-labelledby="credentials-heading">
      <div className="flex gap-3 pb-4 border-b border-white/5">
        <div className="w-9 h-9 shrink-0 rounded-md bg-wine/10 border border-wine/20 flex items-center justify-center"><Lock className="w-4 h-4 text-wine" /></div>
        <div>
          <h3 id="credentials-heading" className="font-display text-lg font-semibold text-foreground">Credenciais das integrações</h3>
          <p className="text-text-muted font-body text-xs mt-1">Salvas com criptografia no Supabase. Campos secretos vazios mantêm a configuração atual.</p>
        </div>
      </div>
      {loading ? <p role="status" className="text-text-muted text-sm flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Carregando configuração…</p> : (
        <form onSubmit={submit} className="space-y-6">
          {groups.map(group => (
            <fieldset key={group.title} className="space-y-3">
              <legend className="font-ui text-xs uppercase tracking-[0.12em] text-gold mb-3">{group.title}</legend>
              <div className="grid sm:grid-cols-2 gap-4">
                {group.fields.map(field => {
                  const secret = "secret" in field && field.secret;
                  const multiline = "multiline" in field && field.multiline;
                  const inputClass = "w-full bg-background border border-white/10 focus:border-wine/40 rounded-md px-3 py-2.5 font-body text-sm text-foreground focus:outline-none";
                  return (
                    <div key={field.key}>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label htmlFor={"credential-" + field.key} className="font-body text-sm text-foreground">{field.label}</label>
                        <span className={status?.configured[field.key] ? "text-green-400 text-[0.65rem]" : "text-text-muted text-[0.65rem]"}>{status?.configured[field.key] ? "Configurado" : "Pendente"}</span>
                      </div>
                      {multiline ? <textarea id={"credential-" + field.key} value={values[field.key] ?? ""} onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))} placeholder={field.placeholder} rows={3} className={inputClass} />
                        : <input id={"credential-" + field.key} type={secret ? "password" : "text"} autoComplete="off" value={values[field.key] ?? ""} onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))} placeholder={status?.configured[field.key] && secret ? "Salvo · preencha para substituir" : field.placeholder} className={inputClass} />}
                    </div>
                  );
                })}
              </div>
              {group.title.startsWith("Supabase") && <p className="text-text-muted text-xs">Projeto conectado: heusjcoijobbsgzyfupm. Copie a conexão em Supabase → Connect; para Vercel, prefira o pooler de transações.</p>}
              {group.title.startsWith("Resend") && (
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
                  <a href="https://resend.com/docs/dashboard/api-keys/introduction" target="_blank" rel="noopener noreferrer" className="text-wine hover:text-wine-light inline-flex gap-1.5 items-center">Como criar a chave no Resend<ExternalLink className="w-3 h-3" /></a>
                  <a href="https://resend.com/docs/dashboard/domains/introduction" target="_blank" rel="noopener noreferrer" className="text-wine hover:text-wine-light inline-flex gap-1.5 items-center">Verificar o domínio do remetente<ExternalLink className="w-3 h-3" /></a>
                </div>
              )}
            </fieldset>
          ))}
          {error && <p role="alert" className="text-red-400 font-body text-sm">{error}</p>}
          {saved && <p role="status" className="text-green-400 font-body text-sm flex gap-2 items-center"><CheckCircle2 className="w-4 h-4" />Credenciais salvas no Supabase.</p>}
          <button type="submit" disabled={saving || !status} className="bg-wine hover:bg-wine-light text-background rounded-md px-5 py-3 font-ui text-sm font-bold inline-flex gap-2 items-center disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? "SALVANDO…" : "SALVAR CREDENCIAIS"}
          </button>
        </form>
      )}
    </section>
  );
}
