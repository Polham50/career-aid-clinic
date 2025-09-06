
import React from 'react';
import Card from './shared/Card';
import { subscriptionPlans, CheckIcon } from '../constants';

interface HomePageProps {
  onStart: () => void;
}

const StepIcon1 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const StepIcon2 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const StepIcon3 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);


const FeatureIcon1 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l-3 3m6 0l-3-3m-3 12l3 3m-6 0l3-3M6.343 12.343A8 8 0 1117.657 12a8.001 8.001 0 01-11.314-.657z" />
    </svg>
);

const FeatureIcon2 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l.523-.872a.5.5 0 01.872.523l-.523.872a.5.5 0 01-.872-.523zM11 21l-1-4-1 4M14 21l1-4 1 4M4.5 11l-1.5 6M20.5 11l1.5 6" />
        <path d="M12 3v1m0 16v1" />
    </svg>
);

const FeatureIcon3 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const FeatureIcon4 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 3l6-3m0 0l-6-3m6 3v10" />
    </svg>
);

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="relative w-full space-y-20 md:space-y-28 mb-24 overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5 pointer-events-none">
            <img src="/public/assets/logo.png" alt="background logo" className="w-2/3 md:w-1/2 h-auto" />
        </div>

      {/* Hero Section */}
      <section className="relative z-10 text-center animate-fade-in-up">
        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
          Welcome to CareerAid Clinic
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-700">...smart choices, brighter tomorrow!</p>
        <p className="mt-6 max-w-2xl mx-auto text-gray-600 text-sm md:text-base">
          Discover your true potential. Our AI-powered assessment will help you understand your personality, explore matching career paths, and find the right academic journey in the Nigerian context.
        </p>
        <button
          onClick={onStart}
          className="mt-8 px-8 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transform hover:scale-105 transition-transform duration-300"
        >
          Get Started For Free
        </button>
      </section>

      {/* How It Works Section */}
       <section className="relative z-10 w-full max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">
                Your Journey to Career Clarity
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">In just a few minutes, gain insights that will shape your future. Here’s how it works.</p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="bg-white rounded-full p-4 mb-4 border border-gray-200"><StepIcon1 /></div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">1. Take the Quick Assessment</h3>
                    <p className="text-gray-600 text-sm">Answer simple, intuitive questions about your interests and personality. No wrong answers!</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-white rounded-full p-4 mb-4 border border-gray-200"><StepIcon2 /></div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">2. Receive Your AI Profile</h3>
                    <p className="text-gray-600 text-sm">Get a detailed breakdown of your personality type and a list of careers that match you.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-white rounded-full p-4 mb-4 border border-gray-200"><StepIcon3 /></div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">3. Explore & Plan Your Future</h3>
                    <p className="text-gray-600 text-sm">Use your dashboard and AI chatbot to ask questions and map out your academic and career steps.</p>
                </div>
            </div>
        </section>

        {/* Features Section */}
         <section className="relative z-10 w-full max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '400ms' }}>
             <h2 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">
                Why Choose Us?
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Go beyond generic advice with a platform built for your success in Nigeria.</p>
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                    <div className="flex items-start space-x-4">
                        <FeatureIcon1 />
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">AI-Powered Personalization</h3>
                            <p className="text-gray-600 text-sm">Our smart algorithm analyzes your unique traits to provide recommendations that truly fit.</p>
                        </div>
                    </div>
                </Card>
                 <Card className="p-6">
                    <div className="flex items-start space-x-4">
                        <FeatureIcon2 />
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Hyper-Localised for Nigeria</h3>
                            <p className="text-gray-600 text-sm">Career data, salary estimates, and university course suggestions are all tailored to the Nigerian context.</p>
                        </div>
                    </div>
                </Card>
                 <Card className="p-6">
                    <div className="flex items-start space-x-4">
                        <FeatureIcon3 />
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Interactive Career Clinic</h3>
                            <p className="text-gray-600 text-sm">Have a question? Chat with our Career Clinic AI 24/7 to get instant, personalized guidance.</p>
                        </div>
                    </div>
                </Card>
                 <Card className="p-6">
                    <div className="flex items-start space-x-4">
                        <FeatureIcon4 />
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Clear Academic Roadmaps</h3>
                            <p className="text-gray-600 text-sm">We bridge the gap between your career aspirations and education, suggesting the right courses to study.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </section>


      {/* Subscription Plans Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-12">
                Find a Plan That's Right For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subscriptionPlans.map((plan, index) => (
                    <Card key={index} className={`flex flex-col relative ${plan.highlight ? 'border-cyan-500 ring-2 ring-cyan-500' : 'border-gray-200'}`}>
                       {plan.highlight && (
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>
                       )}
                        <div className="p-6 flex-grow flex flex-col">
                            <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                            <p className="text-sm text-gray-500 mb-6">{plan.audience}</p>
                            
                            <ul className="space-y-3 text-gray-600 text-sm flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <CheckIcon />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                             <div className="mt-8 text-center">
                                <p className="text-2xl font-bold text-gray-800">{plan.price}</p>
                                {plan.priceDetails && <p className="text-sm text-gray-500">{plan.priceDetails}</p>}
                                <button onClick={onStart} className={`w-full mt-4 py-2 font-bold rounded-lg ${plan.highlight ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                  {plan.price === "Contact Us" ? 'Get in Touch' : 'Get Started'}
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative z-10 text-center animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">
                Ready to Discover Your Perfect Career?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-gray-600">
                Your future starts now. Take the first step with our free, insightful assessment and unlock a world of possibilities tailored just for you.
            </p>
             <button
                onClick={onStart}
                className="mt-8 px-8 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transform hover:scale-105 transition-transform duration-300"
                >
                Get Started For Free
            </button>
        </section>
    </div>
  );
};

export default HomePage;