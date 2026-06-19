import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { Toaster } from "@/components/ui/toaster";
  import { TooltipProvider } from "@/components/ui/tooltip";
  import { AuthProvider, useAuth } from "@/hooks/useAuth";
  import { usePageTracker } from "@/hooks/usePageTracker";

  import Home from "@/pages/Home";
  import About from "@/pages/About";
  import Services from "@/pages/Services";
  import Team from "@/pages/Team";
  import Careers from "@/pages/Careers";
  import Contact from "@/pages/Contact";
  import LegalServices from "@/pages/LegalServices";
  import Partnerships from "@/pages/Partnerships";
  import Training from "@/pages/Training";
  import StudentPortal from "@/pages/StudentPortal";
  import Login from "@/pages/Login";
  import ForgotPassword from "@/pages/ForgotPassword";
  import ResetPassword from "@/pages/ResetPassword";
  import AdminDashboard from "@/pages/AdminDashboard";
  import CommissionsDashboard from "@/pages/CommissionsDashboard";
  import NotFound from "@/pages/not-found";

  const queryClient = new QueryClient();

  function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
    const { user, loading } = useAuth();
    if (loading) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#C9A961]/30 border-t-[#C9A961] rounded-full animate-spin" />
        </div>
      );
    }
    if (!user) return <Redirect to="/login" />;
    return <Component />;
  }

  function Router() {
    usePageTracker();
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/legal-services" component={LegalServices} />
        <Route path="/partnerships" component={Partnerships} />
        <Route path="/training" component={Training} />
        <Route path="/team" component={Team} />
        <Route path="/careers" component={Careers} />
        <Route path="/student-portal" component={StudentPortal} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/admin">
          {() => <ProtectedRoute component={AdminDashboard} />}
        </Route>
        <Route path="/commissions">
          {() => <ProtectedRoute component={CommissionsDashboard} />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    );
  }

  function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  export default App;
  