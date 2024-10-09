import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestore } from '../firebase';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Check } from 'lucide-react';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      const plansSnapshot = await firestore.collection('plans').get();
      const plansData = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plan));
      setPlans(plansData);
    };

    const fetchCurrentPlan = async () => {
      if (user) {
        const userDoc = await firestore.collection('users').doc(user.uid).get();
        setCurrentPlan(userDoc.data()?.planId || null);
      }
    };

    fetchPlans();
    fetchCurrentPlan();
  }, [user]);

  const handleSubscribe = async (planId: string) => {
    if (!user) return;

    try {
      const docRef = await firestore.collection('checkout_sessions').add({
        userId: user.uid,
        planId: planId,
        success_url: window.location.origin + '/dashboard',
        cancel_url: window.location.origin + '/subscription',
      });

      const stripe = await stripePromise;
      const { sessionId } = (await docRef.get()).data() as { sessionId: string };
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Error:', error);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
            <p className="text-3xl font-bold mb-6">${plan.price}<span className="text-sm font-normal">/month</span></p>
            <ul className="mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center mb-2">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.id)}
              className={`w-full py-2 px-4 rounded-md ${
                currentPlan === plan.id
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              disabled={currentPlan === plan.id}
            >
              {currentPlan === plan.id ? (
                'Current Plan'
              ) : (
                <>
                  <CreditCard size={16} className="inline-block mr-2" />
                  Subscribe
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;