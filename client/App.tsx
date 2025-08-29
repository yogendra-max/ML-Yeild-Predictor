import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PredictionProvider } from "./contexts/PredictionContext";
import { MLModelProvider } from "./contexts/MLModelContext";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/predict" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PredictionProvider>
      <MLModelProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </MLModelProvider>
    </PredictionProvider>
  </QueryClientProvider>
);

declare global {
  interface Window {
    __appRoot?: ReturnType<typeof createRoot>;
  }
}

const container = document.getElementById("root")!;
if (!window.__appRoot) {
  window.__appRoot = createRoot(container);
}
window.__appRoot.render(<App />);
