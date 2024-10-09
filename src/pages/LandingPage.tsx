import React from 'react';
import { Link } from 'react-router-dom';
import { Camera360, Split, Tag, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Create Stunning Virtual Tours</h1>
          <p className="text-xl mb-8">Upload 360° images, compare tours, and collaborate with ease.</p>
          <Link to="/auth" className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-100 transition duration-300">
            Get Started
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Camera360 size={48} />}
              title="360° Image Upload"
              description="Easily upload and create virtual tours from your 360° images."
            />
            <FeatureCard
              icon={<Split size={48} />}
              title="Side-by-Side Comparison"
              description="Compare multiple tours in a split-screen view for easy analysis."
            />
            <FeatureCard
              icon={<Tag size={48} />}
              title="Interactive Comments"
              description="Add and view comments as tags within the virtual tour."
            />
            <FeatureCard
              icon={<Users size={48} />}
              title="Team Collaboration"
              description="Invite team members and collaborate on projects in real-time."
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-200 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Basic"
              price="$9.99"
              features={['5 projects', '100 360° images', 'Basic support']}
            />
            <PricingCard
              title="Pro"
              price="$24.99"
              features={['Unlimited projects', '500 360° images', 'Priority support', 'Advanced analytics']}
              highlighted={true}
            />
            <PricingCard
              title="Enterprise"
              price="Custom"
              features={['Unlimited everything', '24/7 support', 'Custom integrations', 'Dedicated account manager']}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const PricingCard: React.FC<{ title: string; price: string; features: string[]; highlighted?: boolean }> = ({ title, price, features, highlighted }) => (
  <div className={`bg-white p-8 rounded-lg shadow-md ${highlighted ? 'border-4 border-blue-500' : ''}`}>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-4xl font-bold mb-6">{price}<span className="text-sm font-normal">/month</span></p>
    <ul className="mb-8">
      {features.map((feature, index) => (
        <li key={index} className="mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <Link to="/auth" className={`block w-full text-center py-2 px-4 rounded ${highlighted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-opacity-80 transition duration-300`}>
      Choose Plan
    </Link>
  </div>
);

export default LandingPage;