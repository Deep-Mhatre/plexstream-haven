
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  description: string;
  features: PricingFeature[];
  devices: number;
  popular?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
}

const PricingCard = ({ plan }: PricingCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSelectPlan = () => {
    // In a real app, this would navigate to checkout or subscription page
    if (!isAuthenticated) {
      navigate('/register');
    } else {
      // Mock implementation - would integrate with a payment gateway in real app
      alert(`You selected the ${plan.name} plan`);
    }
  };

  return (
    <div 
      className={`rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col border ${
        plan.popular 
          ? 'border-accent shadow-lg shadow-accent/10 scale-105 z-10 relative' 
          : 'border-border hover:border-accent/50'
      }`}
    >
      {plan.popular && (
        <div className="bg-accent py-1 px-4 text-white text-sm font-medium text-center">
          Most Popular
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold">{plan.name}</h3>
        <p className="text-muted-foreground text-sm mt-2 mb-4">{plan.description}</p>
        
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">₹{plan.price}</span>
            <span className="text-muted-foreground ml-1">/{plan.billing}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">For {plan.devices} {plan.devices === 1 ? 'device' : 'devices'}</p>
        </div>
        
        <div className="space-y-3 flex-1">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              {feature.included ? (
                <Check className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
              )}
              <span className={feature.included ? '' : 'text-muted-foreground'}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>
        
        <Button 
          className={`mt-6 w-full ${plan.popular ? '' : 'bg-primary/90 hover:bg-primary'}`}
          onClick={handleSelectPlan}
        >
          {isAuthenticated ? 'Select Plan' : 'Get Started'}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;
