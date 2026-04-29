import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MainLayout } from '../components/MainLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Loader2, 
  Save, 
  Upload,
  RefreshCcw,
  Zap,
  ChevronDown,
  Building2,
  Image as ImageIcon,
  Palette,
  QrCode,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from "qrcode.react";

export const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [currentBusiness, setCurrentBusiness] = useState(null);
  
  const [brandSettings, setBrandSettings] = useState({
    name: 'ReviewBoost AI',
    primaryColor: '#2370af',
    accentColor: '#eef5fc',
    qrColor: '#098a00',
    logo: null
  });

  useEffect(() => {
    fetchAllBusinesses();
  }, []);

  useEffect(() => {
    if (businesses.length > 0) {
      if (id === 'default') {
        setCurrentBusiness(businesses[0]);
        updateSettings(businesses[0]);
      } else {
        const found = businesses.find(b => b.id === id);
        if (found) {
          setCurrentBusiness(found);
          updateSettings(found);
        } else {
          setCurrentBusiness(businesses[0]);
          updateSettings(businesses[0]);
        }
      }
    }
  }, [id, businesses]);

  const fetchAllBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*');

      if (error) throw error;
      setBusinesses(data || []);
      if (data && data.length > 0 && id === 'default') {
        setCurrentBusiness(data[0]);
        updateSettings(data[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (data) => {
    setBrandSettings({
      name: data.name || 'ReviewBoost AI',
      primaryColor: data.primary_color || '#2370af',
      accentColor: data.accent_color || '#eef5fc',
      qrColor: data.qr_color || '#098a00',
      logo: data.logo_url || null
    });
  };

  const handleSave = async () => {
    if (!currentBusiness) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: brandSettings.name,
          primary_color: brandSettings.primaryColor,
          accent_color: brandSettings.accentColor,
          qr_color: brandSettings.qrColor,
          logo_url: brandSettings.logo
        })
        .eq('id', currentBusiness.id);

      if (error) throw error;
      toast.success('Brand settings saved successfully!');
      fetchAllBusinesses(); // Refresh data
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (currentBusiness) {
      updateSettings(currentBusiness);
      toast.info('Settings reset to saved values');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20 px-4 md:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">Brand Settings</h1>
            <p className="text-muted-foreground mt-1 font-medium text-sm md:text-base">Pick which brand to edit. Each business can have its own.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              className="flex-1 sm:flex-none h-12 px-4 md:px-6 rounded-2xl font-bold text-gray-500 hover:text-gray-900 transition-all"
              onClick={handleReset}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              className="flex-1 sm:flex-none h-12 px-6 md:px-8 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 font-bold transition-all hover:scale-[1.02]"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            {/* Business Selector */}
            <Card className="p-6 md:p-8 rounded-[2rem] border-none shadow-sm bg-white/50 backdrop-blur-sm ring-1 ring-gray-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Editing brand for</h3>
                  <p className="text-sm text-muted-foreground">Choose a business to customize its theme, or edit the default applied to all.</p>
                </div>
              </div>
              <div className="relative">
                <select 
                  className="w-full h-14 rounded-2xl bg-white border border-gray-100 px-6 font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                  value={currentBusiness?.id || ''}
                  onChange={(e) => navigate(`/dashboard/business/${e.target.value}`)}
                >
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </Card>

            {/* Identity */}
            <Card className="p-6 md:p-8 rounded-[2rem] border-none shadow-sm bg-white ring-1 ring-gray-100">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Identity</h3>
                  <p className="text-sm text-muted-foreground font-medium">Your brand's name and logo.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 md:gap-8">
                <div className="sm:col-span-4 space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Logo</Label>
                  <div className="space-y-4">
                    <div className="w-full aspect-square rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-gray-50 transition-all overflow-hidden">
                      {brandSettings.logo ? (
                        <img src={brandSettings.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Upload</p>
                            <p className="text-[8px] font-bold text-gray-400">PNG / SVG · ≤1MB</p>
                          </div>
                        </>
                      )}
                    </div>
                    <Button variant="outline" className="w-full h-10 rounded-xl border-gray-200 font-bold text-xs bg-white shadow-sm">
                      <Upload className="w-3.5 h-3.5 mr-2" />
                      Replace
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Brand name</Label>
                  <div className="space-y-2">
                    <Input 
                      value={brandSettings.name}
                      onChange={(e) => setBrandSettings({...brandSettings, name: e.target.value})}
                      className="h-14 rounded-2xl bg-white border-gray-100 font-bold focus:ring-primary/10"
                      placeholder="ReviewBoost AI"
                    />
                    <p className="text-[10px] font-bold text-gray-400 px-1 uppercase tracking-wider">{brandSettings.name.length}/60 characters</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Theme colors */}
            <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white/50 backdrop-blur-sm ring-1 ring-gray-100">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Theme colors</h3>
                  <p className="text-sm text-muted-foreground">Primary drives buttons & links. Accent is the soft background.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Primary color</Label>
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="w-14 h-14 rounded-xl overflow-hidden relative border border-gray-100 shadow-inner">
                      <input 
                        type="color" 
                        value={brandSettings.primaryColor}
                        onChange={(e) => setBrandSettings({...brandSettings, primaryColor: e.target.value})}
                        className="absolute inset-0 w-full h-full cursor-pointer scale-150 border-none outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-gray-900 uppercase tracking-wider">{brandSettings.primaryColor}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Primary</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Accent color</Label>
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="w-14 h-14 rounded-xl overflow-hidden relative border border-gray-100 shadow-inner">
                      <input 
                        type="color" 
                        value={brandSettings.accentColor}
                        onChange={(e) => setBrandSettings({...brandSettings, accentColor: e.target.value})}
                        className="absolute inset-0 w-full h-full cursor-pointer scale-150 border-none outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-gray-900 uppercase tracking-wider">{brandSettings.accentColor}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Accent</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* QR Code Color */}
            <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white/50 backdrop-blur-sm ring-1 ring-gray-100">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">QR code color</h3>
                  <p className="text-sm text-muted-foreground">Used on this business's QR. Pick something high-contrast.</p>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">QR color</Label>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm max-w-md">
                  <div className="w-14 h-14 rounded-xl overflow-hidden relative border border-gray-100 shadow-inner">
                    <input 
                      type="color" 
                      value={brandSettings.qrColor}
                      onChange={(e) => setBrandSettings({...brandSettings, qrColor: e.target.value})}
                      className="absolute inset-0 w-full h-full cursor-pointer scale-150 border-none outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-gray-900 uppercase tracking-wider">{brandSettings.qrColor}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">QR Code Color</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-6">
              <div className="flex items-center justify-between px-2">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Live preview</Label>
              </div>
              
              <Card className="p-10 rounded-[3rem] border-none shadow-2xl bg-white flex flex-col items-center">
                <div className="w-full aspect-[4/5] relative rounded-[2.5rem] bg-gray-50 border-8 border-gray-900 overflow-hidden shadow-inner">
                  {/* Status Bar */}
                  <div className="h-6 w-full flex items-center justify-between px-6 pt-2">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                    </div>
                    <div className="w-12 h-4 rounded-full bg-gray-200"></div>
                  </div>

                  {/* Content Preview */}
                  <div className="p-8 flex flex-col items-center text-center space-y-8 h-full">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: brandSettings.primaryColor }}>
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="text-xl font-black tracking-tight" style={{ color: brandSettings.primaryColor }}>
                        {brandSettings.name}
                      </span>
                    </div>

                    <div className="space-y-3 w-full">
                      <div className="h-14 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/20" style={{ backgroundColor: brandSettings.primaryColor }}>
                        Primary button
                      </div>
                      <div className="h-14 rounded-2xl flex items-center justify-center font-bold" style={{ backgroundColor: brandSettings.accentColor, color: brandSettings.primaryColor }}>
                        This is your accent surface.
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center pt-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">QR preview</p>
                      <div className="p-4 bg-white rounded-3xl shadow-sm">
                        <QRCodeSVG 
                          value="preview" 
                          size={120} 
                          fgColor={brandSettings.qrColor}
                          includeMargin={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center px-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Changes save to your browser per business. Customer review pages will use that business's brand.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
