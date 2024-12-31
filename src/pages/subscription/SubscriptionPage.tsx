import React, { useState } from 'react';
import { Calendar, Users, Building2, Star } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';

const PLANS = {
  basic: {
    title: 'Basic Plan',
    price: 50,
    features: [
      'Unlimited property listings',
      'Smart scheduling system',
      'Basic analytics',
      'Email support'
    ],
    paymentLink: 'https://buy.stripe.com/3cs01E2wmdJca084gh'
  },
  premium: {
    title: 'Premium Plan',
    price: 75,
    features: [
      'Everything in Basic',
      'Open house management',
      'Advanced analytics',
      'Priority support',
      'Custom branding'
    ],
    paymentLink: 'https://buy.stripe.com/6oEg0C1sibB4c8g5km'
  }
};

export function SubscriptionPage() {
  const { user } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = () => {
    try {
      if (!user) {
        throw new Error('Please log in to subscribe');
      }
      window.location.href = PLANS[selectedPlan].paymentLink;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process subscription');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">Select the plan that best fits your needs</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(PLANS).map(([key, plan]) => (
            <div
              key={key}
              className={`bg-white rounded-xl shadow-lg p-8 border-2 transition-all ${
                selectedPlan === key 
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
                  : 'border-transparent hover:border-gray-200'
              }`}
              onClick={() => setSelectedPlan(key as 'basic' | 'premium')}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600 mb-1">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={handleSubscribe}
                className="w-full"
                variant={selectedPlan === key ? 'primary' : 'outline'}
              >
                Select {plan.title}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}