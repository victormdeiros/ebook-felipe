import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  Users,
  ShoppingCart,
  Eye,
  LogOut,
  Search,
  Download,
  RefreshCw,
  Edit3,
  LinkIcon,
  DollarSign,
  ImageIcon,
  Check,
  AlertCircle,
  TrendingUp,
  Lock,
  X,
  Menu,
  Settings,
  CreditCard,
  Loader2,
  CheckCircle2,
  XCircle,
  Zap,
  Package,
  CalendarDays,
  BookOpen,
  Activity,
  ArrowRight,
  ExternalLink,
  Wallet,
  Plus,
  Trash2,
  Pencil,
  Link2,
  Mail,
  ToggleLeft,
  ToggleRight,
  SendHorizonal,
  Clock,
  ChevronDown,
  MousePointer2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  getLeads,
  getOrders,
  getDashboardStats,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getInscricoes,
  uploadEbookFile,
  getEbookUrl,
  markAttended,
  getEmailTemplates,
  updateEmailTemplate,
  getEmailQueue,
  processEmailQueue,
  testSendCartEmails,
  getCTAConfig,
  saveCTAConfig,
  type Lead,
  type Order,
  type DashboardStats,
  type Product,
  type Inscricao,
  type EmailTemplate,
  type EmailQueueItem,
  type CTAConfig,
} from "@/lib/repository";
import {
  getContent,
  saveContent,
  resetContent,
  CONTENT_DEFAULTS,
  ContentData,
} from "@/lib/contentStore";
import { createMPPreference, getMPCheckoutUrl, getMPStatus } from "@/lib/mercadopago";

// AUTH
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_TOKEN ?? "ManualEmpregador@2024";
const AUTH_KEY = "fl_admin_auth";

const isAuthed = () => sessionStorage.getItem(AUTH_KEY) === "true";
const setAuthed = () => sessionStorage.setItem(AUTH_KEY, "true");
const clearAuth = () => sessionStorage.removeItem(AUTH_KEY);

// TYPES
type Tab = "metricas" | "leads" | "pedidos" | "inscricoes" | "ebook" | "produtos" | "ctas" | "conteudo" | "emails" | "configuracoes";

// HELPERS
const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
};

const exportCSV = (leads: Lead[]) => {
  if (!leads.length) return;
  const headers = ["Nome", "E-mail", "WhatsApp", "Data"];
  const rows = leads.map((l) =>
    [l.name, l.email, l.whatsapp, l.data]
      .map((v) => `"${(v ?? "").replace(/"/g, '""')}"`)
      .join(";")
  );
  const csv = [headers.join(";"), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// LOGIN SCREEN
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { setAuthed(); onLogin(); }
    else { setError(true); setPw(""); setTimeout(() => setError(false), 2000); }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(62,21,23,0.5) 0%, transparent 70%)" }} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }} className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary/20 border border-wine/20 mb-5">
            <Lock className="w-5 h-5 text-wine" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground tracking-tight">Área Restrita</h1>
          <p className="text-white/60 font-body text-sm mt-2">MANUAL DO EMPREGADOR — Admin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Senha de acesso" autoFocus className={`w-full bg-support border rounded-md px-4 py-3.5 text-foreground font-body text-base focus:outline-none transition-all duration-200 pr-12 ${error ? "border-red-400/60" : "border-white/8 focus:border-wine/50"}`} aria-label="Senha de administrador" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground transition-colors p-1" aria-label={show ? "Ocultar senha" : "Mostrar senha"}>
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs font-body flex items-center gap-1.5" role="alert">
                <AlertCircle className="w-3.5 h-3.5" />Senha incorreta.
              </motion.p>
            )}
          </AnimatePresence>
          <button type="submit" className="w-full bg-wine hover:bg-wine-light text-background font-ui font-bold text-sm min-h-[48px] rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(200,121,124,0.3)]">
            ENTRAR
          </button>
        </form>
      </motion.div>
    </main>
  );
};

// KPI CARD
interface KpiCardProps {
  label: string; value: string | number; icon: React.ElementType;
  accent?: "wine" | "gold"; sub?: string; loading?: boolean;
}
const KpiCard = ({ label, value, icon: Icon, accent, sub, loading }: KpiCardProps) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={`surface-card rounded-xl p-4 sm:p-6 flex flex-col gap-3 ${accent === "wine" ? "border-wine/15" : accent === "gold" ? "border-gold/15" : ""}`}>
    <div className="flex items-center justify-between">
      <span className="text-text-muted font-body text-xs uppercase tracking-[0.15em]">{label}</span>
      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${accent === "wine" ? "bg-wine/10" : accent === "gold" ? "bg-gold/10" : "bg-white/4"}`}>
        <Icon className={`w-4 h-4 ${accent === "wine" ? "text-wine" : accent === "gold" ? "text-gold" : "text-text-muted"}`} strokeWidth={1.5} />
      </div>
    </div>
    {loading ? (<div className="h-9 w-24 bg-white/5 rounded animate-pulse" />) : (
      <span className={`font-body text-3xl sm:text-4xl font-semibold tabular-nums ${accent === "wine" ? "text-wine" : accent === "gold" ? "text-gold" : "text-foreground"}`}>{value}</span>
    )}
    {sub && <span className="text-text-muted font-body text-xs">{sub}</span>}
  </motion.div>
);

// METRICS TAB
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  credit_card: "Cartão de Crédito",
  debit_card: "Cartão de Débito",
  ticket: "Boleto",
  bank_transfer: "PIX",
  account_money: "Saldo MP",
  unknown: "Outros",
};

const MetricsTab = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getDashboardStats();
    setStats(data);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const conversionRate = stats && stats.total_leads > 0
    ? ((stats.total_orders / stats.total_leads) * 100).toFixed(1)
    : "0.0";

  const abandonedCount = stats?.leads_by_tag?.find(t => t.tag === "carrinho_abandonado")?.count ?? 0;
  const inscricoesCount = stats?.leads_by_tag?.find(t => t.tag === "inscricao_evento")?.count ?? 0;

  const emailPending = stats?.email_stats?.pending ?? 0;
  const emailSent = stats?.email_stats?.sent ?? 0;
  const emailFailed = stats?.email_stats?.failed ?? 0;

  const customTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-support border border-white/8 rounded-md px-3 py-2 text-xs font-body space-y-1">
          <p className="text-text-muted mb-0.5">{label}</p>
          {payload.map((p) => (
            <p key={p.name} className="font-semibold" style={{ color: p.name === "revenue" ? "#c9a84c" : "#C8797C" }}>
              {p.name === "revenue" ? formatCurrency(p.value) : `${p.value} ${p.name === "leads" ? "leads" : "pedidos"}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Métricas de Performance</h2>
          <p className="text-text-muted font-body text-sm mt-1">{stats ? "Dados do banco em tempo real." : "Conectando ao backend…"}</p>
        </div>
        <button onClick={refresh} className="flex items-center gap-2 text-text-muted hover:text-foreground font-body text-sm transition-colors border border-white/8 hover:border-white/15 px-3 py-2 rounded-md shrink-0">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />Atualizar
        </button>
      </div>

      {!stats && !loading && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-5 py-4 text-xs text-yellow-200 font-body flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-yellow-400" />
          <div>
            <p className="font-semibold text-yellow-300 mb-1">Backend não acessível</p>
            <p>Verifique se o servidor Express está rodando e se <code className="bg-white/10 px-1 rounded">VITE_API_URL</code> está configurado no <code className="bg-white/10 px-1 rounded">.env</code>.</p>
          </div>
        </div>
      )}

      {/* KPI Cards — Row 1: Leads & Conversão */}
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-text-muted font-ui mb-3">Leads & Conversão</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard label="Total Leads" value={stats?.total_leads ?? "—"} icon={Users} accent="wine" loading={loading} />
          <KpiCard label="Leads (30d)" value={stats?.leads_last_30d ?? "—"} icon={TrendingUp} loading={loading} />
          <KpiCard label="Carrinhos Abandonados" value={abandonedCount || "—"} icon={ShoppingCart} loading={loading} sub="com tag" />
          <KpiCard label="Taxa de Conversão" value={stats ? `${conversionRate}%` : "—"} icon={TrendingUp} accent="gold" loading={loading} sub="leads → pedidos" />
        </div>
      </div>

      {/* KPI Cards — Row 2: Vendas & Receita */}
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-text-muted font-ui mb-3">Vendas & Receita</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard label="Pedidos Aprovados" value={stats?.total_orders ?? "—"} icon={ShoppingCart} accent="gold" loading={loading} />
          <KpiCard label="Pedidos (30d)" value={stats?.orders_last_30d ?? "—"} icon={TrendingUp} loading={loading} />
          <KpiCard label="Receita Total" value={stats ? formatCurrency(Number(stats.total_revenue)) : "—"} icon={Wallet} accent="gold" loading={loading} />
          <KpiCard label="Receita (30d)" value={stats ? formatCurrency(Number(stats.revenue_last_30d ?? 0)) : "—"} icon={Wallet} loading={loading} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="surface-card rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-4 h-4 text-wine" strokeWidth={1.5} />
            <h3 className="font-display text-base font-semibold text-foreground">Leads — últimos 30 dias</h3>
          </div>
          {!stats?.leads_by_day?.length ? (
            <div className="h-44 flex flex-col items-center justify-center text-text-muted font-body text-xs gap-2">
              <BarChart2 className="w-7 h-7 opacity-30" strokeWidth={1} /><p>Nenhum dado ainda.</p>
            </div>
          ) : (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.leads_by_day} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                  <defs>
                    <linearGradient id="wineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C8797C" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#C8797C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="date" stroke="#6b5f62" tick={{ fontSize: 10, fill: "#a79797" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis stroke="#6b5f62" tick={{ fontSize: 10, fill: "#a79797" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={(p) => customTooltip({ ...p, payload: p.payload?.map((x) => ({ value: x.value as number, name: "leads" })) })} cursor={{ stroke: "rgba(200,121,124,0.2)", strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="count" stroke="#C8797C" strokeWidth={2} fill="url(#wineGrad)" dot={false} activeDot={{ r: 4, fill: "#C8797C", stroke: "#000", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="surface-card rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Wallet className="w-4 h-4 text-gold" strokeWidth={1.5} />
            <h3 className="font-display text-base font-semibold text-foreground">Receita — últimos 30 dias</h3>
          </div>
          {!stats?.orders_by_day?.length ? (
            <div className="h-44 flex flex-col items-center justify-center text-text-muted font-body text-xs gap-2">
              <BarChart2 className="w-7 h-7 opacity-30" strokeWidth={1} /><p>Nenhum pedido aprovado ainda.</p>
            </div>
          ) : (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.orders_by_day} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="date" stroke="#6b5f62" tick={{ fontSize: 10, fill: "#a79797" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis stroke="#6b5f62" tick={{ fontSize: 10, fill: "#a79797" }} tickLine={false} axisLine={false} />
                  <Tooltip content={(p) => customTooltip({ ...p, payload: p.payload?.map((x) => ({ value: x.value as number, name: "revenue" })) })} cursor={{ fill: "rgba(201,168,76,0.06)" }} />
                  <Bar dataKey="revenue" fill="#c9a84c" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: 3 cards */}
      <div className="grid sm:grid-cols-3 gap-6">

        {/* Funil de conversão */}
        <div className="surface-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-wine" strokeWidth={1.5} />
            <h3 className="font-display text-sm font-semibold text-foreground">Funil de Conversão</h3>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-8 rounded bg-white/5 animate-pulse" />)}</div>
          ) : (
            <div className="space-y-2 font-body text-xs">
              {[
                { label: "Total Leads", value: stats?.total_leads ?? 0, color: "bg-wine/60", pct: 100 },
                { label: "Inscrições Evento", value: inscricoesCount, color: "bg-blue-500/60", pct: stats?.total_leads ? (inscricoesCount / stats.total_leads) * 100 : 0 },
                { label: "Pedidos Aprovados", value: stats?.total_orders ?? 0, color: "bg-gold/60", pct: stats?.total_leads ? ((stats.total_orders ?? 0) / stats.total_leads) * 100 : 0 },
              ].map(({ label, value, color, pct }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-text-muted">{label}</span>
                    <span className="text-foreground font-semibold tabular-nums">{value}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5">
                    <div className={`h-1.5 rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              ))}
              <div className="pt-1 border-t border-white/5 flex justify-between">
                <span className="text-text-muted">Conversão geral</span>
                <span className="text-gold font-bold">{conversionRate}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Vendas por produto */}
        <div className="surface-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold" strokeWidth={1.5} />
            <h3 className="font-display text-sm font-semibold text-foreground">Vendas por Produto</h3>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-10 rounded bg-white/5 animate-pulse" />)}</div>
          ) : !stats?.product_breakdown?.length ? (
            <p className="text-text-muted text-xs font-body py-4 text-center">Nenhuma venda ainda.</p>
          ) : (
            <div className="space-y-3 font-body text-xs">
              {stats.product_breakdown.map(({ product, count, revenue }) => {
                const total = stats.total_orders || 1;
                const pct = (count / total) * 100;
                const isEvent = product === "event";
                return (
                  <div key={product}>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1.5">
                        {isEvent ? <CalendarDays className="w-3 h-3 text-blue-400" strokeWidth={1.5} /> : <BookOpen className="w-3 h-3 text-gold" strokeWidth={1.5} />}
                        <span className="text-text-muted">{isEvent ? "Evento" : "E-book"}</span>
                      </span>
                      <span className="text-foreground font-semibold">{count} · {formatCurrency(revenue)}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5">
                      <div className={`h-1.5 rounded-full ${isEvent ? "bg-blue-500/60" : "bg-gold/60"} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="pt-1 border-t border-white/5 space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-muted">E-books aprovados</span>
                  <span className="text-foreground tabular-nums">{stats.ebook_orders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Eventos aprovados</span>
                  <span className="text-foreground tabular-nums">{stats.event_orders}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* E-mails automáticos */}
        <div className="surface-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
            <h3 className="font-display text-sm font-semibold text-foreground">Fila de E-mails</h3>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-7 rounded bg-white/5 animate-pulse" />)}</div>
          ) : (
            <div className="space-y-2 font-body text-xs">
              {[
                { label: "Enviados", value: emailSent, color: "text-green-400", dot: "bg-green-400" },
                { label: "Pendentes", value: emailPending, color: "text-amber-400", dot: "bg-amber-400" },
                { label: "Falhas", value: emailFailed, color: "text-red-400", dot: "bg-red-400" },
                { label: "Cancelados", value: stats?.email_stats?.cancelled ?? 0, color: "text-text-muted", dot: "bg-white/20" },
              ].map(({ label, value, color, dot }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="flex items-center gap-2 text-text-muted">
                    <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                    {label}
                  </span>
                  <span className={`font-semibold tabular-nums ${color}`}>{value}</span>
                </div>
              ))}
              {stats?.payment_methods && stats.payment_methods.length > 0 && (
                <>
                  <p className="text-[0.6rem] uppercase tracking-[0.12em] text-text-muted pt-2">Métodos de pagamento</p>
                  {stats.payment_methods.map(({ method, count }) => (
                    <div key={method} className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-0">
                      <span className="text-text-muted">{PAYMENT_METHOD_LABELS[method] ?? method}</span>
                      <span className="text-foreground font-semibold tabular-nums">{count}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// LEADS TAB
const TAG_LABELS: Record<string, { label: string; color: string }> = {
  carrinho_abandonado: { label: "Carrinho abandonado", color: "text-orange-400 bg-orange-500/10 border-orange-500/25" },
  inscricao_evento: { label: "Inscrição evento", color: "text-blue-400 bg-blue-500/10 border-blue-500/25" },
  entrar_em_contato: { label: "Entrar em contato", color: "text-purple-400 bg-purple-500/10 border-purple-500/25" },
};

const LeadsTab = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const PER_PAGE = 15;

  useEffect(() => {
    setLoading(true);
    getLeads(tagFilter === "all" ? undefined : tagFilter).then((data) => { setLeads(data); setLoading(false); });
  }, [tagFilter]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter((l) => l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q));
  }, [leads, search]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Gestão de Leads</h2>
        <p className="text-text-muted font-body text-sm mt-1">{loading ? "Carregando…" : `${leads.length} lead${leads.length !== 1 ? "s" : ""}`}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por nome ou e-mail…" className="w-full bg-support border border-white/8 rounded-md pl-9 pr-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:border-wine/40 transition-colors" />
          </div>
          <select value={tagFilter} onChange={(e) => { setTagFilter(e.target.value); setPage(1); }} className="bg-support border border-white/8 rounded-md px-3 py-2.5 text-foreground font-body text-sm focus:outline-none focus:border-wine/40 transition-colors">
            <option value="all">Todas as tags</option>
            <option value="carrinho_abandonado">Carrinho abandonado</option>
            <option value="inscricao_evento">Inscrição evento</option>
            <option value="entrar_em_contato">Entrar em contato</option>
          </select>
        </div>
        <button onClick={() => exportCSV(filtered)} disabled={filtered.length === 0} className="flex items-center gap-2 border border-white/8 hover:border-wine/30 text-text-muted hover:text-foreground px-4 py-2.5 rounded-md font-body text-sm transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none">
          <Download className="w-3.5 h-3.5" />Exportar CSV
        </button>
      </div>
      <div className="surface-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-wine animate-spin" /><p className="text-text-muted font-body text-sm">Carregando leads…</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-text-muted font-body text-sm gap-2">
            <Users className="w-8 h-8 opacity-30" strokeWidth={1} /><p>{search ? "Nenhum resultado." : "Nenhum lead ainda."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead><tr className="border-b border-white/5">
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold">Nome</th>
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold">E-mail</th>
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold hidden md:table-cell">WhatsApp</th>
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold hidden lg:table-cell">Tags</th>
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold hidden sm:table-cell">Data</th>
              </tr></thead>
              <tbody>
                {paginated.map((lead, i) => (
                  <tr key={i} className="border-b border-white/4 hover:bg-white/2 transition-colors last:border-0">
                    <td className="px-5 py-3.5 text-white max-w-[140px]"><span className="block truncate">{lead.name || "—"}</span></td>
                    <td className="px-5 py-3.5 text-white/85 max-w-[180px]"><span className="block truncate">{lead.email || "—"}</span></td>
                    <td className="px-5 py-3.5 text-white/85 hidden md:table-cell">{lead.whatsapp || "—"}</td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(lead.tags ?? []).map((tag) => {
                          const t = TAG_LABELS[tag];
                          return (
                            <span key={tag} className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wide ${t?.color ?? "text-white/40 bg-white/5 border-white/10"}`}>
                              {t?.label ?? tag}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white/60 hidden sm:table-cell whitespace-nowrap">{formatDate(lead.data)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between text-text-muted font-body text-sm">
          <span>{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-8 h-8 rounded-md transition-colors disabled:opacity-25 hover:bg-white/5 text-text-muted hover:text-foreground flex items-center justify-center">‹</button>
            {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-md text-xs font-semibold transition-colors ${p === page ? "bg-wine/15 text-wine border border-wine/20" : "hover:bg-white/5 text-text-muted hover:text-foreground"}`}>{p}</button>
            ))}
            <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages} className="w-8 h-8 rounded-md transition-colors disabled:opacity-25 hover:bg-white/5 text-text-muted hover:text-foreground flex items-center justify-center">›</button>
          </div>
        </div>
      )}
    </div>
  );
};

// INSCRIÇÕES TAB
const InscricoesTab = () => {
  const [items, setItems] = useState<Inscricao[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid">("all");
  const [loading, setLoading] = useState(true);
  const [attendingIds, setAttendingIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(() => {
    setLoading(true);
    getInscricoes().then((data) => { setItems(data); setLoading(false); });
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const toggleAttended = async (item: Inscricao) => {
    if (!item.order_id) return;
    const newVal = !item.attended;
    // Optimistic update
    setItems((prev) => prev.map((i) => i.order_id === item.order_id ? { ...i, attended: newVal } : i));
    setAttendingIds((s) => { const ns = new Set(s); ns.add(item.order_id!); return ns; });
    try {
      await markAttended(item.order_id, newVal);
    } catch {
      // Revert
      setItems((prev) => prev.map((i) => i.order_id === item.order_id ? { ...i, attended: !newVal } : i));
    } finally {
      setAttendingIds((s) => { const ns = new Set(s); ns.delete(item.order_id!); return ns; });
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((i) => {
      const matchQ = i.name?.toLowerCase().includes(q) || i.email?.toLowerCase().includes(q);
      const matchF = filter === "all" ? true : filter === "paid" ? i.order_status === "approved" : i.order_status !== "approved";
      return matchQ && matchF;
    });
  }, [items, search, filter]);

  const paidCount = items.filter((i) => i.order_status === "approved").length;
  const unpaidCount = items.length - paidCount;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Inscrições — Segurança Jurídica 360</h2>
        <div className="flex gap-4 mt-2">
          <p className="text-text-muted font-body text-sm">{loading ? "Carregando…" : `${items.length} total`}</p>
          <p className="text-green-400 font-body text-sm">{paidCount} pagos</p>
          <p className="text-orange-400 font-body text-sm">{unpaidCount} não pagos</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome ou e-mail…" className="w-full bg-support border border-white/8 rounded-md pl-9 pr-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:border-wine/40 transition-colors" />
        </div>
        <div className="flex gap-2">
          {(["all", "paid", "unpaid"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-md font-body text-xs font-semibold transition-all ${filter === f ? "bg-wine/15 text-wine border border-wine/20" : "border border-white/8 text-text-muted hover:text-foreground"}`}>
              {f === "all" ? "Todos" : f === "paid" ? "Pagos" : "Não pagos"}
            </button>
          ))}
        </div>
        <button onClick={() => {
          if (!filtered.length) return;
          const headers = ["Nome", "E-mail", "WhatsApp", "Status", "Valor", "Data inscrição"];
          const rows = filtered.map((i) => [i.name, i.email, i.whatsapp, i.order_status ?? "pendente", i.amount ?? "", i.created_at].map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";"));
          const csv = [headers.join(";"), ...rows].join("\n");
          const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url; a.download = `inscricoes_${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
        }} disabled={filtered.length === 0} className="flex items-center gap-2 border border-white/8 hover:border-wine/30 text-text-muted hover:text-foreground px-4 py-2.5 rounded-md font-body text-sm transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none">
          <Download className="w-3.5 h-3.5" />CSV
        </button>
      </div>
      <div className="surface-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3"><Loader2 className="w-6 h-6 text-wine animate-spin" /><p className="text-text-muted font-body text-sm">Carregando…</p></div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-text-muted font-body text-sm gap-2"><CalendarDays className="w-8 h-8 opacity-30" strokeWidth={1} /><p>Nenhuma inscrição.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead><tr className="border-b border-white/5">
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold">Nome</th>
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold">E-mail</th>
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold hidden md:table-cell">WhatsApp</th>
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold">Status pgto</th>
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold hidden sm:table-cell">Data</th>
                <th className="text-center px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold">Presença</th>
              </tr></thead>
              <tbody>
                {filtered.map((item, i) => {
                  const paid = item.order_status === "approved";
                  return (
                    <tr key={i} className="border-b border-white/4 hover:bg-white/2 transition-colors last:border-0">
                      <td className="px-5 py-3.5 text-white max-w-[140px]"><span className="block truncate">{item.name}</span></td>
                      <td className="px-5 py-3.5 text-white/85 max-w-[180px]"><span className="block truncate">{item.email}</span></td>
                      <td className="px-5 py-3.5 text-white/85 hidden md:table-cell">{item.whatsapp}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wide ${paid ? "text-green-400 bg-green-500/10 border-green-500/25" : "text-orange-400 bg-orange-500/10 border-orange-500/25"}`}>
                          {paid ? "Pago" : item.order_status ?? "Pendente"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/60 hidden sm:table-cell whitespace-nowrap">{formatDate(item.created_at)}</td>
                      <td className="px-5 py-3.5 text-center">
                        {item.order_id ? (
                          <button
                            onClick={() => toggleAttended(item)}
                            disabled={attendingIds.has(item.order_id!)}
                            title={item.attended ? "Marcar como ausente" : "Confirmar presença"}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200 disabled:opacity-40 ${
                              item.attended
                                ? "bg-green-500/15 border-green-500/40 text-green-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
                                : "bg-white/[0.04] border-white/10 text-text-muted hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400"
                            }`}
                          >
                            {attendingIds.has(item.order_id!) ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </button>
                        ) : (
                          <span className="text-white/20 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// EBOOK TAB
const EbookTab = () => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => { getEbookUrl().then(setCurrentUrl); }, []);

  const handleFile = async (file: File) => {
    if (!file || file.type !== "application/pdf") { setError("Apenas arquivos PDF são aceitos."); return; }
    setUploading(true); setError(null); setSuccess(false);
    try {
      const url = await uploadEbookFile(file);
      setCurrentUrl(url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Gerenciar E-book</h2>
        <p className="text-text-muted font-body text-sm mt-1">Faça upload do PDF para o MinIO. O link é enviado automaticamente por e-mail após cada compra.</p>
      </div>

      {/* Current URL */}
      <div className="surface-card rounded-xl p-5 space-y-3">
        <p className="text-xs font-body text-text-muted uppercase tracking-[0.1em]">URL atual do e-book</p>
        {currentUrl ? (
          <div className="flex items-center gap-3">
            <p className="flex-1 text-xs text-gold/80 font-mono break-all bg-gold/5 border border-gold/15 rounded-md px-3 py-2">{currentUrl}</p>
            <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-text-muted hover:text-gold transition-colors" title="Abrir PDF"><ExternalLink className="w-4 h-4" /></a>
          </div>
        ) : (
          <p className="text-sm text-text-muted font-body italic">Nenhum e-book publicado ainda.</p>
        )}
      </div>

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => fileRef.current?.click()}
        className={`surface-card rounded-xl p-10 flex flex-col items-center justify-center gap-4 border-2 border-dashed cursor-pointer transition-all duration-200 ${dragOver ? "border-gold/50 bg-gold/5" : "border-white/10 hover:border-wine/30 hover:bg-white/2"}`}
      >
        <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        {uploading ? (
          <><Loader2 className="w-8 h-8 text-wine animate-spin" /><p className="font-body text-sm text-text-muted">Enviando para o MinIO…</p></>
        ) : success ? (
          <><CheckCircle2 className="w-8 h-8 text-green-400" /><p className="font-body text-sm text-green-300">Upload realizado com sucesso!</p></>
        ) : (
          <>
            <BookOpen className="w-8 h-8 text-text-muted" strokeWidth={1.5} />
            <div className="text-center">
              <p className="font-body text-sm text-foreground">Arraste o PDF aqui ou <span className="text-gold underline">clique para selecionar</span></p>
              <p className="font-body text-xs text-text-muted mt-1">Máximo: 50 MB · apenas PDF</p>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-300 font-body">{error}</p>
        </div>
      )}
    </div>
  );
};


// PEDIDOS TAB
const STATUS_LABELS: Record<Order["status"], { label: string; color: string }> = {
  approved: { label: "Aprovado", color: "text-green-400 bg-green-500/10 border-green-500/25" },
  pending: { label: "Pendente", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/25" },
  in_process: { label: "Em análise", color: "text-blue-400 bg-blue-500/10 border-blue-500/25" },
  rejected: { label: "Rejeitado", color: "text-red-400 bg-red-500/10 border-red-500/25" },
  refunded: { label: "Estornado", color: "text-orange-400 bg-orange-500/10 border-orange-500/25" },
};

const PedidosTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    getOrders().then((data) => { setOrders(data); setLoading(false); });
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const filtered = useMemo(() => {
    let list = orders;
    if (filter !== "all") list = list.filter((o) => o.status === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((o) => o.payer_email?.toLowerCase().includes(q) || o.payer_name?.toLowerCase().includes(q) || o.mp_payment_id?.includes(q));
    }
    return list;
  }, [orders, search, filter]);

  const totalApproved = orders.filter((o) => o.status === "approved").reduce((s, o) => s + Number(o.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Pedidos & Pagamentos</h2>
          <p className="text-text-muted font-body text-sm mt-1">
            {loading ? "Carregando…" : `${orders.length} pedido${orders.length !== 1 ? "s" : ""} · Aprovado: `}
            {!loading && <span className="text-gold font-semibold">{formatCurrency(totalApproved)}</span>}
          </p>
        </div>
        <button onClick={refresh} className="flex items-center gap-2 text-text-muted hover:text-foreground font-body text-sm transition-colors border border-white/8 hover:border-white/15 px-3 py-2 rounded-md shrink-0">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />Atualizar
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 sm:max-w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por e-mail, nome ou ID…" className="w-full bg-support border border-white/8 rounded-md pl-9 pr-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:border-gold/40 transition-colors" />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {(["all", "approved", "pending", "rejected"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-md font-body text-xs transition-colors ${filter === s ? "bg-gold/15 text-gold border border-gold/25" : "text-text-muted hover:text-foreground border border-white/8 hover:border-white/15"}`}>
              {s === "all" ? "Todos" : STATUS_LABELS[s as Order["status"]]?.label ?? s}
            </button>
          ))}
        </div>
      </div>
      <div className="surface-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-gold animate-spin" /><p className="text-text-muted font-body text-sm">Carregando pedidos…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-text-muted font-body text-sm gap-2">
            <Package className="w-8 h-8 opacity-30" strokeWidth={1} /><p>Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead><tr className="border-b border-white/5">
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold">Produto</th>
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold hidden md:table-cell">Comprador</th>
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold">Valor</th>
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold">Status</th>
                <th className="text-left px-5 py-3.5 text-xs uppercase tracking-[0.12em] text-text-muted font-semibold hidden sm:table-cell">Data</th>
              </tr></thead>
              <tbody>
                {filtered.map((order) => {
                  const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, color: "text-white/50" };
                  return (
                    <tr key={order.id} className="border-b border-white/4 hover:bg-white/2 transition-colors last:border-0">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${order.product === "event" ? "bg-gold/10 border border-gold/15" : "bg-wine/10 border border-wine/15"}`}>
                            {order.product === "event" ? <CalendarDays className="w-3.5 h-3.5 text-gold" /> : <BookOpen className="w-3.5 h-3.5 text-wine" />}
                          </div>
                          <span className="text-white text-xs">{order.product === "event" ? "Evento" : "E-book"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <p className="text-white/85 truncate max-w-[160px]">{order.payer_name || "—"}</p>
                        <p className="text-white/45 text-xs truncate max-w-[160px]">{order.payer_email || "—"}</p>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gold whitespace-nowrap">{formatCurrency(Number(order.amount))}</td>
                      <td className="px-5 py-3.5"><span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold ${statusInfo.color}`}>{statusInfo.label}</span></td>
                      <td className="px-5 py-3.5 text-white/60 hidden sm:table-cell whitespace-nowrap">{formatDate(order.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// CONTENT TAB
const ContentTab = () => {
  const [form, setForm] = useState<ContentData>(() => getContent());
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const update = (field: keyof ContentData, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    saveContent(form);
    setSaved(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm("Restaurar todos os textos para o padrão original?")) { resetContent(); setForm({ ...CONTENT_DEFAULTS }); }
  };

  const Field = ({ label, field, multiline, placeholder, type = "text", hint }: { label: string; field: keyof ContentData; multiline?: boolean; placeholder?: string; type?: string; hint?: string; }) => (
    <div className="space-y-1.5">
      <label className="block text-white font-body text-sm font-medium">{label}</label>
      {multiline ? (
        <textarea value={form[field]} onChange={(e) => update(field, e.target.value)} rows={3} className="w-full bg-background border border-white/8 focus:border-wine/40 rounded-md px-4 py-3 text-foreground font-body text-sm focus:outline-none transition-colors resize-none" placeholder={placeholder} />
      ) : (
        <input type={type} value={form[field]} onChange={(e) => update(field, e.target.value)} className="w-full bg-background border border-white/8 focus:border-wine/40 rounded-md px-4 py-2.5 text-foreground font-body text-sm focus:outline-none transition-colors" placeholder={placeholder} />
      )}
      {hint && <p className="text-text-muted font-body text-xs">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Edição de Conteúdo</h2>
          <p className="text-text-muted font-body text-sm mt-1">Alterações salvas no navegador e refletidas na landing page.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:shrink-0">
          <button onClick={handleReset} className="border border-white/8 hover:border-white/15 text-text-muted hover:text-foreground px-4 py-2 rounded-md font-body text-sm transition-all duration-200">Restaurar padrão</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2 rounded-md font-ui text-xs transition-all duration-200 ${saved ? "bg-green-600/20 border border-green-500/30 text-green-400" : "bg-wine hover:bg-wine-light text-background hover:-translate-y-0.5"}`}>
            {saved ? <Check className="w-3.5 h-3.5" /> : null}{saved ? "SALVO!" : "SALVAR"}
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
        <div className="space-y-8">
          <div className="surface-card rounded-xl p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/5"><Edit3 className="w-4 h-4 text-wine" strokeWidth={1.5} /><h3 className="font-display text-lg font-semibold text-foreground">Textos Principais</h3></div>
            <Field label="Badge do Hero" field="heroBadge" placeholder="Ex: Guia Prático para Empresários" />
            <Field label="Headline principal" field="heroHeadline" placeholder="Ex: Manual do Empregador" />
            <Field label="Subtítulo" field="heroSubheadline" multiline placeholder="Descrição breve do material…" />
            <Field label="Texto do corpo" field="heroBody" multiline placeholder="Texto explicativo mais longo…" />
            <Field label="Texto do botão CTA" field="heroCta" placeholder="Ex: QUERO ADQUIRIR O E-BOOK" />
          </div>
          <div className="surface-card rounded-xl p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/5"><LinkIcon className="w-4 h-4 text-wine" strokeWidth={1.5} /><h3 className="font-display text-lg font-semibold text-foreground">Links & Integração</h3></div>
            <Field label="URL de checkout fallback" field="checkoutUrl" type="url" placeholder="https://…" hint="Usado apenas se o Mercado Pago não responder." />
            <Field label="Link de download do eBook" field="ebookDownloadUrl" type="url" placeholder="https://…" />
            <Field label="Número WhatsApp (com DDI)" field="whatsappNumber" placeholder="5581986758036" hint="Apenas números, sem formatação." />
            <Field label="Mensagem padrão WhatsApp" field="whatsappMsg" placeholder="Olá! Tenho interesse no Manual do Empregador." />
          </div>
          <div className="surface-card rounded-xl p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/5"><DollarSign className="w-4 h-4 text-wine" strokeWidth={1.5} /><h3 className="font-display text-lg font-semibold text-foreground">Preços — E-book</h3></div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Preço atual (R$)" field="price" placeholder="47" />
              <Field label="Preço original / De (R$)" field="priceOriginal" placeholder="97" />
            </div>
          </div>
          <div className="surface-card rounded-xl p-4 sm:p-6 space-y-5" style={{ borderColor: "rgba(201,168,76,0.18)" }}>
            <div className="flex items-center gap-2 pb-4 border-b border-white/5"><CreditCard className="w-4 h-4 text-gold" strokeWidth={1.5} /><h3 className="font-display text-lg font-semibold text-foreground">Evento — Segurança Jurídica 360</h3></div>
            <Field label="Preço da inscrição (R$)" field="eventPrice" placeholder="67" />
            <Field label="URL de checkout do evento" field="eventCheckoutUrl" type="url" placeholder="https://…" hint="O carrinho redireciona aqui ao comprar a inscrição." />
          </div>
          <div className="surface-card rounded-xl p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/5"><ImageIcon className="w-4 h-4 text-wine" strokeWidth={1.5} /><h3 className="font-display text-lg font-semibold text-foreground">Imagens</h3></div>
            <Field label="URL da capa do eBook" field="ebookCoverUrl" type="url" placeholder="https://… (deixe vazio para usar a imagem padrão)" hint="URL pública de imagem (PNG, JPG, WebP)." />
            {form.ebookCoverUrl && (<img src={form.ebookCoverUrl} alt="Prévia da capa" className="h-32 w-auto rounded-md object-contain border border-white/8" onError={(e) => (e.currentTarget.style.display = "none")} />)}
          </div>
        </div>
        <div className="sm:sticky sm:top-24">
          <p className="text-text-muted font-body text-xs uppercase tracking-[0.15em] mb-3">Prévia em tempo real</p>
          <div className="rounded-xl overflow-hidden border border-white/8" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(62,21,23,0.7) 0%, transparent 70%), #000" }}>
            <div className="p-5 space-y-3">
              <span className="inline-flex items-center border border-wine/25 text-wine font-ui text-[9px] tracking-[0.15em] px-3 py-1 rounded-full">{form.heroBadge || CONTENT_DEFAULTS.heroBadge}</span>
              <h3 className="font-display text-xl font-semibold text-foreground leading-tight">Manual do{" "}<span className="text-wine italic">{form.heroHeadline?.replace("Manual do", "").trim() || "Empregador"}</span></h3>
              <p className="text-white/80 font-body text-xs leading-relaxed line-clamp-3">{form.heroSubheadline || CONTENT_DEFAULTS.heroSubheadline}</p>
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="bg-wine text-background font-ui text-[9px] px-3 py-2 rounded text-center tracking-widest">{form.heroCta || CONTENT_DEFAULTS.heroCta}</div>
                <div className="text-center">
                  <span className="text-wine font-display text-xl font-bold">R$ <span className="text-3xl">{form.price || "47"}</span></span>
                  {form.priceOriginal && (<span className="text-text-muted line-through font-body text-xs ml-2">R$ {form.priceOriginal}</span>)}
                </div>
              </div>
            </div>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="mt-3 w-full flex items-center justify-center gap-2 border border-white/8 hover:border-wine/30 text-text-muted hover:text-foreground font-body text-xs py-2.5 rounded-md transition-all duration-200">
            <Eye className="w-3.5 h-3.5" />Abrir landing page
          </a>
        </div>
      </div>
    </div>
  );
};

// EMAILS TAB
const TEMPLATE_META: Record<string, { group: string; icon: React.ElementType; color: string }> = {
  cart_immediate: { group: "Carrinho abandonado", icon: ShoppingCart, color: "text-amber-400" },
  cart_1h:        { group: "Carrinho abandonado", icon: ShoppingCart, color: "text-amber-400" },
  cart_1d:        { group: "Carrinho abandonado", icon: ShoppingCart, color: "text-amber-400" },
  event_1d:       { group: "Lembrete do evento",  icon: CalendarDays, color: "text-blue-400" },
  event_3h:       { group: "Lembrete do evento",  icon: CalendarDays, color: "text-blue-400" },
  event_1h:       { group: "Lembrete do evento",  icon: CalendarDays, color: "text-blue-400" },
};

const TEMPLATE_DELAY: Record<string, string> = {
  cart_immediate: "Imediato",
  cart_1h:        "1 hora depois",
  cart_1d:        "24 horas depois",
  event_1d:       "24h antes do evento",
  event_3h:       "3h antes do evento",
  event_1h:       "1h antes do evento",
};

const EmailsTab = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [queue, setQueue] = useState<EmailQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processMsg, setProcessMsg] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [testName, setTestName] = useState("");
  const [testSending, setTestSending] = useState(false);
  const [testMsg, setTestMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [tpls, q] = await Promise.all([getEmailTemplates(), getEmailQueue(30)]);
    setTemplates(tpls);
    setQueue(q);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (t: EmailTemplate) => { setEditing(t.id); setEditSubject(t.subject); setSaveOk(null); };
  const cancelEdit = () => setEditing(null);

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const updated = await updateEmailTemplate(id, { subject: editSubject });
      setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, ...updated } : t));
      setSaveOk(id);
      setEditing(null);
      setTimeout(() => setSaveOk(null), 3000);
    } catch { /* keep editing open */ }
    setSaving(false);
  };

  const toggleActive = async (t: EmailTemplate) => {
    try {
      const updated = await updateEmailTemplate(t.id, { active: !t.active });
      setTemplates((prev) => prev.map((x) => x.id === t.id ? { ...x, ...updated } : x));
    } catch { /* ignore */ }
  };

  const handleProcess = async () => {
    setProcessing(true); setProcessMsg("");
    try {
      await processEmailQueue();
      setProcessMsg("✅ Fila processada com sucesso!");
      await load();
    } catch (e) {
      setProcessMsg(`❌ ${e instanceof Error ? e.message : "Erro ao processar fila."}`);
    }
    setProcessing(false);
    setTimeout(() => setProcessMsg(""), 6000);
  };

  const handleTestSend = async () => {
    if (!testEmail) return;
    setTestSending(true); setTestMsg("");
    try {
      const result = await testSendCartEmails(testEmail, testName || "Teste");
      if (result.sent > 0) {
        setTestMsg(`✅ ${result.sent} e-mail(s) disparados para ${testEmail}!`);
      } else if (result.failed > 0) {
        setTestMsg(`⚠️ E-mails agendados mas ${result.failed} falha(s) ao enviar. Veja a fila para detalhes.`);
      } else {
        setTestMsg(`⚠️ Nenhum e-mail foi enviado. Verifique os logs do servidor.`);
      }
      await load();
    } catch (e) {
      setTestMsg(`❌ ${e instanceof Error ? e.message : "Erro"}`);
    }
    setTestSending(false);
    setTimeout(() => setTestMsg(""), 8000);
  };

  const statusColors: Record<string, string> = {
    pending:   "text-amber-400 border-amber-400/20 bg-amber-400/5",
    sent:      "text-green-400 border-green-500/20 bg-green-500/5",
    failed:    "text-red-400 border-red-500/20 bg-red-500/5",
    cancelled: "text-white/30 border-white/10 bg-white/3",
  };

  const groups = ["Carrinho abandonado", "Lembrete do evento"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">E-mails automáticos</h2>
          <p className="text-text-muted font-body text-sm mt-1">Configure os e-mails enviados automaticamente. Edite o assunto e ative/desative cada tipo.</p>
        </div>
        <button onClick={load} disabled={loading} className="flex items-center gap-1.5 border border-white/8 hover:border-white/20 text-text-muted hover:text-foreground px-3 py-2 rounded-md font-body text-xs transition-all disabled:opacity-50">
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />Atualizar
        </button>
      </div>

      {/* ── Ferramentas de teste ── */}
      <div className="surface-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-gold" />
          <h3 className="font-display text-base font-semibold text-foreground">Ferramentas</h3>
        </div>

        {/* Processar fila agora */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleProcess}
            disabled={processing}
            className="flex items-center gap-2 bg-wine/15 hover:bg-wine/25 border border-wine/25 text-wine px-4 py-2.5 rounded-md font-ui text-xs transition-all disabled:opacity-50"
          >
            {processing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <SendHorizonal className="w-3.5 h-3.5" />}
            Processar fila agora
          </button>
          {processMsg && <span className="font-body text-xs text-text-muted">{processMsg}</span>}
        </div>
        <p className="text-text-muted font-body text-[0.65rem]">Força o processamento imediato da fila (normalmente ocorre a cada 5 min).</p>

        <div className="border-t border-white/5 pt-4">
          <p className="font-body text-xs text-text-muted mb-3">Envio de teste — carrinho abandonado (ignora deduplicação):</p>
          <div className="flex gap-2 flex-wrap items-end">
            <div className="flex flex-col gap-1">
              <label className="text-[0.6rem] text-text-muted font-body uppercase tracking-[0.12em]">E-mail</label>
              <input
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="bg-background border border-white/10 focus:border-wine/40 rounded-md px-3 py-2 font-body text-sm text-foreground focus:outline-none w-56 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[0.6rem] text-text-muted font-body uppercase tracking-[0.12em]">Nome</label>
              <input
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Nome Sobrenome"
                className="bg-background border border-white/10 focus:border-wine/40 rounded-md px-3 py-2 font-body text-sm text-foreground focus:outline-none w-44 transition-colors"
              />
            </div>
            <button
              onClick={handleTestSend}
              disabled={testSending || !testEmail}
              className="flex items-center gap-1.5 border border-gold/20 bg-gold/[0.07] hover:bg-gold/[0.14] text-gold px-4 py-2 rounded-md font-body text-xs transition-all disabled:opacity-40"
            >
              {testSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <SendHorizonal className="w-3.5 h-3.5" />}
              Enviar teste
            </button>
          </div>
          {testMsg && <p className="mt-2 font-body text-xs text-text-muted">{testMsg}</p>}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-text-muted">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /><span className="font-body text-sm">Carregando…</span>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => {
            const groupTemplates = templates.filter((t) => TEMPLATE_META[t.id]?.group === group);
            if (!groupTemplates.length) return null;
            const GroupIcon = TEMPLATE_META[groupTemplates[0].id]?.icon ?? Mail;
            const groupColor = TEMPLATE_META[groupTemplates[0].id]?.color ?? "text-white/60";
            return (
              <div key={group}>
                <div className="flex items-center gap-2.5 mb-4">
                  <GroupIcon className={`w-4 h-4 ${groupColor}`} />
                  <h3 className="font-display text-base font-semibold text-foreground">{group}</h3>
                  {group === "Carrinho abandonado" && (
                    <span className="ml-auto text-[0.6rem] font-body text-amber-400/60 border border-amber-400/15 bg-amber-400/5 px-2 py-0.5 rounded-full">Sequência de 3 e-mails</span>
                  )}
                  {group === "Lembrete do evento" && (
                    <span className="ml-auto text-[0.6rem] font-body text-blue-400/60 border border-blue-400/15 bg-blue-400/5 px-2 py-0.5 rounded-full">29/04/2026 · 16h</span>
                  )}
                </div>
                <div className="space-y-3">
                  {groupTemplates.map((t) => {
                    const meta = TEMPLATE_META[t.id];
                    const isEditing = editing === t.id;
                    return (
                      <div key={t.id} className={`surface-card rounded-xl p-5 border transition-all duration-200 ${t.active ? "border-white/5" : "border-white/[0.03] opacity-60"}`}>
                        <div className="flex items-start gap-3">
                          <button onClick={() => toggleActive(t)} className="mt-0.5 shrink-0" title={t.active ? "Desativar" : "Ativar"}>
                            {t.active ? <ToggleRight className={`w-7 h-7 ${meta?.color ?? "text-white/60"}`} /> : <ToggleLeft className="w-7 h-7 text-white/20" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <p className="font-body text-sm font-semibold text-foreground">{t.name}</p>
                              {saveOk === t.id && <span className="text-[0.6rem] font-body text-green-400 border border-green-400/20 bg-green-400/5 px-2 py-0.5 rounded-full flex items-center gap-1"><Check className="w-2.5 h-2.5" />Salvo</span>}
                            </div>
                            <p className="font-body text-xs text-text-muted mb-3 leading-relaxed">{t.trigger_desc}</p>
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-body border border-white/8 bg-white/4 text-white/50 px-2.5 py-1 rounded-full">
                                <Clock className="w-2.5 h-2.5" />{TEMPLATE_DELAY[t.id] ?? "—"}
                              </span>
                              <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-body border border-white/8 bg-white/4 text-white/50 px-2.5 py-1 rounded-full">
                                <SendHorizonal className="w-2.5 h-2.5 text-green-400" />{t.sent_count} enviados
                              </span>
                              {t.pending_count > 0 && (
                                <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-body border border-amber-400/20 bg-amber-400/5 text-amber-400 px-2.5 py-1 rounded-full">
                                  <Clock className="w-2.5 h-2.5" />{t.pending_count} pendentes
                                </span>
                              )}
                              {t.failed_count > 0 && (
                                <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-body border border-red-400/20 bg-red-400/5 text-red-400 px-2.5 py-1 rounded-full">
                                  <XCircle className="w-2.5 h-2.5" />{t.failed_count} erros
                                </span>
                              )}
                            </div>
                            {isEditing ? (
                              <div className="space-y-2">
                                <label className="text-[0.6rem] font-body text-text-muted uppercase tracking-[0.15em]">Assunto do e-mail</label>
                                <input value={editSubject} onChange={(e) => setEditSubject(e.target.value)} className="w-full bg-background border border-white/10 focus:border-wine/40 rounded-md px-3 py-2.5 font-body text-sm text-foreground focus:outline-none transition-colors" placeholder="Assunto do e-mail…" />
                                <p className="text-[0.6rem] text-text-muted font-body">Use <code className="bg-white/5 px-1 rounded text-white/60">{"{{firstName}}"}</code> para o primeiro nome.</p>
                                <div className="flex gap-2 pt-1">
                                  <button onClick={() => saveEdit(t.id)} disabled={saving} className="flex items-center gap-1.5 bg-wine hover:bg-wine-light text-background px-4 py-2 rounded-md font-ui text-xs transition-all disabled:opacity-50">
                                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}Salvar
                                  </button>
                                  <button onClick={cancelEdit} className="border border-white/8 hover:border-white/15 text-text-muted hover:text-foreground px-4 py-2 rounded-md font-body text-xs transition-all">Cancelar</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 rounded-md bg-background border border-white/5 px-3 py-2 font-body text-xs text-white/70 truncate">
                                  <span className="text-text-muted text-[0.6rem] mr-1.5">Assunto:</span>{t.subject}
                                </div>
                                <button onClick={() => startEdit(t)} className="shrink-0 flex items-center gap-1 border border-white/8 hover:border-wine/30 text-text-muted hover:text-wine px-3 py-2 rounded-md font-body text-xs transition-all">
                                  <Pencil className="w-3 h-3" />Editar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ── Últimas entradas da fila ── */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Activity className="w-4 h-4 text-white/40" />
              <h3 className="font-display text-base font-semibold text-foreground">Últimos 30 registros da fila</h3>
            </div>
            {queue.length === 0 ? (
              <div className="text-center py-8 text-text-muted font-body text-sm border border-white/5 rounded-xl">Nenhum item na fila ainda.</div>
            ) : (
              <div className="rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full font-body text-xs">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="text-left px-4 py-3 text-text-muted font-body text-[0.6rem] uppercase tracking-[0.12em]">Status</th>
                        <th className="text-left px-4 py-3 text-text-muted font-body text-[0.6rem] uppercase tracking-[0.12em]">E-mail</th>
                        <th className="text-left px-4 py-3 text-text-muted font-body text-[0.6rem] uppercase tracking-[0.12em]">Template</th>
                        <th className="text-left px-4 py-3 text-text-muted font-body text-[0.6rem] uppercase tracking-[0.12em]">Agendado p/</th>
                        <th className="text-left px-4 py-3 text-text-muted font-body text-[0.6rem] uppercase tracking-[0.12em]">Enviado em</th>
                      </tr>
                    </thead>
                    <tbody>
                      {queue.map((item) => (
                        <tr key={item.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center text-[0.6rem] font-body border px-2 py-0.5 rounded-full ${statusColors[item.status]}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white/70 max-w-[160px] truncate">{item.email}</td>
                          <td className="px-4 py-3 text-white/50 max-w-[150px] truncate">{item.template_name}</td>
                          <td className="px-4 py-3 text-white/40 whitespace-nowrap">{formatDate(item.scheduled_at)}</td>
                          <td className="px-4 py-3 text-white/40 whitespace-nowrap">{item.sent_at ? formatDate(item.sent_at) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Info box */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 font-body text-xs text-text-muted space-y-2">
            <p className="text-white/50 text-[0.65rem] uppercase tracking-[0.15em] mb-2">Como funciona</p>
            <p>🛒 <strong className="text-white/60">Carrinho abandonado:</strong> agendado quando o lead preenche o formulário mas não finaliza o pagamento. Cancelado se ele converter.</p>
            <p>📅 <strong className="text-white/60">Lembretes do evento:</strong> agendados quando o pagamento é aprovado. Disparados antes de 29/04/2026 16h.</p>
            <p>⏱ O servidor processa a fila a cada 5 minutos. Use "Processar fila agora" para forçar.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// CONFIGURAÇÕES TAB
const ConfiguracoesTab = () => {
  const [backendStatus, setBackendStatus] = useState<"idle" | "checking" | "ok" | "error">("idle");
  const [mpStatus, setMpStatus] = useState<{ configured: boolean; public_key: string | null; products: { ebook: { price: number }; event: { price: number } } } | null>(null);
  const [simulating, setSimulating] = useState<"ebook" | "event" | null>(null);
  const [simResult, setSimResult] = useState<{ url: string; product: string } | null>(null);
  const [simError, setSimError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL ?? "";

  const checkBackend = async () => {
    setBackendStatus("checking");
    try {
      const res = await fetch(`${apiUrl}/api/health`);
      const json = await res.json() as { ok: boolean; db: string };
      setBackendStatus(json.ok && json.db === "up" ? "ok" : "error");
      const mp = await getMPStatus();
      setMpStatus(mp);
    } catch { setBackendStatus("error"); }
  };

  useEffect(() => { if (apiUrl) checkBackend(); }, [apiUrl]);

  const simulatePurchase = async (product: "ebook" | "event") => {
    setSimulating(product); setSimResult(null); setSimError("");
    try {
      const result = await createMPPreference(product);
      const url = result.sandbox_init_point ?? result.init_point;
      setSimResult({ url, product });
    } catch (err) {
      setSimError(err instanceof Error ? err.message : "Erro ao simular compra.");
    } finally { setSimulating(null); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Configurações</h2>
        <p className="text-text-muted font-body text-sm mt-1">Integrações, status do backend e simulação de compra.</p>
      </div>

      {/* Backend */}
      <div className="surface-card rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><Activity className="w-4 h-4 text-blue-400" strokeWidth={1.5} /></div>
          <div className="flex-1"><h3 className="font-display text-lg font-semibold text-foreground">Backend & Banco de Dados</h3><p className="text-text-muted font-body text-xs">{apiUrl || "VITE_API_URL não definida"}</p></div>
          <div>
            {backendStatus === "ok" ? (<span className="inline-flex items-center gap-1.5 text-xs font-body text-green-400 border border-green-500/25 bg-green-500/8 px-3 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Online</span>)
              : backendStatus === "error" ? (<span className="inline-flex items-center gap-1.5 text-xs font-body text-red-400 border border-red-500/25 bg-red-500/8 px-3 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />Não encontrado</span>)
              : (<span className="inline-flex items-center gap-1.5 text-xs font-body text-text-muted border border-white/15 bg-white/5 px-3 py-1 rounded-full">Verificando…</span>)}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-background border border-white/5 px-4 py-3 font-body text-xs space-y-1">
            <p className="text-text-muted mb-1.5 text-[0.65rem] uppercase tracking-[0.15em]">Frontend (.env)</p>
            <p className="font-mono text-white/70">VITE_API_URL=http://localhost:5000</p>
            <p className="font-mono text-white/70">VITE_ADMIN_TOKEN=senha_admin</p>
            <p className="font-mono text-white/70">VITE_MP_SANDBOX=false</p>
          </div>
          <div className="rounded-lg bg-background border border-white/5 px-4 py-3 font-body text-xs space-y-1">
            <p className="text-text-muted mb-1.5 text-[0.65rem] uppercase tracking-[0.15em]">Servidor (server/.env)</p>
            <p className="font-mono text-white/70">DATABASE_URL=postgresql://…</p>
            <p className="font-mono text-white/70">ADMIN_TOKEN=senha_admin</p>
            <p className="font-mono text-white/70">MP_ACCESS_TOKEN=APP_USR-…</p>
          </div>
        </div>
        {backendStatus === "error" && (
          <div className="rounded-lg border border-red-500/15 bg-red-500/5 px-4 py-3 font-body text-xs">
            <p className="text-red-300 font-semibold mb-1.5">Servidor não acessível</p>
            <p className="text-white/50 mb-2">O Express precisa estar rodando na porta 5000. Execute no terminal:</p>
            <p className="font-mono bg-black/30 rounded px-3 py-2 text-green-300 select-all">cd server &amp;&amp; npm run dev</p>
            <p className="text-white/40 mt-2">Depois clique em &quot;Verificar conexão&quot; abaixo.</p>
          </div>
        )}
        <button onClick={checkBackend} disabled={backendStatus === "checking"} className="flex items-center gap-2 border border-white/8 hover:border-blue-400/30 text-text-muted hover:text-blue-400 px-4 py-2 rounded-md font-body text-sm transition-all duration-200 disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${backendStatus === "checking" ? "animate-spin" : ""}`} />Verificar conexão
        </button>
      </div>

      {/* Mercado Pago */}
      <div className="surface-card rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-md bg-gold/10 border border-gold/20 flex items-center justify-center"><CreditCard className="w-4 h-4 text-gold" strokeWidth={1.5} /></div>
          <div className="flex-1"><h3 className="font-display text-lg font-semibold text-foreground">Mercado Pago</h3><p className="text-text-muted font-body text-xs">Checkout transparente — Pix, cartão e boleto</p></div>
          {mpStatus !== null && (
            <span className={`inline-flex items-center gap-1.5 text-xs font-body border px-3 py-1 rounded-full ${mpStatus.configured ? "text-green-400 border-green-500/25 bg-green-500/8" : "text-yellow-400 border-yellow-500/25 bg-yellow-500/8"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${mpStatus.configured ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} />{mpStatus.configured ? "Conectado" : "Sem token"}
            </span>
          )}
        </div>
        {mpStatus && (
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-white/5 bg-background p-4">
              <p className="text-text-muted text-xs font-body mb-2">Public Key</p>
              <p className="font-mono text-xs text-white/70 truncate">{mpStatus.public_key ?? "—"}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-background p-4">
              <p className="text-text-muted text-xs font-body mb-2">Produtos configurados</p>
              <p className="text-white/70 text-xs">E-book: <span className="text-gold">R$ {mpStatus.products.ebook.price}</span></p>
              <p className="text-white/70 text-xs">Evento: <span className="text-gold">R$ {mpStatus.products.event.price}</span></p>
            </div>
          </div>
        )}
        <div className="rounded-xl border border-gold/15 bg-gold/[0.04] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-gold" />
            <h4 className="font-display text-base font-semibold text-foreground">Simulação de Compra</h4>
            <span className="ml-auto text-[0.6rem] font-body text-gold/60 border border-gold/20 bg-gold/5 px-2 py-0.5 rounded-full tracking-wide">SANDBOX</span>
          </div>
          <p className="text-text-muted font-body text-xs mb-5 leading-relaxed">Cria uma preferência real no MP e abre o <strong className="text-white/70">sandbox</strong> para testar sem cobrança real.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {(["ebook", "event"] as const).map((product) => (
              <button key={product} onClick={() => simulatePurchase(product)} disabled={!!simulating || !mpStatus?.configured} className="flex items-center justify-between gap-3 border border-gold/20 bg-gold/[0.07] hover:bg-gold/[0.14] px-4 py-3 rounded-xl text-sm font-body text-gold transition-all disabled:opacity-40 disabled:pointer-events-none">
                <div className="flex items-center gap-2.5">
                  {simulating === product ? <Loader2 className="w-4 h-4 animate-spin" /> : (product === "ebook" ? <BookOpen className="w-4 h-4" /> : <CalendarDays className="w-4 h-4" />)}
                  <span>Simular {product === "ebook" ? "e-book" : "evento"}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            ))}
          </div>
          <AnimatePresence>
            {simResult && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-xl border border-green-500/25 bg-green-500/5 p-4">
                <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-green-400" /><p className="text-green-400 text-sm font-body font-semibold">Preferência criada — {simResult.product}</p></div>
                <a href={simResult.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 text-xs px-4 py-2 rounded-lg font-body transition-all">
                  Abrir checkout sandbox<ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>
            )}
            {simError && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 flex items-start gap-2 text-red-400 text-xs font-body">
                <XCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>{simError}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="rounded-lg bg-support border border-white/5 px-4 py-3 font-body text-xs text-text-muted">
          <p className="mb-2 text-white/50 text-[0.65rem] uppercase tracking-[0.15em]">Executar migrações</p>
          <p className="font-mono text-white/60">cd server && npm run migrate</p>
          <p className="mt-1 text-white/40">Arquivos: <code className="bg-white/5 px-1 rounded">001_init.sql</code> e <code className="bg-white/5 px-1 rounded">002_orders.sql</code></p>
        </div>
      </div>
    </div>
  );
};

// PRODUTOS TAB
type ProductForm = { id: string; title: string; description: string; price: string; mp_item_id: string; active: boolean; checkout_type: string };
const EMPTY_FORM: ProductForm = { id: "", title: "", description: "", price: "", mp_item_id: "", active: true, checkout_type: "ebook" };

interface ProductFormPanelProps {
  creating: boolean;
  editId: string | null;
  form: ProductForm;
  saving: boolean;
  formError: string;
  onCancel: () => void;
  onSave: () => void;
  onChange: (k: keyof ProductForm, v: string | boolean) => void;
}

const ProductFormPanel = ({ creating, editId, form, saving, formError, onCancel, onSave, onChange }: ProductFormPanelProps) => (
  <div className="surface-card rounded-xl p-5 border-wine/20 space-y-4">
    <div className="flex items-center gap-2 pb-3 border-b border-white/5">
      <div className="w-7 h-7 rounded-md bg-wine/15 border border-wine/20 flex items-center justify-center">
        {creating ? <Plus className="w-3.5 h-3.5 text-wine" /> : <Pencil className="w-3.5 h-3.5 text-wine" />}
      </div>
      <h4 className="font-display text-base font-semibold text-foreground">
        {creating ? "Novo Produto" : `Editando: ${editId}`}
      </h4>
      <button onClick={onCancel} className="ml-auto text-text-muted hover:text-foreground transition-colors p-1 rounded" aria-label="Cancelar">
        <X className="w-4 h-4" />
      </button>
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      {creating && (
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-white/80 font-body text-xs font-medium uppercase tracking-[0.1em]">ID do Produto <span className="text-text-muted normal-case">(único, ex: "ebook2")</span></label>
          <input
            value={form.id}
            onChange={(e) => onChange("id", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
            placeholder="ex: curso-online"
            className="w-full bg-background border border-white/8 focus:border-wine/40 rounded-md px-3 py-2.5 text-foreground font-mono text-sm focus:outline-none transition-colors"
          />
        </div>
      )}
      <div className="space-y-1.5 sm:col-span-2">
        <label className="block text-white/80 font-body text-xs font-medium uppercase tracking-[0.1em]">Título</label>
        <input value={form.title} onChange={(e) => onChange("title", e.target.value)} placeholder="Nome do produto" className="w-full bg-background border border-white/8 focus:border-wine/40 rounded-md px-3 py-2.5 text-foreground font-body text-sm focus:outline-none transition-colors" />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <label className="block text-white/80 font-body text-xs font-medium uppercase tracking-[0.1em]">Descrição <span className="text-text-muted normal-case">(opcional)</span></label>
        <textarea value={form.description} onChange={(e) => onChange("description", e.target.value)} rows={2} placeholder="Descrição breve…" className="w-full bg-background border border-white/8 focus:border-wine/40 rounded-md px-3 py-2.5 text-foreground font-body text-sm focus:outline-none transition-colors resize-none" />
      </div>
      <div className="space-y-1.5">
        <label className="block text-white/80 font-body text-xs font-medium uppercase tracking-[0.1em]">Preço (R$)</label>
        <input type="number" min="0.01" step="0.01" value={form.price} onChange={(e) => onChange("price", e.target.value)} placeholder="47.00" className="w-full bg-background border border-white/8 focus:border-wine/40 rounded-md px-3 py-2.5 text-foreground font-body text-sm focus:outline-none transition-colors" />
      </div>
      <div className="space-y-1.5">
        <label className="block text-white/80 font-body text-xs font-medium uppercase tracking-[0.1em] flex items-center gap-1.5">
          <Link2 className="w-3 h-3" />ID MP <span className="text-text-muted normal-case">(item_id no MP)</span>
        </label>
        <input value={form.mp_item_id} onChange={(e) => onChange("mp_item_id", e.target.value)} placeholder="ex: manual-do-empregador" className="w-full bg-background border border-white/8 focus:border-wine/40 rounded-md px-3 py-2.5 text-foreground font-mono text-sm focus:outline-none transition-colors" />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <label className="block text-white/80 font-body text-xs font-medium uppercase tracking-[0.1em]">Tipo de Checkout</label>
        <select
          value={form.checkout_type}
          onChange={(e) => onChange("checkout_type", e.target.value)}
          className="w-full bg-background border border-white/8 focus:border-wine/40 rounded-md px-3 py-2.5 text-foreground font-body text-sm focus:outline-none transition-colors"
        >
          <option value="ebook">📘 E-book — envia link de download por e-mail</option>
          <option value="event">🎫 Evento — envia ingresso digital por e-mail + inscreve no evento</option>
          <option value="event_ebook">🎫📘 Evento + E-book — ingresso digital + link de download + inscreve no evento</option>
        </select>
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="button"
          onClick={() => onChange("active", !form.active)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.active ? "bg-green-500" : "bg-white/15"}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.active ? "translate-x-6" : "translate-x-1"}`} />
        </button>
        <span className="font-body text-sm text-text-muted">{form.active ? "Ativo (visível para venda)" : "Inativo (oculto)"}</span>
      </div>
    </div>
    {formError && (
      <div className="flex items-center gap-2 text-red-400 font-body text-xs">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />{formError}
      </div>
    )}
    <div className="flex items-center justify-end gap-2 pt-1">
      <button onClick={onCancel} className="border border-white/8 hover:border-white/15 text-text-muted hover:text-foreground px-4 py-2 rounded-md font-body text-sm transition-all">Cancelar</button>
      <button onClick={onSave} disabled={saving} className="flex items-center gap-2 bg-wine hover:bg-wine-light text-background px-5 py-2 rounded-md font-ui text-xs transition-all disabled:opacity-50">
        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        {saving ? "SALVANDO…" : "SALVAR"}
      </button>
    </div>
  </div>
);

const ProdutosTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const refresh = useCallback(() => {
    setLoading(true);
    setApiError(false);
    getProducts()
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => { setApiError(true); setLoading(false); });
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const startEdit = (p: Product) => {
    setCreating(false);
    setEditId(p.id);
    setForm({ id: p.id, title: p.title, description: p.description || "", price: String(p.price), mp_item_id: p.mp_item_id || "", active: p.active, checkout_type: p.checkout_type || "ebook" });
    setFormError("");
  };

  const startCreate = () => {
    setEditId(null);
    setCreating(true);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const cancel = () => { setEditId(null); setCreating(false); setFormError(""); };

  const handleChange = useCallback((k: keyof ProductForm, v: string | boolean) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  }, []);

  const handleSave = async () => {
    const price = parseFloat(form.price);
    if (!form.title.trim()) { setFormError("Título obrigatório."); return; }
    if (isNaN(price) || price <= 0) { setFormError("Preço deve ser positivo."); return; }
    if (!form.mp_item_id.trim()) { setFormError("ID MP obrigatório."); return; }
    if (creating && !form.id.trim()) { setFormError("ID do produto obrigatório."); return; }

    setSaving(true);
    setFormError("");
    try {
      if (creating) {
        await createProduct({ id: form.id.trim(), title: form.title.trim(), description: form.description.trim(), price, mp_item_id: form.mp_item_id.trim(), active: form.active, checkout_type: form.checkout_type as "ebook" | "event" | "event_ebook" });
      } else if (editId) {
        await updateProduct(editId, { title: form.title.trim(), description: form.description.trim(), price, mp_item_id: form.mp_item_id.trim(), active: form.active, checkout_type: form.checkout_type as "ebook" | "event" | "event_ebook" });
      }
      cancel();
      refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      await deleteProduct(id);
      setDeleteConfirm(null);
      refresh();
    } catch (err) {
      console.error("[ProdutosTab] delete error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (p: Product) => {
    try {
      await updateProduct(p.id, { active: !p.active });
      setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, active: !p.active } : x));
    } catch (err) {
      console.error("[ProdutosTab] toggle error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Produtos</h2>
          <p className="text-text-muted font-body text-sm mt-1">
            {loading ? "Carregando…" : `${products.length} produto${products.length !== 1 ? "s" : ""} cadastrado${products.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} className="flex items-center gap-2 text-text-muted hover:text-foreground font-body text-sm transition-colors border border-white/8 hover:border-white/15 px-3 py-2 rounded-md shrink-0">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => { if (!creating && !editId) startCreate(); }} disabled={creating || !!editId} className="flex items-center gap-2 bg-wine hover:bg-wine-light text-background px-4 py-2 rounded-md font-ui text-xs transition-all disabled:opacity-40">
            <Plus className="w-3.5 h-3.5" />NOVO PRODUTO
          </button>
        </div>
      </div>

      {creating && <ProductFormPanel creating={creating} editId={editId} form={form} saving={saving} formError={formError} onCancel={cancel} onSave={handleSave} onChange={handleChange} />}

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-wine animate-spin" />
          <p className="text-text-muted font-body text-sm">Carregando produtos…</p>
        </div>
      ) : apiError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 font-body text-xs">
          <p className="text-red-300 font-semibold mb-1.5">Backend não acessível</p>
          <p className="text-white/50 mb-3">O servidor Express precisa estar rodando com banco de dados conectado.</p>
          <div className="space-y-1.5 font-mono text-green-300 bg-black/30 rounded px-3 py-2.5 select-all">
            <p>cd server && npm run migrate</p>
            <p>cd server && npm run dev</p>
          </div>
          <button onClick={refresh} className="mt-3 flex items-center gap-2 border border-white/8 hover:border-white/15 text-text-muted hover:text-foreground px-3 py-1.5 rounded font-body text-xs transition-colors">
            <RefreshCw className="w-3 h-3" />Tentar novamente
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-text-muted font-body text-sm gap-3">
          <Package className="w-10 h-10 opacity-20" strokeWidth={1} />
          <p>Nenhum produto cadastrado.</p>
          {!creating && (
            <button onClick={startCreate} className="mt-1 flex items-center gap-2 border border-white/8 hover:border-wine/30 text-text-muted hover:text-wine px-4 py-2 rounded-md font-body text-sm transition-all">
              <Plus className="w-3.5 h-3.5" />Criar primeiro produto
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.id}>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`surface-card rounded-xl overflow-hidden ${!p.active ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-base font-semibold text-foreground">{p.title}</span>
                      <span className={`text-[0.6rem] font-ui tracking-widest px-2 py-0.5 rounded-full border ${p.active ? "text-green-400 border-green-500/25 bg-green-500/8" : "text-text-muted border-white/10 bg-white/4"}`}>
                        {p.active ? "ATIVO" : "INATIVO"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="font-mono text-xs text-text-muted">id: {p.id}</span>
                      <span className="text-text-muted text-xs">·</span>
                      <span className="font-display text-gold font-semibold text-sm">R$ {Number(p.price).toFixed(2)}</span>
                      {p.mp_item_id && (
                        <>
                          <span className="text-text-muted text-xs">·</span>
                          <span className="flex items-center gap-1 font-mono text-xs text-text-muted"><Link2 className="w-2.5 h-2.5" />{p.mp_item_id}</span>
                        </>
                      )}
                      {p.checkout_type && (
                        <>
                          <span className="text-text-muted text-xs">·</span>
                          <span className="text-[0.6rem] font-ui tracking-widest px-2 py-0.5 rounded-full border border-white/10 bg-white/4 text-text-muted">
                            {p.checkout_type === "event_ebook" ? "evento+ebook" : p.checkout_type}
                          </span>
                        </>
                      )}
                    </div>
                    {p.description && <p className="text-text-muted font-body text-xs mt-1 line-clamp-1">{p.description}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleActive(p)}
                      title={p.active ? "Desativar" : "Ativar"}
                      className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors border ${p.active ? "border-green-500/25 bg-green-500/8 hover:bg-green-500/15 text-green-400" : "border-white/8 bg-white/4 hover:bg-white/8 text-text-muted"}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${p.active ? "bg-green-400" : "bg-white/30"}`} />
                    </button>
                    <button
                      onClick={() => editId === p.id ? cancel() : startEdit(p)}
                      title="Editar"
                      className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors border ${editId === p.id ? "border-wine/30 bg-wine/15 text-wine" : "border-white/8 hover:border-wine/20 text-text-muted hover:text-wine hover:bg-wine/8"}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(deleteConfirm === p.id ? null : p.id)}
                      title="Remover"
                      className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors border ${deleteConfirm === p.id ? "border-red-500/30 bg-red-500/15 text-red-400" : "border-white/8 hover:border-red-500/20 text-text-muted hover:text-red-400 hover:bg-red-500/8"}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {deleteConfirm === p.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-red-500/15 bg-red-500/5 px-5 py-3 flex items-center gap-3">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <p className="flex-1 text-red-300 font-body text-xs">Remover <strong>"{p.title}"</strong> permanentemente?</p>
                      <button onClick={() => setDeleteConfirm(null)} className="text-text-muted hover:text-foreground font-body text-xs px-3 py-1.5 rounded border border-white/8 transition-colors">Cancelar</button>
                      <button onClick={() => handleDelete(p.id)} disabled={saving} className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 font-body text-xs px-3 py-1.5 rounded transition-colors disabled:opacity-50">
                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}Remover
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <AnimatePresence>
                {editId === p.id && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="mt-2">
                    <ProductFormPanel creating={creating} editId={editId} form={form} saving={saving} formError={formError} onCancel={cancel} onSave={handleSave} onChange={handleChange} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-white/6 bg-white/2 px-5 py-4 font-body text-xs text-text-muted">
        <p className="text-white/50 text-[0.65rem] uppercase tracking-[0.15em] mb-2">ID MP (mp_item_id)</p>
        <p>O campo <strong className="text-white/60">ID MP</strong> é enviado ao Mercado Pago como identificador do item na preferência de pagamento. Use o mesmo ID de um produto existente no seu painel MP para vincular, ou crie um novo identificador.</p>
      </div>
    </div>
  );
};

// CTAS TAB
const CtasTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<CTAConfig>({ ctaAcessoProductId: "ebook", ctaVagaProductId: "event" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"acesso" | "vaga" | null>(null);
  const [savedMsg, setSavedMsg] = useState<"acesso" | "vaga" | null>(null);

  useEffect(() => {
    Promise.all([getProducts(), getCTAConfig()]).then(([prods, cfg]) => {
      setProducts(prods.filter((p) => p.active));
      setConfig(cfg);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const save = async (field: "acesso" | "vaga", productId: string) => {
    setSaving(field);
    try {
      const patch = field === "acesso" ? { ctaAcessoProductId: productId } : { ctaVagaProductId: productId };
      await saveCTAConfig(patch);
      setConfig((prev) => ({ ...prev, ...patch }));
      setSavedMsg(field);
      setTimeout(() => setSavedMsg(null), 3000);
    } catch { /* ignore */ }
    setSaving(null);
  };

  const ctas = [
    {
      key: "acesso" as const,
      label: "Garantir meu acesso",
      description: "Botão de compra do e-book. Aparece no Hero, na seção de conteúdo e na página de preços.",
      productId: config.ctaAcessoProductId,
      icon: BookOpen,
      color: "text-wine",
      badge: "EBOOK",
    },
    {
      key: "vaga" as const,
      label: "Garantir minha vaga",
      description: "Botão de inscrição no evento. Aparece na seção do evento, na página de preços e no header fixo.",
      productId: config.ctaVagaProductId,
      icon: CalendarDays,
      color: "text-gold",
      badge: "EVENTO",
    },
  ];

  const product = (id: string) => products.find((p) => p.id === id);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">CTAs do Site</h2>
        <p className="text-text-muted font-body text-sm mt-1">
          Associe cada botão de compra a um produto cadastrado. A mudança reflete imediatamente no carrinho.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-text-muted">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /><span className="font-body text-sm">Carregando…</span>
        </div>
      ) : (
        <div className="space-y-4">
          {ctas.map(({ key, label, description, productId, icon: Icon, color, badge }) => {
            const linked = product(productId);
            return (
              <div key={key} className="surface-card rounded-xl p-5 border border-white/5">
                <div className="flex items-start gap-4">
                  {/* CTA preview */}
                  <div className="shrink-0 mt-0.5">
                    <div className={`w-10 h-10 rounded-lg border border-white/8 bg-white/[0.03] flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-display text-sm font-semibold text-foreground">{label}</p>
                      <span className={`text-[0.55rem] font-ui tracking-[0.18em] px-2 py-0.5 rounded-full border ${key === "acesso" ? "text-wine/80 border-wine/20 bg-wine/8" : "text-gold/80 border-gold/20 bg-gold/8"}`}>{badge}</span>
                      {savedMsg === key && (
                        <span className="text-[0.6rem] font-body text-green-400 border border-green-400/20 bg-green-400/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />Salvo
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-text-muted mb-4 leading-relaxed">{description}</p>

                    {/* Current product */}
                    {linked ? (
                      <div className="mb-3 rounded-lg border border-white/6 bg-white/[0.02] px-4 py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-body text-xs text-foreground font-semibold">{linked.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="font-mono text-[0.6rem] text-text-muted">id: {linked.id}</span>
                            <span className="text-text-muted text-[0.6rem]">·</span>
                            <span className="font-display text-xs text-gold font-semibold">R$ {Number(linked.price).toFixed(2)}</span>
                            <span className="text-text-muted text-[0.6rem]">·</span>
                            <span className="text-[0.6rem] font-ui tracking-wide text-text-muted border border-white/8 bg-white/4 px-1.5 py-0.5 rounded">{linked.checkout_type}</span>
                          </div>
                        </div>
                        <span className="shrink-0 text-[0.6rem] font-body text-green-400 border border-green-400/20 bg-green-400/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />vinculado
                        </span>
                      </div>
                    ) : (
                      <div className="mb-3 rounded-lg border border-amber-400/15 bg-amber-400/5 px-4 py-3">
                        <p className="font-body text-xs text-amber-400">Produto <code className="font-mono bg-amber-400/10 px-1 rounded">{productId}</code> não encontrado nos produtos ativos.</p>
                      </div>
                    )}

                    {/* Product selector */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="text-[0.6rem] font-body text-text-muted uppercase tracking-[0.12em] shrink-0">Vincular a:</label>
                      <select
                        value={productId}
                        onChange={(e) => save(key, e.target.value)}
                        disabled={saving === key}
                        className="bg-background border border-white/10 focus:border-wine/40 rounded-md px-3 py-2 font-body text-xs text-foreground focus:outline-none transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} (id: {p.id}) — R$ {Number(p.price).toFixed(2)}
                          </option>
                        ))}
                        {products.length === 0 && <option value={productId}>{productId}</option>}
                      </select>
                      {saving === key && <Loader2 className="w-3.5 h-3.5 animate-spin text-wine" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 font-body text-xs text-text-muted space-y-2">
        <p className="text-white/50 text-[0.65rem] uppercase tracking-[0.15em] mb-2">Como funciona</p>
        <p>Quando o usuário clica em um CTA de compra, o produto selecionado aqui é adicionado ao carrinho. O tipo de checkout (<code className="bg-white/5 px-1 rounded text-white/50">ebook</code>, <code className="bg-white/5 px-1 rounded text-white/50">event</code> ou <code className="bg-white/5 px-1 rounded text-white/50">event_ebook</code>) é determinado pelo produto escolhido.</p>
        <p>Para criar ou editar produtos, acesse <strong className="text-white/60">Vendas → Produtos</strong>.</p>
      </div>
    </div>
  );
};

// NAV — grouped structure
type NavItem = { id: Tab; label: string; icon: React.ElementType };
type NavGroup = { kind: "single"; id: Tab; label: string; icon: React.ElementType }
              | { kind: "group"; id: string; label: string; icon: React.ElementType; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  { kind: "single", id: "metricas", label: "Métricas", icon: BarChart2 },
  { kind: "group", id: "pessoas", label: "Pessoas", icon: Users, items: [
    { id: "leads", label: "Leads", icon: Users },
    { id: "inscricoes", label: "Inscrições", icon: CalendarDays },
  ]},
  { kind: "group", id: "vendas", label: "Vendas", icon: ShoppingCart, items: [
    { id: "pedidos", label: "Pedidos", icon: ShoppingCart },
    { id: "produtos", label: "Produtos", icon: Package },
    { id: "ctas", label: "CTAs do Site", icon: MousePointer2 },
  ]},
  { kind: "group", id: "conteudo_grp", label: "Conteúdo", icon: Edit3, items: [
    { id: "ebook", label: "E-book", icon: BookOpen },
    { id: "conteudo", label: "Textos", icon: Edit3 },
  ]},
  { kind: "single", id: "emails", label: "E-mails", icon: Mail },
  { kind: "single", id: "configuracoes", label: "Configurações", icon: Settings },
];

// DASHBOARD
const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [tab, setTab] = useState<Tab>("metricas");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const handleLogout = () => { clearAuth(); onLogout(); };

  const selectTab = (id: Tab) => { setTab(id); setOpenGroup(null); setMobileOpen(false); };

  const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
  useEffect(() => {
    if (!apiUrl) { setServerOnline(false); return; }
    fetch(`${apiUrl}/api/health`)
      .then((r) => r.json())
      .then((j) => setServerOnline(j.ok === true))
      .catch(() => setServerOnline(false));
  }, [apiUrl]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!openGroup) return;
    const close = () => setOpenGroup(null);
    document.addEventListener("click", close, { capture: true });
    return () => document.removeEventListener("click", close, { capture: true });
  }, [openGroup]);

  const isGroupActive = (g: NavGroup) =>
    g.kind === "group" && g.items.some((i) => i.id === tab);

  const showOfflineBanner = serverOnline === false && !bannerDismissed;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-1 text-text-muted hover:text-foreground" aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-wine/15 border border-wine/25 rounded-md flex items-center justify-center"><span className="font-display font-bold text-wine text-xs">FL</span></div>
            <span className="font-display text-foreground font-semibold text-base hidden sm:block">Admin</span>
            <span className="text-white/25 hidden sm:block">·</span>
            <span className="font-body text-white/60 text-sm hidden sm:block">Manual do Empregador</span>
          </div>
        </div>
        {/* Desktop nav with grouped dropdowns */}
        <nav className="hidden md:flex items-center gap-0.5" aria-label="Navegação admin">
          {NAV_GROUPS.map((g) => {
            if (g.kind === "single") {
              return (
                <button key={g.id} onClick={() => selectTab(g.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-body text-[0.78rem] transition-all duration-200 ${tab === g.id ? "bg-wine/10 text-wine border border-wine/15" : "text-text-muted hover:text-foreground hover:bg-white/4"}`}>
                  <g.icon className="w-3.5 h-3.5" strokeWidth={1.5} />{g.label}
                </button>
              );
            }
            const active = isGroupActive(g);
            return (
              <div key={g.id} className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenGroup(openGroup === g.id ? null : g.id); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-body text-[0.78rem] transition-all duration-200 ${active ? "bg-wine/10 text-wine border border-wine/15" : "text-text-muted hover:text-foreground hover:bg-white/4"}`}
                >
                  <g.icon className="w-3.5 h-3.5" strokeWidth={1.5} />{g.label}
                  <ChevronDown className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${openGroup === g.id ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openGroup === g.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full left-0 mt-1 min-w-[160px] bg-support border border-white/10 rounded-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] py-1 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {g.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => selectTab(item.id)}
                          className={`flex items-center gap-2 w-full px-3 py-2 font-body text-xs transition-colors ${tab === item.id ? "text-wine bg-wine/8" : "text-text-muted hover:text-foreground hover:bg-white/4"}`}
                        >
                          <item.icon className="w-3.5 h-3.5" strokeWidth={1.5} />{item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-2 text-text-muted hover:text-foreground font-body text-sm transition-colors border border-white/8 hover:border-white/15 px-3 py-2 rounded-md" aria-label="Sair">
          <LogOut className="w-3.5 h-3.5" /><span className="hidden sm:inline">Sair</span>
        </button>
      </header>

      {/* Mobile nav — accordion groups */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="fixed top-[56px] left-0 right-0 z-40 bg-support border-b border-white/5 px-3 py-2 md:hidden max-h-[80vh] overflow-y-auto">
            {NAV_GROUPS.map((g) => {
              if (g.kind === "single") {
                return (
                  <button key={g.id} onClick={() => selectTab(g.id)} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md font-body text-sm transition-colors ${tab === g.id ? "bg-wine/10 text-wine" : "text-text-muted hover:text-foreground"}`}>
                    <g.icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />{g.label}
                  </button>
                );
              }
              const gActive = isGroupActive(g);
              return (
                <div key={g.id} className="mb-1">
                  <button
                    onClick={() => setOpenGroup(openGroup === g.id ? null : g.id)}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md font-body text-sm transition-colors ${gActive ? "text-wine" : "text-text-muted hover:text-foreground"}`}
                  >
                    <g.icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span className="flex-1 text-left">{g.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openGroup === g.id ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openGroup === g.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden pl-4 border-l border-white/6 ml-4">
                        {g.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => selectTab(item.id)}
                            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-md font-body text-sm transition-colors ${tab === item.id ? "bg-wine/8 text-wine" : "text-text-muted hover:text-foreground"}`}
                          >
                            <item.icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />{item.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOfflineBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[56px] left-0 right-0 z-30 bg-[#1a1200] border-b border-yellow-500/20 px-5 py-2.5 flex items-center gap-3"
          >
            <AlertCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <p className="flex-1 font-body text-xs text-yellow-200/80">
              Backend offline — métricas e checkout desabilitados.
              {" "}Inicie com:{" "}
              <code className="font-mono text-yellow-300 bg-black/30 px-1.5 py-0.5 rounded">cd server &amp;&amp; npm run dev</code>
            </p>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-yellow-400/50 hover:text-yellow-300 transition-colors ml-2 shrink-0"
              aria-label="Fechar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`flex-1 px-4 sm:px-6 lg:px-10 pb-6 sm:pb-10 max-w-6xl mx-auto w-full ${showOfflineBanner ? "pt-[96px]" : "pt-[72px]"}`}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {tab === "metricas" && <MetricsTab />}
            {tab === "leads" && <LeadsTab />}
            {tab === "pedidos" && <PedidosTab />}
            {tab === "inscricoes" && <InscricoesTab />}
            {tab === "ebook" && <EbookTab />}
            {tab === "produtos" && <ProdutosTab />}
            {tab === "ctas" && <CtasTab />}
            {tab === "conteudo" && <ContentTab />}
            {tab === "emails" && <EmailsTab />}
            {tab === "configuracoes" && <ConfiguracoesTab />}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="border-t border-white/5 px-6 py-4 text-center">
        <p className="text-white/50 font-body text-xs">MANUAL DO EMPREGADOR — Painel Administrativo · Acesso restrito</p>
      </footer>
    </div>
  );
};

// ROOT
const AdminPage = () => {
  const [authed, setAuthed] = useState(isAuthed);
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={() => setAuthed(false)} />;
};

export default AdminPage;
