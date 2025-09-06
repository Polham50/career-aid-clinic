
import React from 'react';
import Card from '../shared/Card';

interface UpgradePromptProps {
    featureName: string;
    onUpgrade: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ featureName, onUpgrade }) => {
    return (
        <Card>
            <div className="p-8 text-center bg-white rounded-xl">
                <div className="flex justify-center mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Upgrade to Access {featureName}</h2>
                <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                    This is a premium feature. Subscribe to a plan to unlock full access to career recommendations, AI-powered tools, and much more.
                </p>
                <button
                    onClick={onUpgrade}
                    className="px-8 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transform hover:scale-105 transition-transform duration-300"
                >
                    View Premium Plans
                </button>
            </div>
        </Card>
    );
};

export default UpgradePrompt;
