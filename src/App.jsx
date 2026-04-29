import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { BusinessDetail } from './pages/BusinessDetail';
import { PublicReview } from './pages/PublicReview';
import { SmartReply } from './pages/SmartReply';
import { Pricing } from './pages/Pricing';
import { OrderHistory } from './pages/OrderHistory';

function App() {
  return (
    <>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased text-foreground">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/business/:id" element={<BusinessDetail />} />
            <Route path="/review/:businessId" element={<PublicReview />} />
            <Route path="/smart-reply" element={<SmartReply />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/order-history" element={<OrderHistory />} />
          </Routes>
        </div>
      </Router>
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
