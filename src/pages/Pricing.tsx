
import React from 'react';
import Navbar from '@/components/Navbar';
import PricingCard from '@/components/PricingCard';
import { Check, X } from 'lucide-react';

const Pricing = () => {
  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 99,
      billing: 'monthly' as const,
      description: 'Perfect for individuals',
      devices: 1,
      features: [
        { name: 'HD quality (720p)', included: true },
        { name: 'Watch on 1 device', included: true },
        { name: 'Ad-free viewing', included: true },
        { name: 'Cancel anytime', included: true },
        { name: 'Ultra HD (4K)', included: false },
        { name: 'Offline downloads', included: false },
      ],
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 129,
      billing: 'monthly' as const,
      description: 'Best for couples and roommates',
      devices: 2,
      popular: true,
      features: [
        { name: 'Full HD quality (1080p)', included: true },
        { name: 'Watch on 2 devices', included: true },
        { name: 'Ad-free viewing', included: true },
        { name: 'Cancel anytime', included: true },
        { name: 'Offline downloads', included: true },
        { name: 'Ultra HD (4K)', included: false },
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 299,
      billing: 'monthly' as const,
      description: 'The ultimate family package',
      devices: 4,
      features: [
        { name: 'Ultra HD quality (4K)', included: true },
        { name: 'Watch on 4 devices', included: true },
        { name: 'Ad-free viewing', included: true },
        { name: 'Cancel anytime', included: true },
        { name: 'Offline downloads', included: true },
        { name: 'Dolby Atmos audio', included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible plans tailored to your needs. No commitments, cancel anytime.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-center mb-10">Compare Plans</h2>
            
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-4xl mx-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3">Features</th>
                    <th scope="col" className="px-6 py-3 text-center">Basic</th>
                    <th scope="col" className="px-6 py-3 text-center">Standard</th>
                    <th scope="col" className="px-6 py-3 text-center">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-background border-b border-border">
                    <th scope="row" className="px-6 py-4 font-medium">Monthly price</th>
                    <td className="px-6 py-4 text-center">₹99</td>
                    <td className="px-6 py-4 text-center">₹129</td>
                    <td className="px-6 py-4 text-center">₹299</td>
                  </tr>
                  <tr className="bg-muted border-b border-border">
                    <th scope="row" className="px-6 py-4 font-medium">Number of devices</th>
                    <td className="px-6 py-4 text-center">1</td>
                    <td className="px-6 py-4 text-center">2</td>
                    <td className="px-6 py-4 text-center">4</td>
                  </tr>
                  <tr className="bg-background border-b border-border">
                    <th scope="row" className="px-6 py-4 font-medium">Video quality</th>
                    <td className="px-6 py-4 text-center">HD (720p)</td>
                    <td className="px-6 py-4 text-center">Full HD (1080p)</td>
                    <td className="px-6 py-4 text-center">Ultra HD (4K)</td>
                  </tr>
                  <tr className="bg-muted border-b border-border">
                    <th scope="row" className="px-6 py-4 font-medium">Ad-free viewing</th>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-accent mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-accent mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-accent mx-auto" />
                    </td>
                  </tr>
                  <tr className="bg-background border-b border-border">
                    <th scope="row" className="px-6 py-4 font-medium">Offline downloads</th>
                    <td className="px-6 py-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-accent mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-accent mx-auto" />
                    </td>
                  </tr>
                  <tr className="bg-muted border-b border-border">
                    <th scope="row" className="px-6 py-4 font-medium">Dolby Atmos audio</th>
                    <td className="px-6 py-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-5 w-5 text-accent mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-24 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6 text-left">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Can I switch plans?</h3>
                <p>Yes, you can switch your plan at any time. The new plan will be effective immediately, and we'll adjust your billing accordingly.</p>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p>We accept all major credit and debit cards, as well as select digital payment services and mobile payment options.</p>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">How do I cancel my subscription?</h3>
                <p>You can cancel your subscription at any time from your account settings. Your subscription will continue until the end of your current billing cycle.</p>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Can I share my account with friends or family?</h3>
                <p>Your subscription allows for a specific number of devices based on your plan. You can share your account with those in your household within the limits of your plan.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="bg-primary rounded-sm p-1">
                  <span className="text-white font-bold text-lg">PLEX</span>
                </div>
                <span className="font-bold text-lg tracking-tight">STREAM</span>
              </div>
              <p className="text-muted-foreground mt-4 max-w-md">
                PLEXSTREAM is a streaming service that offers a wide variety of TV shows, movies, anime, documentaries, and more.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Jobs</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Use</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Instagram</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Facebook</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-center text-muted-foreground text-sm">
              © {new Date().getFullYear()} PLEXSTREAM. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
