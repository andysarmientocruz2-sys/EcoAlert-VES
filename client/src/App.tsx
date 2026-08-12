import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router, Switch, useHashLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import EducationPage from "./pages/EducationPage";
import NewsPage from "./pages/NewsPage";
import NotificationsPage from "./pages/NotificationsPage";
import RankingPage from "./pages/RankingPage";
import CreateReportPage from "./pages/CreateReportPage";
import ReportsEnhancedPage from "./pages/ReportsEnhancedPage";
import ProfileEnhancedPage from "./pages/ProfileEnhancedPage";
import MapPage from "./pages/MapPage";


function Router() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path={"/"} component={Home} />
      <Route path={"/login"} component={LoginPage} />
      <Route path={"/register"} component={RegisterPage} />
      <Route path={"/dashboard"} component={DashboardPage} />
      <Route path={"/settings"} component={SettingsPage} />
      <Route path={"/education"} component={EducationPage} />
      <Route path={"/news"} component={NewsPage} />
      <Route path={"/notifications"} component={NotificationsPage} />
      <Route path={"/ranking"} component={RankingPage} />
      <Route path={"/report"} component={CreateReportPage} />
      <Route path={"/reports"} component={ReportsEnhancedPage} />
      <Route path={"/profile"} component={ProfileEnhancedPage} />
      <Route path={"/mapa"} component={MapPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Navigation />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
