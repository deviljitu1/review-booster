import React, { useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { 
  Sparkles, 
  MessageSquare, 
  Copy, 
  Check, 
  RotateCcw, 
  Send,
  Loader2,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { generateReply } from '../lib/ai';

export const SmartReply = () => {
  const [review, setReview] = useState('');
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleGenerate = async () => {
    if (!review.trim()) {
      toast.error('Please enter a review to generate replies');
      return;
    }

    setLoading(true);
    try {
      const generatedReplies = await generateReply(review, {
        tone: 'professional',
        brandName: 'ReviewBoost AI'
      });
      setReplies(generatedReplies);
      toast.success('AI magic complete!');
    } catch (error) {
      toast.error('Failed to generate replies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearAll = () => {
    setReview('');
    setReplies([]);
  };

  return (
    <MainLayout 
      title="Smart Reply" 
      description="Professional AI-generated responses to your customer reviews."
    >
      <div className="max-w-5xl space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">AI Reply Studio</h2>
            <p className="text-muted-foreground mt-1 font-medium text-sm md:text-base">Draft perfect responses in seconds, not minutes.</p>
          </div>
          
          {review && (
            <Button variant="ghost" onClick={clearAll} className="w-full sm:w-auto text-red-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-2xl">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <Card className="glass-panel border-none shadow-2xl p-6 md:p-10 bg-white/80 rounded-[2.5rem] md:rounded-[3rem]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Paste Customer Review</Label>
                  <Textarea 
                    placeholder="Enter the customer review here..." 
                    className="min-h-[200px] md:min-h-[250px] rounded-[1.5rem] md:rounded-[2rem] bg-gray-50/50 border-none p-6 md:p-8 font-medium text-base md:text-lg leading-relaxed focus-visible:ring-primary/20 resize-none shadow-inner"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={loading || !review.trim()}
                  className="w-full h-16 md:h-20 rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-primary/20 font-black text-lg md:text-xl gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Generate Smart Replies
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <div className="px-6 py-8 rounded-[2.5rem] bg-blue-50/50 border border-blue-100/50 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900 mb-1">Pro Tip</p>
                <p className="text-xs text-blue-700/70 font-medium leading-relaxed">
                  The AI understands context and sentiment. It will automatically adjust its tone based on the review's star rating.
                </p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 space-y-6">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
              AI Suggestions {replies.length > 0 && `(${replies.length})`}
            </Label>

            {replies.length === 0 ? (
              <Card className="glass-panel border-none shadow-xl p-16 flex flex-col items-center justify-center text-center bg-white/40 rounded-[3rem] min-h-[400px]">
                <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mb-8">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-400 mb-4">No suggestions yet</h3>
                <p className="text-gray-400 max-w-xs mx-auto font-medium leading-relaxed">
                  Enter a customer review on the left to see professional AI-crafted responses here.
                </p>
              </Card>
            ) : (
              <div className="space-y-6">
                {replies.map((reply, i) => (
                  <Card key={i} className="glass-panel border-none shadow-xl p-8 bg-white/90 rounded-[2.5rem] group hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Suggestion {i + 1}
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => copyToClipboard(reply, i)}
                        className={`rounded-2xl h-10 w-10 transition-all ${copiedId === i ? 'bg-green-100 text-green-600' : 'bg-gray-50 hover:bg-primary/10 hover:text-primary'}`}
                      >
                        {copiedId === i ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </Button>
                    </div>
                    <p className="text-lg font-medium leading-relaxed text-gray-800">
                      {reply}
                    </p>
                  </Card>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={handleGenerate}
                  className="w-full h-16 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-gray-400 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Generate more options
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
