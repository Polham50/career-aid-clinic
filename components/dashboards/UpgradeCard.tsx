
import React from 'react';
import Card from '../shared/Card';

interface UpgradeCardProps {
    onUpgrade: () => void;
}

const UpgradeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
    </svg>
);

const UpgradeCard: React.FC<UpgradeCardProps> = ({ onUpgrade }) => {
    return (
        <Card className="mt-8 border-orange-300">
            <div className="p-5">
                <h4 className="font-bold text-gray-800 flex items-center mb-2">
                    <UpgradeIcon />
                    Upgrade Your Plan
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                    Unlock unlimited assessments, custom roadmaps, and more powerful features.
                </p>
                <button 
                    onClick={onUpgrade}
                    className="w-full py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
                >
                    View Premium Plans
                </button>
            </div>
        </Card>
    );
};

export default UpgradeCard;