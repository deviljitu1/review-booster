import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Sparkles, Star, TrendingUp, ShieldCheck } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-mesh selection:bg-primary/20 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="container mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              ReviewBoost AI
            </span>
          </div>
          <div className="flex gap-6 items-center">
            <Link to="/auth" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-full px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="container mx-auto px-6 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Review Management</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-5 delay-100 leading-[0.9] lg:leading-[0.85]">
              Turn customers <br className="hidden md:block" />
              into your <span className="text-transparent bg-clip-text bg-gradient-primary">best sales team.</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-6 delay-200 leading-relaxed">
              ReviewBoost AI uses intelligent review flows to boost your 5-star ratings on Google while handling negative feedback privately.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-7 delay-300">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="h-16 px-10 text-lg w-full rounded-full bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                  Start Boosting Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg w-full sm:w-auto rounded-full bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white transition-all">
                Watch the magic
              </Button>
            </div>
          </div>

          {/* Social Proof / Stats */}
          <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 delay-500">
            {[
              { label: 'Avg. Rating Boost', val: '+1.4 Stars' },
              { label: 'Review Velocity', val: '3x Faster' },
              { label: 'Customer Insight', val: '100% Private' },
              { label: 'AI Responses', val: 'Instant' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{stat.val}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-32 text-left animate-in fade-in slide-in-from-bottom-8 delay-700">
            <div className="glass-panel p-10 hover-lift group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Star className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Review Engine</h3>
              <p className="text-muted-foreground leading-relaxed">
                Smart suggestions written in your brand's voice. Customers post detailed reviews in seconds, not minutes.
              </p>
            </div>
            
            <div className="glass-panel p-10 hover-lift group border-primary/20 bg-primary/5">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sentiment Shield</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automatically redirect low ratings to a private feedback loop. Improve your business without hurting your public score.
              </p>
            </div>
            
            <div className="glass-panel p-10 hover-lift group">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-time Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track your rating growth, monitor feedback, and generate AI replies to Google reviews from one beautiful dashboard.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
