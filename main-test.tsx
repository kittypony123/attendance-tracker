import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { DashboardProvider } from "@/contexts/dashboard-context";
import HomeTest from "./pages/home-test";
import "./index.css";

function TestApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <DashboardProvider>
            <Toaster />
            <HomeTest />
          </DashboardProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<TestApp />);

