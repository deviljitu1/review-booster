import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger 
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Store, Plus, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const Dashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBusiness, setNewBusiness] = useState({ name: '', category: '', googleLink: '', language: 'English' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      toast.error('Failed to fetch businesses');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('businesses')
        .insert([{
          user_id: user.id,
          name: newBusiness.name,
          category: newBusiness.category,
          google_review_link: newBusiness.googleLink,
          language: newBusiness.language
        }])
        .select();

      if (error) throw error;
      
      toast.success('Business created successfully!');
      setIsDialogOpen(false);
      setNewBusiness({ name: '', category: '', googleLink: '', language: 'English' });
      setBusinesses([data[0], ...businesses]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <MainLayout 
      title="Smart Review AI" 
      description="AI-powered review suggestions for modern businesses."
    >
      <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Your businesses</h2>
            <p className="text-muted-foreground mt-1 font-medium text-sm md:text-base">Each business gets its own QR code and AI review studio.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto h-12 px-8 rounded-2xl shadow-lg shadow-primary/20 font-bold hover:scale-[1.02] transition-all">
                <Plus className="w-5 h-5 mr-2" />
                New business
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] p-10 border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight">Add Business</DialogTitle>
                <DialogDescription className="text-base pt-2 text-muted-foreground font-medium">
                  Connect a new location to start boosting your reviews.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateBusiness} className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Business Name</Label>
                  <Input 
                    placeholder="e.g. Luxury Spa & Cafe" 
                    className="h-14 rounded-2xl bg-gray-50 border-none font-bold placeholder:text-gray-300"
                    value={newBusiness.name}
                    onChange={(e) => setNewBusiness({...newBusiness, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Category</Label>
                  <Input 
                    placeholder="e.g. Wellness" 
                    className="h-14 rounded-2xl bg-gray-50 border-none font-bold placeholder:text-gray-300"
                    value={newBusiness.category}
                    onChange={(e) => setNewBusiness({...newBusiness, category: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Google Review Link</Label>
                  <Input 
                    placeholder="https://g.page/r/..." 
                    className="h-14 rounded-2xl bg-gray-50 border-none font-bold placeholder:text-gray-300"
                    value={newBusiness.googleLink}
                    onChange={(e) => setNewBusiness({...newBusiness, googleLink: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <Button type="submit" className="w-full h-16 rounded-2xl shadow-xl shadow-primary/20 font-black text-lg" disabled={isSubmitting || !newBusiness.name}>
                    {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                    Create Location
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-24 glass-panel border-none shadow-xl bg-white/50 rounded-[3rem] animate-in zoom-in-95 duration-500">
            <div className="mx-auto w-20 h-20 bg-primary/5 text-primary rounded-3xl flex items-center justify-center mb-8 rotate-3">
              <Store className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-4">No businesses yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-10 leading-relaxed font-medium">
              Add your first business to generate your unique QR code and start collecting 5-star reviews.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="rounded-full px-10 h-14 font-bold shadow-lg shadow-primary/20">
              Get Started Now
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((biz, idx) => (
              <Link 
                to={`/dashboard/business/${biz.id}`} 
                key={biz.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <Card className="hover:scale-[1.03] transition-all duration-300 p-8 rounded-[2.5rem] border-none shadow-lg hover:shadow-xl bg-white group cursor-pointer relative overflow-hidden h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="px-3 py-1 bg-blue-50 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {biz.category || 'Other'}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-black tracking-tight mb-2 truncate group-hover:text-primary transition-colors">
                      {biz.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground font-medium mt-auto">
                      Added {new Date(biz.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
