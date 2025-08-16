import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Route, Switch, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Breeds } from "./pages/Breeds";
import { Favorites } from "./pages/Favorites";
import { RandomCats } from "./pages/RandomCats";
import { store } from "./store/store";

function Router() {
  const [location, setLocation] = useLocation();

  const getCurrentView = (): "random" | "breeds" | "favorites" => {
    if (location === "/breeds") return "breeds";
    if (location === "/favorites") return "favorites";
    return "random";
  };

  const handleViewChange = (view: "random" | "breeds" | "favorites") => {
    switch (view) {
      case "random":
        setLocation("/");
        break;
      case "breeds":
        setLocation("/breeds");
        break;
      case "favorites":
        setLocation("/favorites");
        break;
    }
  };

  return (
    <>
      <Header currentView={getCurrentView()} onViewChange={handleViewChange} />
      <Switch>
        <Route path="/" component={RandomCats} />
        <Route path="/breeds" component={Breeds} />
        <Route path="/favorites" component={Favorites} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-slate-50">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
