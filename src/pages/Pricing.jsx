import React from 'react';
import { MainLayout } from '../components/MainLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Check, X, Sparkles } from 'lucide-react';

export const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "/ month",
      features: [
        "Unlimited QR Scans",
        "AI Generated (2 Review Suggestions)",
        "Editable Keywords",
        { text: "Use Brand Name in Keyword", included: false },
        { text: "Smart SEO Friendly Reply", included: false },
        { text: "Multi-language Support", included: false },
        { text: "Tone Customization", included: false },
        { text: "Free Website", included: false },
        { text: "Included Future Updates", included: false },
      ],
      current: true,
    },
    {
      name: "Pro Monthly",
      price: "₹149",
      originalPrice: "₹449",
      period: "/ month",
      features: [
        "Unlimited QR Scans",
        "AI Generated 5 Review Suggestions",
        "Editable Keywords",
        "Use Brand Name in Keyword",
        "Smart SEO Friendly Reply",
        "Multi-language Support",
        "Tone Customization",
        "Free Website",
        "Included Future Updates",
      ],
      current: false,
    },
    {
      name: "Pro 6-Month",
      price: "₹449",
      originalPrice: "₹1499",
      period: "/ 6 months",
      features: [
        "Unlimited QR Scans",
        "AI Generated 5 Review Suggestions",
        "Editable Keywords",
        "Use Brand Name in Keyword",
        "Smart SEO Friendly Reply",
        "Multi-language Support",
        "Tone Customization",
        "Free Website",
        "Included Future Updates",
      ],
      current: false,
    },
    {
      name: "Pro Yearly",
      price: "₹999",
      originalPrice: "₹2499",
      period: "/ year",
      features: [
        "Unlimited QR Scans",
        "AI Generated 5 Review Suggestions",
        "Editable Keywords",
        "Use Brand Name in Keyword",
        "Smart SEO Friendly Reply",
        "Multi-language Support",
        "Tone Customization",
        "Free Website",
        "Included Future Updates",
      ],
      current: false,
      bestValue: true,
    }
  ];

  return (
    <MainLayout 
      title="Pricing" 
      description="Simple plans. Powerful AI. Pick what fits your business stage."
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900">Plans & Pricing</h2>
            <p className="text-muted-foreground mt-2 font-medium text-sm md:text-base">Save more with longer commitments.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <Card key={plan.name} className={`relative flex flex-col p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-none shadow-xl transition-all hover:scale-[1.02] ${plan.bestValue ? 'ring-2 ring-primary bg-white shadow-primary/10' : 'bg-white'}`}>
              {plan.bestValue && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                  <Sparkles className="w-3 h-3" />
                  Best Value
                </div>
              )}
              
              <div className="text-center mb-6 md:mb-8">
                <h3 className="text-xl font-bold mb-4 md:mb-6">{plan.name}</h3>
                <div className="flex flex-col items-center">
                  {plan.originalPrice && (
                    <span className="text-muted-foreground line-through text-xs md:text-sm mb-1">{plan.originalPrice} / month</span>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-black text-green-600">{plan.price}</span>
                    <span className="text-muted-foreground text-sm font-medium">{plan.period}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-1">
                {plan.features.map((feature, idx) => {
                  const isObject = typeof feature === 'object';
                  const text = isObject ? feature.text : feature;
                  const included = isObject ? feature.included : true;

                  return (
                    <div key={idx} className="flex items-start gap-3">
                      {included ? (
                        <div className="p-0.5 rounded-full bg-green-50 text-green-500 shrink-0">
                          <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                      ) : (
                        <div className="p-0.5 rounded-full bg-red-50 text-red-300 shrink-0">
                          <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                      )}
                      <span className={`text-sm md:text-sm font-medium ${included ? 'text-gray-700' : 'text-gray-300'}`}>
                        {text}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Button 
                variant={plan.current ? "outline" : "default"} 
                className={`w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-black text-base md:text-lg transition-all ${
                  plan.current 
                  ? "border-gray-100 bg-gray-50 text-gray-400 cursor-default" 
                  : "shadow-lg shadow-primary/20 hover:shadow-xl"
                }`}
              >
                {plan.current ? "Current" : "Upgrade"}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
