import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ThreatIntelligence from "./pages/ThreatIntelligence";
import Catalog from "./pages/Catalog";
import IntrusionSetCrosswalk from "./pages/IntrusionSetCrosswalk";
import CyberMapAmerica from "./pages/CyberMapAmerica";
import AboutUs from "./pages/AboutUs";
import LinkAnalysis from "./pages/LinkAnalysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/threat-intelligence" element={<ThreatIntelligence />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/intrusion-set-crosswalk" element={<IntrusionSetCrosswalk />} />
          <Route path="/cyber-map-america" element={<CyberMapAmerica />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/link-analysis" element={<LinkAnalysis />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
