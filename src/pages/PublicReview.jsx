import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateReviews } from '../lib/ai';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { 
  Loader2, 
  Sparkles, 
  Star, 
  Check, 
  ArrowLeft, 
  Copy, 
  Store 
} from 'lucide-react';
import { toast } from 'sonner';

const TypewriterText = ({ text, delay = 20 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

export const PublicReview = () => {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('rating'); // rating, feedback, ai-loading, ai-result, thank-you
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchBusiness();
  }, [businessId]);

  const fetchBusiness = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (error) throw error;
      setBusiness(data);
    } catch (error) {
      console.error(error);
      toast.error("Business not found");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (val) => {
    setRating(val);
    if (val <= 3) {
      setStep('feedback');
    } else {
      setStep('ai-loading');
      await handleGenerateAI(val);
    }
  };

  const handleGenerateAI = async (stars) => {
    setIsGenerating(true);
    try {
      const langInfo = business?.language && business.language !== 'English' 
        ? `Please write the review in ${business.language}.` 
        : '';
      const generated = await generateReviews(
        business.name, 
        business.category, 
        stars, 
        'friendly and natural. ' + langInfo
      );
      setAiSuggestions(generated);
      // Small delay to make the AI feel "thoughtful"
      setTimeout(() => setStep('ai-result'), 800);
    } catch (error) {
      setAiSuggestions(["Excellent service! Highly recommended.", "Loved the atmosphere and the staff was great.", "Best experience I've had in a long time."]);
      setStep('ai-result');
    } finally {
      setIsGenerating(false);
    }
  };

  const submitFeedback = async () => {
    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{
          business_id: businessId,
          rating,
          feedback_text: feedback,
        }]);

      if (error) throw error;
      toast.success("Thank you for your feedback!");
      setStep('thank-you');
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  const copyAndRedirect = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Review copied! Redirecting...");
    setTimeout(() => {
      if (business?.google_review_link) {
        window.location.href = business.google_review_link;
      }
    }, 1500);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!business) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
      <div className="text-center p-12 glass-panel border-none shadow-2xl max-w-md">
        <Store className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
        <h1 className="text-3xl font-black mb-4">Link Expired</h1>
        <p className="text-muted-foreground leading-relaxed">This review link is no longer active or the business has changed its configuration.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-lg relative">
        <div className="glass-panel border-none shadow-2xl p-6 sm:p-10 md:p-14 overflow-hidden animate-in fade-in zoom-in-95 duration-700 bg-white/40">
          {/* Progress Indicator */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100/50">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(103,61,230,0.5)]" 
              style={{ 
                width: step === 'rating' ? '20%' : 
                       step === 'feedback' || step === 'ai-loading' ? '60%' : 
                       '100%' 
              }}
            ></div>
          </div>

          <div className="text-center mb-8 md:mb-12 relative">
            <div className="p-3 md:p-4 bg-primary/5 rounded-2xl w-fit mx-auto mb-6 md:mb-8 animate-bounce transition-transform duration-500">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-3 md:mb-4 leading-tight">{business.name}</h1>
            <div className="min-h-[2.5rem] md:min-h-[3rem]">
              <p className="text-muted-foreground text-base md:text-lg font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
                {step === 'rating' && "How was your experience today?"}
                {step === 'feedback' && "We're sorry to hear that. How can we improve?"}
                {step === 'ai-loading' && "Our AI is crafting the perfect review for you..."}
                {step === 'ai-result' && "Boom! Here are some AI suggestions based on your visit."}
                {step === 'thank-you' && "Your feedback means the world to us."}
              </p>
            </div>
          </div>

          {step === 'rating' && (
            <div className="flex flex-col items-center gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex gap-1.5 sm:gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRatingSubmit(star)}
                    className="p-1 sm:p-2 transition-all duration-300 hover:scale-125 group active:scale-95 outline-none"
                  >
                    <Star 
                      className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 transition-all duration-500 ${
                        (hoverRating || rating) >= star 
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] md:drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" 
                        : "text-gray-200"
                      }`} 
                    />
                  </button>
                ))}
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Tap to Rate</p>
                <div className="h-1 w-8 bg-primary/20 rounded-full"></div>
              </div>
            </div>
          )}

          {step === 'feedback' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Your Message</Label>
                <Textarea 
                  placeholder="Tell us what went wrong..." 
                  className="min-h-[180px] rounded-[2rem] bg-white/60 border-gray-100 p-8 text-lg focus:bg-white transition-all shadow-inner border-none ring-1 ring-gray-100 focus:ring-primary/20"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
              <Button onClick={submitFeedback} className="w-full h-16 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                Send Private Feedback
              </Button>
            </div>
          )}

          {step === 'ai-loading' && (
            <div className="flex flex-col items-center py-12 space-y-12">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div className="space-y-4 text-center">
                <p className="text-xl font-black tracking-tight animate-pulse text-primary">Generating Perfection...</p>
                <div className="flex gap-3 justify-center">
                  <div className="w-3 h-3 bg-primary/30 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          {step === 'ai-result' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-12 duration-1000">
              <div className="grid gap-6">
                {aiSuggestions.map((text, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyAndRedirect(text)}
                    className="text-left p-8 glass-panel border-white/50 hover:border-primary/50 hover:bg-white transition-all group/sug animate-in fade-in slide-in-from-left-6 duration-700 shadow-sm hover:shadow-xl hover:scale-[1.02]"
                    style={{ animationDelay: `${idx * 200}ms` }}
                  >
                    <div className="flex justify-between items-start gap-6">
                      <p className="text-lg font-bold leading-relaxed group-hover/sug:text-primary transition-colors italic">
                        "<TypewriterText text={text} />"
                      </p>
                      <div className="p-3 bg-primary/5 rounded-2xl text-primary group-hover/sug:bg-primary group-hover/sug:text-white transition-all shadow-sm">
                        <Copy className="w-5 h-5" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="pt-6 text-center">
                <button 
                  onClick={() => setStep('rating')} 
                  className="text-sm font-black text-muted-foreground/60 hover:text-primary transition-colors flex items-center justify-center mx-auto gap-3 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  RE-RATE EXPERIENCE
                </button>
              </div>
            </div>
          )}

          {step === 'thank-you' && (
            <div className="text-center py-10 animate-in zoom-in-95 duration-700">
              <div className="w-28 h-28 bg-green-50 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 rotate-6 shadow-2xl shadow-green-100 border-4 border-white">
                <Check className="w-14 h-14" />
              </div>
              <h2 className="text-4xl font-black mb-6 tracking-tight">You're Awesome!</h2>
              <p className="text-muted-foreground text-xl mb-12 leading-relaxed">
                We've received your feedback. Our team will review it and get back to you if needed.
              </p>
              <Button onClick={() => setStep('rating')} variant="outline" className="h-14 px-10 rounded-2xl font-black text-lg border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition-all">
                Submit Another
              </Button>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/40 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-muted-foreground/20"></span>
            POWERED BY <Sparkles className="w-3 h-3 text-primary/40" /> REVIEWBOOSTER AI
            <span className="w-8 h-px bg-muted-foreground/20"></span>
          </p>
        </div>
      </div>
    </div>
  );
};
