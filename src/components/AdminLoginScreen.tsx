import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Lock, Loader2 } from "lucide-react";
import { loginAdmin } from "@/lib/repository";
import { gtmPush } from "@/lib/tracking";

export default function AdminLoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      await loginAdmin(username.trim(), password);
      setPassword("");
      gtmPush({ event: "admin_login", method: "password" });
      onLogin();
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível entrar."); }
    finally { setLoading(false); }
  };
  const inputClass = "w-full bg-support border border-white/10 focus:border-wine/50 rounded-md px-4 py-3.5 text-foreground font-body text-base focus:outline-none transition-colors";
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(62,21,23,0.5) 0%, transparent 70%)" }} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary/20 border border-wine/20 mb-5"><Lock className="w-5 h-5 text-wine" /></div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Área Restrita</h1>
          <p className="text-white/60 font-body text-sm mt-2">MANUAL DO EMPREGADOR — Admin</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="admin-username" className="block font-ui text-[0.62rem] tracking-[0.14em] text-white/50 mb-1.5 uppercase">Usuário</label>
            <input id="admin-username" value={username} onChange={e => setUsername(e.target.value)} autoFocus autoComplete="username" required maxLength={200} className={inputClass} />
          </div>
          <div>
            <label htmlFor="admin-password" className="block font-ui text-[0.62rem] tracking-[0.14em] text-white/50 mb-1.5 uppercase">Senha</label>
            <input id="admin-password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required maxLength={256} className={inputClass} />
          </div>
          {error && <p role="alert" className="text-red-400 text-xs font-body flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-wine hover:bg-wine-light text-background font-ui font-bold text-sm min-h-[48px] rounded-md transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {loading ? "ENTRANDO…" : "ENTRAR"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
