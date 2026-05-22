import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";

const Index = lazy(() => import("@/pages/Index.tsx"));
const Evento = lazy(() => import("@/pages/Evento.tsx"));
const EventoGrupo = lazy(() => import("@/pages/EventoGrupo.tsx"));
const Obrigado = lazy(() => import("@/pages/Obrigado.tsx"));
const Admin = lazy(() => import("@/pages/Admin.tsx"));
const NotFound = lazy(() => import("@/pages/NotFound.tsx"));

const PageLoader = () => (
  <div className="min-h-screen bg-[#0d0305] flex flex-col items-center justify-center text-white/40 font-ui text-xs tracking-[0.25em] uppercase select-none">
    <div className="relative mb-4 flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-r-2 border-[#dc2626]" />
    </div>
    Carregando...
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ebook" element={<Index />} />
            <Route path="/evento" element={<Evento />} />
            <Route path="/evento/grupo" element={<EventoGrupo />} />
            <Route path="/grupo" element={<EventoGrupo />} />
            <Route path="/obrigado" element={<Obrigado />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
