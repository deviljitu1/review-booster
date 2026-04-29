import React from 'react';
import { MainLayout } from '../components/MainLayout';
import { Card } from '../components/ui/card';
import { Inbox } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export const OrderHistory = () => {
  return (
    <MainLayout 
      title="Order History" 
      description="Every plan, payment and invoice — in one tidy place."
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-3xl font-black tracking-tight">Order History</h2>
        <p className="text-muted-foreground -mt-6">Your past payments will appear here.</p>

        <Card className="glass-panel border-none shadow-2xl p-20 flex flex-col items-center justify-center text-center bg-white/50 rounded-[3rem] min-h-[400px]">
          <div className="w-20 h-20 bg-blue-50 text-primary rounded-3xl flex items-center justify-center mb-8 shadow-inner">
            <Inbox className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-4">No Orders Found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-10 leading-relaxed font-medium">
            You're on the Free plan. <Link to="/pricing" className="text-primary font-bold hover:underline">Upgrade to Pro</Link> from the Pricing page to see invoices here.
          </p>
        </Card>
      </div>
    </MainLayout>
  );
};
