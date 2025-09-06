import React from 'react';
import Card from './shared/Card';
import { subscriptionPlans, CheckIcon } from '../constants';
import { SubscriptionPlan, User } from '../types';
import PaymentForm from './PaymentForm';

interface SubscriptionPageProps {
  user: User | null;
  onBack: () => void;
  onSubscriptionSuccess: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ user, onBack, onSubscriptionSuccess }) => {
  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionPlan | null>(null);

  const handleChoosePlan = (plan: SubscriptionPlan) => {
    if (!user) {
        alert("You must be logged in to subscribe.");
        return;
    }
    if (plan.price === "Contact Us") {
        alert("Please contact our sales team for custom pricing.");
        return;
    }
    setSelectedPlan(plan);
  };

  return (
    <>
      {selectedPlan && user && (
        <PaymentForm 
            user={user}
            plan={selectedPlan}
            onClose={() => setSelectedPlan(null)}
            onSuccess={() => {
                setSelectedPlan(null);
                onSubscriptionSuccess();
            }}
        />
      )}
      <div className="w-full max-w-7xl animate-fade-in-up">
          <div className="mb-8 text-center">
              <button onClick={onBack} className="text-sm text-cyan-600 hover:text-cyan-500 mb-6 flex items-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back to Dashboard
              </button>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                  Upgrade Your Experience
              </h1>
              <p className="mt-4 text-lg text-gray-600">Choose the plan that best fits your needs and unlock your full potential.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subscriptionPlans.map((plan, index) => (
                  <Card key={index} className={`flex flex-col relative ${plan.highlight ? 'border-cyan-500 ring-2 ring-cyan-500' : 'border-gray-200'}`}>
                      {plan.highlight && (
                      <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>
                      )}
                      <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                          <p className="text-sm text-gray-500 mb-6">{plan.audience}</p>
                          
                          <ul className="space-y-3 text-gray-600 flex-grow">
                              {plan.features.map((feature, i) => (
                                  <li key={i} className="flex items-start">
                                      <CheckIcon />
                                      <span>{feature}</span>
                                  </li>
                              ))}
                          </ul>

                              <div className="mt-8 text-center">
                              <p className="text-3xl font-bold text-gray-800">{plan.price}</p>
                              {plan.priceDetails && <p className="text-sm text-gray-500">{plan.priceDetails}</p>}
                              <button onClick={() => handleChoosePlan(plan)} className={`w-full mt-4 py-2 font-bold rounded-lg ${plan.highlight ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                  {plan.price === "Contact Us" ? 'Get in Touch' : 'Choose Plan'}
                              </button>
                          </div>
                      </div>
                  </Card>
              ))}
          </div>
      </div>
    </>
  );
};

export default SubscriptionPage;