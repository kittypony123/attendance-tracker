import { createRoot } from "react-dom/client";
import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { DashboardProvider } from "@/contexts/dashboard-context";
import HomeTest from "./pages/home-test";
import "./index.css";

// Check if we're in test mode
const isTestMode = import.meta.env.TEST_MODE === 'true';

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

// Render the appropriate app based on mode
createRoot(document.getElementById("root")!).render(
  isTestMode ? <TestApp /> : <App />
);

