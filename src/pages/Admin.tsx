import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  Users,
  ShoppingCart,
  Clock,
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
  ChevronDown,
  X,
  Menu,
  Settings,
  Database,
  CreditCard,
  Loader2,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getTrackingData, resetTracking, TrackingData } from "@/lib/tracking";
import { getLeads as fetchLeads } from "@/lib/repository";
import {
  getContent,
  saveContent,
  resetContent,
  CONTENT_DEFAULTS,
  ContentData,
} from "@/lib/contentStore";

// ─────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────
// NOTE: Password is hardcoded for MVP. Move to env var before production.
const ADMIN_PASSWORD = "ManualEmpregador@2024";
const AUTH_KEY = "fl_admin_auth";

const isAuthed = () => sessionStorage.getItem(AUTH_KEY) === "true";
const setAuthed = () => sessionStorage.setItem(AUTH_KEY, "true");
const clearAuth = () => sessionStorage.removeItem(AUTH_KEY);

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Lead {
  name: string;
  email: string;
  whatsapp: string;
  data: string;
}

type Tab = "metricas" | "leads" | "conteudo" | "configuracoes";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const formatDuration = (seconds: number): string => {
  if (seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const aggregateByDay = (timestamps: string[]): { date: string; count: number }[] => {
  const counts: Record<string, number> = {};
  timestamps.forEach((ts) => {
    const day = ts.split("T")[0];
    counts[day] = (counts[day] || 0) + 1;
  });
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, count]) => ({ date: date.slice(5), count }));
};

const exportCSV = (leads: Lead[]) => {
  if (!leads.length) return;
  const headers = ["Nome", "E-mail", "WhatsApp", "Data"];
  const rows = leads.map((l) => [l.name, l.email, l.whatsapp, l.data].map((v) => `"${(v ?? "").replace(/"/g, '""')}"`).join(";"));
  const csv = [headers.join(";"), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportXLS = (leads: Lead[]) => {
  if (!leads.length) return;
  const table = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"/></head><body><table><tr><th>Nome</th><th>E-mail</th><th>WhatsApp</th><th>Data</th></tr>${leads.map((l) => `<tr><td>${l.name}</td><td>${l.email}</td><td>${l.whatsapp}</td><td>${l.data}</td></tr>`).join("")}</table></body></html>`;
  const blob = new Blob([table], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads_${new Date().toISOString().split("T")[0]}.xls`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─────────────────────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuthed();
      onLogin();
    } else {
      setError(true);
      setPw("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(62,21,23,0.5) 0%, transparent 70%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary/20 border border-wine/20 mb-5">
            <Lock className="w-5 h-5 text-wine" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground tracking-tight">
            Área Restrita
          </h1>
          <p className="text-secondary font-body text-sm mt-2">
            Felipe Lopes Advogados — Admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Senha de acesso"
              autoFocus
              className={`w-full bg-support border rounded-md px-4 py-3.5 text-foreground font-body text-base focus:outline-none transition-all duration-200 pr-12 ${
                error
                  ? "border-red-400/60 shake"
                  : "border-white/8 focus:border-wine/50"
              }`}
              aria-label="Senha de administrador"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors p-1"
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-xs font-body flex items-center gap-1.5"
                role="alert"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Senha incorreta.
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full bg-wine hover:bg-wine-light text-background font-ui font-bold text-sm min-h-[48px] rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(200,121,124,0.3)]"
          >
            ENTRAR
          </button>
        </form>
      </motion.div>
    </main>
  );
};

// ─────────────────────────────────────────────────────────────
// KPI CARD
// ─────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
  sub?: string;
}

const KpiCard = ({ label, value, icon: Icon, accent, sub }: KpiCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className={`surface-card rounded-xl p-4 sm:p-6 flex flex-col gap-3 ${accent ? "border-wine/15" : ""}`}
  >
    <div className="flex items-center justify-between">
      <span className="text-secondary font-body text-xs uppercase tracking-[0.15em]">{label}</span>
      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${accent ? "bg-wine/10" : "bg-white/4"}`}>
        <Icon className={`w-4 h-4 ${accent ? "text-wine" : "text-secondary"}`} strokeWidth={1.5} />
      </div>
    </div>
    <span className={`font-body text-3xl sm:text-4xl font-semibold tabular-nums ${accent ? "text-wine" : "text-foreground"}`}>
      {value}
    </span>
    {sub && <span className="text-secondary font-body text-xs">{sub}</span>}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────
// METRICS TAB
// ─────────────────────────────────────────────────────────────
const MetricsTab = () => {
  const [data, setData] = useState<TrackingData | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  const refresh = useCallback(() => {
    setData(getTrackingData());
    fetchLeads().then(setLeads);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const chartData = useMemo(
    () => (data ? aggregateByDay(data.pageviews.timestamps) : []),
    [data]
  );

  const abandoned = useMemo(() => {
    if (!data) return 0;
    return Math.max(0, data.formStarts - leads.length);
  }, [data, leads]);

  const customTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-support border border-white/8 rounded-md px-3 py-2 text-xs font-body">
          <p className="text-secondary mb-0.5">{label}</p>
          <p className="text-wine font-semibold">{payload[0].value} visitas</p>
        </div>
      );
    }
    return null;
  };

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
            Métricas de Performance
          </h2>
          <p className="text-secondary font-body text-sm mt-1">
            Dados em tempo real — armazenados localmente no navegador.
          </p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 text-secondary hover:text-foreground font-body text-sm transition-colors border border-white/8 hover:border-white/15 px-3 py-2 rounded-md shrink-0"
          aria-label="Atualizar métricas"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Atualizar
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <KpiCard label="Pageviews" value={data.pageviews.count} icon={Eye} />
        <KpiCard
          label="Tempo médio"
          value={formatDuration(data.avgTimeOnPage)}
          icon={Clock}
          sub="por sessão"
        />
        <KpiCard label="Leads" value={leads.length} icon={Users} accent />
        <KpiCard
          label="Compras"
          value={data.purchases.count}
          icon={ShoppingCart}
          accent
          sub={data.purchases.count > 0 ? `${Math.round((data.purchases.count / Math.max(leads.length, 1)) * 100)}% conv.` : undefined}
        />
        <KpiCard
          label="Aband. de carrinho"
          value={abandoned}
          icon={AlertCircle}
          sub={data.formStarts > 0 ? `de ${data.formStarts} interações` : undefined}
        />
      </div>

      {/* Chart */}
      <div className="surface-card rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <TrendingUp className="w-4 h-4 text-wine" strokeWidth={1.5} />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Pageviews nos últimos 30 dias
          </h3>
        </div>

        {chartData.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-secondary font-body text-sm gap-2">
            <BarChart2 className="w-8 h-8 opacity-30" strokeWidth={1} />
            <p>Nenhum dado de tráfego ainda.</p>
            <p className="text-xs opacity-60">
              Os dados aparecem após visitas à landing page.
            </p>
          </div>
        ) : (
          <div className="h-40 sm:h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id="wineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8797C" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#C8797C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#514F50"
                tick={{ fontSize: 10, fill: "#868283", fontFamily: "DM Sans" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#514F50"
                tick={{ fontSize: 11, fill: "#868283", fontFamily: "DM Sans" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={customTooltip} cursor={{ stroke: "rgba(200,121,124,0.2)", strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#C8797C"
                strokeWidth={2}
                fill="url(#wineGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#C8797C", stroke: "#000", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Reset */}
      <div className="border-t border-white/5 pt-6">
        <button
          onClick={() => {
            if (window.confirm("Zerar todos os dados de rastreamento? Esta ação não pode ser desfeita.")) {
              resetTracking();
              refresh();
            }
          }}
          className="text-red-400/60 hover:text-red-400 font-body text-xs transition-colors flex items-center gap-1.5"
        >
          <X className="w-3 h-3" />
          Zerar dados de rastreamento
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// LEADS TAB
// ─────────────────────────────────────────────────────────────
const LeadsTab = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  useEffect(() => {
    fetchLeads().then(setLeads);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter(
      (l) => l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q)
    );
  }, [leads, search]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          Gestão de Leads
        </h2>
        <p className="text-secondary font-body text-sm mt-1">
          {leads.length} lead{leads.length !== 1 ? "s" : ""} cadastrado{leads.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por nome ou e-mail…"
            className="w-full bg-support border border-white/8 rounded-md pl-9 pr-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:border-wine/40 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => exportCSV(filtered)}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 border border-white/8 hover:border-wine/30 text-secondary hover:text-foreground px-4 py-2.5 rounded-md font-body text-sm transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          <button
            onClick={() => exportXLS(filtered)}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 border border-white/8 hover:border-wine/30 text-secondary hover:text-foreground px-4 py-2.5 rounded-md font-body text-sm transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
          >
            <Download className="w-3.5 h-3.5" />
            XLS
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="surface-card rounded-xl overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-secondary font-body text-sm gap-2">
            <Users className="w-8 h-8 opacity-30" strokeWidth={1} />
            <p>{search ? "Nenhum resultado para a busca." : "Nenhum lead cadastrado ainda."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-3 sm:px-5 py-3 sm:py-3.5 text-xs uppercase tracking-[0.12em] text-secondary font-semibold w-[40%] sm:w-auto">Nome</th>
                  <th className="text-left px-3 sm:px-5 py-3 sm:py-3.5 text-xs uppercase tracking-[0.12em] text-secondary font-semibold w-[60%] sm:w-auto">E-mail</th>
                  <th className="text-left px-3 sm:px-5 py-3 sm:py-3.5 text-xs uppercase tracking-[0.12em] text-secondary font-semibold hidden md:table-cell">WhatsApp</th>
                  <th className="text-left px-3 sm:px-5 py-3 sm:py-3.5 text-xs uppercase tracking-[0.12em] text-secondary font-semibold hidden sm:table-cell">Data</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((lead, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/4 hover:bg-white/2 transition-colors last:border-0"
                  >
                    <td className="px-3 sm:px-5 py-3 sm:py-3.5 text-foreground/90 max-w-[130px]">
                      <span className="block truncate">{lead.name || "—"}</span>
                    </td>
                    <td className="px-3 sm:px-5 py-3 sm:py-3.5 text-foreground/70 max-w-[160px]">
                      <span className="block truncate">{lead.email || "—"}</span>
                    </td>
                    <td className="px-3 sm:px-5 py-3 sm:py-3.5 text-foreground/70 hidden md:table-cell">{lead.whatsapp || "—"}</td>
                    <td className="px-3 sm:px-5 py-3 sm:py-3.5 text-secondary hidden sm:table-cell whitespace-nowrap">{formatDate(lead.data)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between text-secondary font-body text-xs sm:text-sm">
          <span>
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-md text-sm font-semibold transition-colors disabled:opacity-25 hover:bg-white/5 text-secondary hover:text-foreground flex items-center justify-center"
              aria-label="Página anterior"
            >
              ‹
            </button>
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-md text-xs font-semibold transition-colors ${
                    p === page
                      ? "bg-wine/15 text-wine border border-wine/20"
                      : "hover:bg-white/5 text-secondary hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <span className="sm:hidden px-2 text-xs text-secondary">{page}/{pages}</span>
            <button
              onClick={() => setPage(Math.min(pages, page + 1))}
              disabled={page === pages}
              className="w-8 h-8 rounded-md text-sm font-semibold transition-colors disabled:opacity-25 hover:bg-white/5 text-secondary hover:text-foreground flex items-center justify-center"
              aria-label="Próxima página"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CONTENT TAB
// ─────────────────────────────────────────────────────────────
const ContentTab = () => {
  const [form, setForm] = useState<ContentData>(() => getContent());
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const update = (field: keyof ContentData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveContent(form);
    setSaved(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm("Restaurar todos os textos para o padrão original?")) {
      resetContent();
      setForm({ ...CONTENT_DEFAULTS });
    }
  };

  const Field = ({
    label,
    field,
    multiline,
    placeholder,
    type = "text",
    hint,
  }: {
    label: string;
    field: keyof ContentData;
    multiline?: boolean;
    placeholder?: string;
    type?: string;
    hint?: string;
  }) => (
    <div className="space-y-1.5">
      <label className="block text-off-white/80 font-body text-sm font-medium">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={form[field]}
          onChange={(e) => update(field, e.target.value)}
          rows={3}
          className="w-full bg-background border border-white/8 focus:border-wine/40 rounded-md px-4 py-3 text-foreground font-body text-sm focus:outline-none transition-colors resize-none"
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={form[field]}
          onChange={(e) => update(field, e.target.value)}
          className="w-full bg-background border border-white/8 focus:border-wine/40 rounded-md px-4 py-2.5 text-foreground font-body text-sm focus:outline-none transition-colors"
          placeholder={placeholder}
        />
      )}
      {hint && <p className="text-secondary font-body text-xs">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
            Edição de Conteúdo
          </h2>
          <p className="text-secondary font-body text-sm mt-1">
            Alterações são salvas no navegador e refletidas na landing page.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:shrink-0">
          <button
            onClick={handleReset}
            className="border border-white/8 hover:border-white/15 text-secondary hover:text-foreground px-4 py-2 rounded-md font-body text-sm transition-all duration-200"
          >
            Restaurar padrão
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2 rounded-md font-ui text-xs transition-all duration-200 ${
              saved
                ? "bg-green-600/20 border border-green-500/30 text-green-400"
                : "bg-wine hover:bg-wine-light text-background hover:-translate-y-0.5"
            }`}
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : null}
            {saved ? "SALVO!" : "SALVAR"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
        {/* Form */}
        <div className="space-y-8">
          {/* Section: Textos */}
          <div className="surface-card rounded-xl p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/5">
              <Edit3 className="w-4 h-4 text-wine" strokeWidth={1.5} />
              <h3 className="font-display text-lg font-semibold text-foreground">Textos Principais</h3>
            </div>
            <Field label="Badge do Hero" field="heroBadge" placeholder="Ex: Guia Prático para Empresários" />
            <Field label="Headline principal" field="heroHeadline" placeholder="Ex: Manual do Empregador" />
            <Field label="Subtítulo" field="heroSubheadline" multiline placeholder="Descrição breve do material…" />
            <Field label="Texto do corpo" field="heroBody" multiline placeholder="Texto explicativo mais longo…" />
            <Field label="Texto do botão CTA principal" field="heroCta" placeholder="Ex: QUERO ADQUIRIR O E-BOOK" />
          </div>

          {/* Section: Links */}
          <div className="surface-card rounded-xl p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/5">
              <LinkIcon className="w-4 h-4 text-wine" strokeWidth={1.5} />
              <h3 className="font-display text-lg font-semibold text-foreground">Links & Integração</h3>
            </div>
            <Field
              label="URL do checkout (Hotmart, Stripe…)"
              field="checkoutUrl"
              type="url"
              placeholder="https://pay.hotmart.com/…"
              hint="O lead é capturado e então redirecionado para esta URL."
            />
            <Field
              label="Link de download do eBook"
              field="ebookDownloadUrl"
              type="url"
              placeholder="https://…"
              hint="Enviado ao comprador na página de obrigado."
            />
            <Field
              label="Número WhatsApp (com DDI)"
              field="whatsappNumber"
              placeholder="5581986758036"
              hint="Apenas números, sem formatação."
            />
            <Field
              label="Mensagem padrão WhatsApp"
              field="whatsappMsg"
              placeholder="Olá! Tenho interesse no Manual do Empregador."
            />
          </div>

          {/* Section: Preços */}
          <div className="surface-card rounded-xl p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/5">
              <DollarSign className="w-4 h-4 text-wine" strokeWidth={1.5} />
              <h3 className="font-display text-lg font-semibold text-foreground">Preços</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Preço atual (R$)" field="price" placeholder="49" />
              <Field label="Preço original / De (R$)" field="priceOriginal" placeholder="97" />
            </div>
          </div>

          {/* Section: Imagens */}
          <div className="surface-card rounded-xl p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/5">
              <ImageIcon className="w-4 h-4 text-wine" strokeWidth={1.5} />
              <h3 className="font-display text-lg font-semibold text-foreground">Imagens</h3>
            </div>
            <Field
              label="URL da capa do eBook"
              field="ebookCoverUrl"
              type="url"
              placeholder="https://… (deixe vazio para usar a imagem padrão)"
              hint="Use uma URL pública de imagem (PNG, JPG, WebP)."
            />
            {form.ebookCoverUrl && (
              <div className="mt-3">
                <img
                  src={form.ebookCoverUrl}
                  alt="Prévia da capa"
                  className="h-32 w-auto rounded-md object-contain border border-white/8"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="sm:sticky sm:top-24">
          <p className="text-secondary font-body text-xs uppercase tracking-[0.15em] mb-3">
            Prévia em tempo real
          </p>
          <div
            className="rounded-xl overflow-hidden border border-white/8"
            style={{
              background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(62,21,23,0.7) 0%, transparent 70%), #000",
            }}
          >
            <div className="p-5 space-y-3">
              <span className="inline-flex items-center border border-wine/25 text-wine font-ui text-[9px] tracking-[0.15em] px-3 py-1 rounded-full">
                {form.heroBadge || CONTENT_DEFAULTS.heroBadge}
              </span>
              <h3 className="font-display text-xl font-semibold text-foreground leading-tight">
                Manual do{" "}
                <span className="text-wine italic">
                  {form.heroHeadline?.replace("Manual do", "").trim() || "Empregador"}
                </span>
              </h3>
              <p className="text-off-white/70 font-body text-xs leading-relaxed line-clamp-3">
                {form.heroSubheadline || CONTENT_DEFAULTS.heroSubheadline}
              </p>
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="bg-wine text-background font-ui text-[9px] px-3 py-2 rounded text-center tracking-widest">
                  {form.heroCta || CONTENT_DEFAULTS.heroCta}
                </div>
                <div className="text-center">
                  <span className="text-wine font-display text-xl font-bold">
                    R$ <span className="text-3xl">{form.price || "49"}</span>
                  </span>
                  {form.priceOriginal && (
                    <span className="text-secondary line-through font-body text-xs ml-2">
                      R$ {form.priceOriginal}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full flex items-center justify-center gap-2 border border-white/8 hover:border-wine/30 text-secondary hover:text-foreground font-body text-xs py-2.5 rounded-md transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5" />
            Abrir landing page
          </a>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CONFIGURAÇÕES TAB
// ─────────────────────────────────────────────────────────────
type SupabaseStatus = "idle" | "testing" | "ok" | "error";

const ConfiguracoesTab = () => {
  const [supabaseUrl, setSupabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL ?? "");
  const [supabaseKey, setSupabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "");
  const [status, setStatus] = useState<SupabaseStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  const testConnection = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setErrorMsg("Preencha a URL e a Anon Key antes de testar.");
      setStatus("error");
      return;
    }
    setStatus("testing");
    setErrorMsg("");
    try {
      const res = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/leads?select=id&limit=1`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });
      if (res.ok || res.status === 404) {
        setStatus("ok");
      } else {
        setErrorMsg(`Falha na autenticação (HTTP ${res.status}). Verifique a URL e a Anon Key.`);
        setStatus("error");
      }
    } catch {
      setErrorMsg("Não foi possível alcançar o servidor. Verifique a URL do projeto.");
      setStatus("error");
    }
  };

  const PAYMENT_INTEGRATIONS = [
    {
      name: "Hotmart",
      icon: "🔥",
      description: "Venda e distribuição digital via Hotmart.",
      color: "orange",
    },
    {
      name: "Stripe",
      icon: "💳",
      description: "Gateway de pagamento internacional.",
      color: "indigo",
    },
    {
      name: "Mercado Pago",
      icon: "💰",
      description: "Pagamentos com Pix, cartão e boleto.",
      color: "blue",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          Configurações
        </h2>
        <p className="text-muted-foreground font-body text-sm mt-1">
          Gerencie integrações e variáveis do sistema.
        </p>
      </div>

      {/* ── Supabase ── */}
      <div className="surface-card rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Database className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">Supabase</h3>
            <p className="text-muted-foreground font-body text-xs">Banco de dados para leads e persistência</p>
          </div>
          <div className="ml-auto">
            {isConfigured ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-body text-emerald-400 border border-emerald-500/25 bg-emerald-500/8 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Configurado via .env
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-body text-yellow-400 border border-yellow-500/25 bg-yellow-500/8 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                Não configurado
              </span>
            )}
          </div>
        </div>

        {!isConfigured && (
          <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/15 px-4 py-3 font-body text-xs text-yellow-300/80 leading-relaxed">
            Para ativar o Supabase, crie um arquivo <code className="font-mono bg-white/8 px-1 py-0.5 rounded text-yellow-200">.env.local</code> na raiz do projeto com as variáveis abaixo e reinicie o servidor.
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-foreground/80 font-body text-sm font-medium">
              VITE_SUPABASE_URL
            </label>
            <input
              type="url"
              value={supabaseUrl}
              onChange={(e) => { setSupabaseUrl(e.target.value); setStatus("idle"); }}
              placeholder="https://xxxxxxxxxxx.supabase.co"
              className="w-full bg-background border border-white/8 focus:border-wine/40 rounded-md px-4 py-2.5 text-foreground font-mono text-sm focus:outline-none transition-colors placeholder:text-muted-foreground/40"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-foreground/80 font-body text-sm font-medium">
              VITE_SUPABASE_ANON_KEY
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => { setSupabaseKey(e.target.value); setStatus("idle"); }}
              placeholder="eyJhbGciOiJIUzI1NiIsInR…"
              className="w-full bg-background border border-white/8 focus:border-wine/40 rounded-md px-4 py-2.5 text-foreground font-mono text-sm focus:outline-none transition-colors placeholder:text-muted-foreground/40"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={testConnection}
            disabled={status === "testing"}
            className="flex items-center gap-2 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/25 hover:border-emerald-500/40 text-emerald-400 px-5 py-2.5 rounded-md font-body text-sm transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            {status === "testing" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" strokeWidth={1.5} />
            )}
            {status === "testing" ? "Testando conexão…" : "Testar conexão"}
          </button>

          <AnimatePresence mode="wait">
            {status === "ok" && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-emerald-400 font-body text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Conexão estabelecida com sucesso!
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2 text-red-400 font-body text-sm max-w-sm"
              >
                <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="rounded-lg bg-support border border-white/5 px-4 py-3 font-mono text-xs text-muted-foreground space-y-1">
          <p className="text-secondary font-body text-xs mb-2 font-sans">Adicione ao <code className="bg-white/8 px-1 py-0.5 rounded">.env.local</code>:</p>
          <p className="text-emerald-300/60">VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co</p>
          <p className="text-emerald-300/60">VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui</p>
        </div>
      </div>

      {/* ── Meios de Pagamento ── */}
      <div className="surface-card rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-md bg-primary/20 border border-wine/20 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-wine" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">Meios de Pagamento</h3>
            <p className="text-muted-foreground font-body text-xs">Integrações nativas com plataformas de checkout</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {PAYMENT_INTEGRATIONS.map((integration) => (
            <div
              key={integration.name}
              className="relative rounded-xl border border-white/5 bg-background p-5 flex flex-col gap-3 overflow-hidden opacity-60"
            >
              {/* Em breve badge */}
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-body font-semibold text-wine/80 border border-wine/20 bg-wine/5 px-2 py-0.5 rounded-full tracking-wide">
                  EM BREVE
                </span>
              </div>

              <div className="text-2xl">{integration.icon}</div>
              <div>
                <h4 className="font-display text-base font-semibold text-foreground/80">
                  {integration.name}
                </h4>
                <p className="text-muted-foreground font-body text-xs mt-1 leading-relaxed">
                  {integration.description}
                </p>
              </div>
              <button
                disabled
                className="mt-auto w-full border border-white/8 text-muted-foreground font-body text-xs py-2 rounded-md cursor-not-allowed"
              >
                Aguarde
              </button>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground font-body text-xs leading-relaxed">
          Em breve você poderá configurar diretamente o checkout via Hotmart, Stripe ou Mercado Pago sem precisar sair do painel. Por enquanto, configure a URL de checkout manualmente na aba <strong className="text-foreground/70">Conteúdo</strong>.
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SIDEBAR NAV
// ─────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "metricas", label: "Métricas", icon: BarChart2 },
  { id: "leads", label: "Leads", icon: Users },
  { id: "conteudo", label: "Conteúdo", icon: Edit3 },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

// ─────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────
const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [tab, setTab] = useState<Tab>("metricas");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1 text-secondary hover:text-foreground"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-wine/15 border border-wine/25 rounded-md flex items-center justify-center">
              <span className="font-display font-bold text-wine text-xs">FL</span>
            </div>
            <span className="font-display text-foreground font-semibold text-base hidden sm:block">
              Admin
            </span>
            <span className="text-secondary/40 hidden sm:block">·</span>
            <span className="font-body text-secondary text-sm hidden sm:block">
              Manual do Empregador
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegação admin">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-body text-sm transition-all duration-200 ${
                tab === id
                  ? "bg-wine/10 text-wine border border-wine/15"
                  : "text-secondary hover:text-foreground hover:bg-white/4"
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-secondary hover:text-foreground font-body text-sm transition-colors border border-white/8 hover:border-white/15 px-3 py-2 rounded-md"
          aria-label="Sair"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </header>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[56px] left-0 right-0 z-40 bg-support border-b border-white/5 px-4 py-3 md:hidden"
            aria-label="Navegação mobile"
          >
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setTab(id); setMobileOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-md font-body text-sm transition-colors ${
                  tab === id ? "bg-wine/10 text-wine" : "text-secondary hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 pt-[72px] px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "metricas" && <MetricsTab />}
            {tab === "leads" && <LeadsTab />}
            {tab === "conteudo" && <ContentTab />}
            {tab === "configuracoes" && <ConfiguracoesTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-4 text-center">
        <p className="text-white/20 font-body text-xs">
          Felipe Lopes Advogados — Painel Administrativo · Acesso restrito
        </p>
      </footer>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────
const AdminPage = () => {
  const [authed, setAuthed] = useState(isAuthed());

  return authed ? (
    <AdminDashboard onLogout={() => setAuthed(false)} />
  ) : (
    <LoginScreen onLogin={() => setAuthed(true)} />
  );
};

export default AdminPage;
