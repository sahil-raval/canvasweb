import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* Scroll every page to top on route change */
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location]);
  return null;
}

// Components
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Preloader } from '@/components/Preloader';
import { RouteSeo } from '@/components/RouteSeo';
import { CmsProvider } from '@/lib/cms';

// Pages
import Home from '@/pages/Home';
import Listings from '@/pages/Listings';
import ListingDetail from '@/pages/ListingDetail';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Journal from '@/pages/Journal';
import JournalPost from '@/pages/JournalPost';
import Rent from '@/pages/Rent';
import RentalDetail from '@/pages/RentalDetail';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router({ ready }: { ready: boolean }) {
  return (
    <div className="flex flex-col min-h-screen">
      <RouteSeo />
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/listings" component={Listings} />
          <Route path="/listings/:slug" component={ListingDetail} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/journal" component={Journal} />
          <Route path="/journal/:slug" component={JournalPost} />
          <Route path="/rent" component={Rent} />
          <Route path="/rent/:slug" component={RentalDetail} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // Only show preloader once per browser session
  const [preloaderDone, setPreloaderDone] = useState(() =>
    typeof sessionStorage !== "undefined" && sessionStorage.getItem("cre-loaded") === "1"
  );

  const handlePreloaderComplete = useCallback(() => {
    sessionStorage.setItem("cre-loaded", "1");
    setPreloaderDone(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <CmsProvider>
            {/* Preloader — only on first visit */}
            <ScrollToTop />
            <Preloader onComplete={handlePreloaderComplete} />

            {/* Page content fades in after preloader exits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: preloaderDone ? 1 : 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            >
              <Router ready={preloaderDone} />
            </motion.div>
          </CmsProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
