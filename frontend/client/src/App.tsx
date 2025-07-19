import { Switch, Route } from "wouter";
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from "./lib/apollo";
import { AuthProvider } from "./lib/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/navbar";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="confession-ui-theme">
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>
                <Router />
              </main>
              <Toaster />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
