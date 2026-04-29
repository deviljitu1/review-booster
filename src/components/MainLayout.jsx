import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { 
  Sparkles, 
  LayoutDashboard, 
  MessageSquareText, 
  CreditCard, 
  History, 
  LogOut,
  SlidersHorizontal,
  ChevronRight,
  Menu,
  X,
  Store
} from 'lucide-react';

export const MainLayout = ({ children, title, description, badge = "AI Studio" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Smart Reply', path: '/smart-reply', icon: MessageSquareText },
    { label: 'Pricing', path: '/pricing', icon: CreditCard },
    { label: 'Order History', path: '/order-history', icon: History },
    { label: 'Edit Business', path: '/dashboard/business/default', icon: Store },
  ];

  const isActive = (path) => location.pathname === path;

  // Determine sidebar content based on path
  const isSettings = location.pathname.includes('/dashboard/business/');
  
  const sidebarTitle = isSettings ? "Brand Settings" : title;
  const sidebarDesc = isSettings ? "Make it yours — name, logo, colors, even your QR." : description;
  const sidebarBadge = isSettings ? "AI Studio" : badge;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-primary/10">
      {/* Top Navigation */}
      <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-10 sticky top-0 z-50">
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg md:text-2xl font-black tracking-tight text-gray-900 truncate">ReviewBoost AI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <button 
                className={`px-2 py-1 text-sm font-bold transition-all duration-300 relative group ${
                  isActive(item.path) 
                  ? "text-primary" 
                  : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-primary rounded-full"></div>
                )}
              </button>
            </Link>
          ))}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-primary hover:text-primary rounded-full h-10 w-10 bg-primary/5 hover:bg-primary/10 transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl h-12 px-4 font-bold transition-all"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 bg-gray-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-[40] bg-white animate-in slide-in-from-top duration-300">
          <div className="p-6 space-y-4">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start h-16 rounded-2xl px-6 font-bold text-lg ${
                    isActive(item.path) ? "bg-blue-50 text-primary" : "text-gray-600"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <div className="pt-6 border-t border-gray-100">
              <Button 
                variant="ghost" 
                className="w-full justify-start h-16 rounded-2xl px-6 font-bold text-lg text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 md:p-10 gap-8 md:gap-10 max-w-[1700px] mx-auto w-full overflow-x-hidden">
        {/* Left Sidebar Banner - Responsive */}
        <aside className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-32 lg:h-[calc(100vh-160px)]">
          <div className="h-full bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 flex flex-col relative overflow-hidden shadow-[0_32px_64px_-16px_rgba(37,99,235,0.25)] min-h-[250px] lg:min-h-0">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest w-fit mb-8 md:mb-12 border border-white/10 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{sidebarBadge}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-6 md:mb-8 tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700">
                {sidebarTitle}
              </h1>
              <p className="text-blue-100/90 text-lg md:text-xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                {sidebarDesc}
              </p>

              {/* Desktop Only Stats in Sidebar */}
              <div className="hidden lg:flex flex-col mt-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="glass-panel border-white/10 bg-white/5 backdrop-blur-xl p-8 rounded-3xl flex items-center justify-between transition-all hover:bg-white/10 cursor-default group">
                  <span className="text-white/70 font-bold text-sm tracking-tight uppercase">Avg. rating lift</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-2xl tracking-tighter">+1.4★</span>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="glass-panel border-white/10 bg-white/5 backdrop-blur-xl p-8 rounded-3xl flex items-center justify-between transition-all hover:bg-white/10 cursor-default group">
                  <span className="text-white/70 font-bold text-sm tracking-tight uppercase">Review conversion</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-2xl tracking-tighter">3.2x</span>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="pt-8 text-center">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">
                    Established 2024
                  </p>
                  <p className="text-[11px] font-bold text-white/50">
                    Crafted with care · ReviewBoost AI
                  </p>
                </div>
              </div>

              {/* Mobile Stats - Row layout */}
              <div className="flex lg:hidden flex-row gap-4 mt-8 md:mt-10 overflow-x-auto pb-2 scrollbar-hide">
                <div className="glass-panel border-white/10 bg-white/5 backdrop-blur-xl p-6 rounded-2xl flex flex-col gap-1 min-w-[160px]">
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-wider">Rating Lift</span>
                  <span className="text-white font-black text-xl">+1.4★</span>
                </div>
                <div className="glass-panel border-white/10 bg-white/5 backdrop-blur-xl p-6 rounded-2xl flex flex-col gap-1 min-w-[160px]">
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-wider">Conversion</span>
                  <span className="text-white font-black text-xl">3.2x</span>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute top-1/2 -left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-[80px]"></div>
          </div>
        </aside>

        {/* Dynamic Content */}
        <main className="flex-1 min-w-0 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
};
