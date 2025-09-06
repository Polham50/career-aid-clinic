import React from 'react';
import { User, CareerProfile } from '../../types';
import ResultsPage from '../ResultsPage';
import Card from '../shared/Card';
import AssessmentPage from '../AssessmentPage';
import Chatbot from '../Chatbot';
import UpgradePrompt from './UpgradePrompt';
import { getChildren, addChild, ChildData } from '../../services/apiService';
import Spinner from '../shared/Spinner';

const ChildIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-6-6H6a6 6 0 00-6 6v2" /></svg>;
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

interface ParentDashboardProps {
  user: User;
  onSubmitAssessment: (answers: string[], childId?: string) => Promise<void>;
  error: string | null;
  onUpgrade: () => void;
  isSubscribed: boolean;
  onErrorAcknowledged: () => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ user, onSubmitAssessment, error, onUpgrade, isSubscribed, onErrorAcknowledged }) => {
  const [children, setChildren] = React.useState<ChildData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedChild, setSelectedChild] = React.useState<ChildData | null>(null);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = React.useState(false);
  const [newChildName, setNewChildName] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'recommendations' | 'assessment' | 'clinic'>('recommendations');
  const [localError, setLocalError] = React.useState<string | null>(null);

  const fetchChildrenData = React.useCallback(async () => {
    try {
        setIsLoading(true);
        const childrenData = await getChildren();
        setChildren(childrenData);
    } catch (err) {
        setLocalError(err instanceof Error ? err.message : 'Could not load children data.');
    } finally {
        setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchChildrenData();
  }, [fetchChildrenData]);

  const handleAddChildClick = () => {
    if (!isSubscribed && children.length >= 1) {
      onUpgrade();
    } else if (isSubscribed && children.length >= 5) {
      alert("You have reached the maximum of 5 children for your premium plan.");
    } else {
      setIsAddChildModalOpen(true);
    }
  };

  const handleAddChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newChildName.trim()) {
      try {
        const newChildUser = await addChild(newChildName.trim());
        const newChildForState: ChildData = {
          _id: newChildUser._id!,
          name: newChildUser.name,
          profiles: []
        };
        setChildren(prev => [...prev, newChildForState]);
        setNewChildName('');
        setIsAddChildModalOpen(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'An error occurred.');
      }
    }
  };

  const handleSubmitForSelectedChild = async (answers: string[]) => {
    if (selectedChild) {
      onErrorAcknowledged(); // Clear previous global errors
      try {
        await onSubmitAssessment(answers, selectedChild._id);
        // Refresh data to get the new profile
        await fetchChildrenData();
        // The useEffect below will update the selectedChild state
        setActiveTab('recommendations');
      } catch (err) {
        // Global error state is set by App.tsx, this component will react to it
      }
    }
  };
  
  // When children data is refetched, update the selected child's data as well
  React.useEffect(() => {
    if (selectedChild) {
        const updatedChild = children.find(c => c._id === selectedChild._id);
        if (updatedChild) {
            setSelectedChild(updatedChild);
        }
    }
  }, [children, selectedChild]);

  const renderAddChildModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
        <Card className="w-full max-w-md">
             <form onSubmit={handleAddChildSubmit} className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Add a New Child</h3>
                <p className="text-gray-500 mb-6">Enter your child's name to create a new profile for them.</p>
                 <div>
                    <label htmlFor="childName" className="block text-sm font-medium text-gray-600 mb-1">Child's Full Name</label>
                    <input 
                        type="text" 
                        id="childName" 
                        value={newChildName}
                        onChange={(e) => setNewChildName(e.target.value)}
                        required 
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" 
                    />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                     <button type="button" onClick={() => setIsAddChildModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
                     <button type="submit" className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700">Add Child</button>
                </div>
             </form>
        </Card>
    </div>
  );

  const renderErrorState = (errorMessage: string) => (
    <Card>
        <div className="p-8 text-center bg-white rounded-xl">
            <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">An Error Occurred</h2>
            <p className="text-red-600 bg-red-50 p-3 rounded-lg mb-6 max-w-xl mx-auto">
                {errorMessage}
            </p>
            <button
                onClick={() => {
                    if(error) onErrorAcknowledged();
                    if(localError) setLocalError(null);
                    setActiveTab('assessment');
                }}
                className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-700"
            >
                Try Assessment Again
            </button>
        </div>
    </Card>
  );

  const renderIndividualChildDashboard = (child: ChildData) => {
    if (error) {
        return renderErrorState(error);
    }
    
    const childProfile = child.profiles && child.profiles.length > 0 ? child.profiles[0] : null;

    const renderContent = () => {
        switch (activeTab) {
            case 'recommendations':
                return childProfile ? <ResultsPage profile={childProfile} /> : (
                    <Card><div className="p-8 text-center text-gray-500">No profile generated yet. Take the assessment to begin.</div></Card>
                );
            case 'assessment':
                return <AssessmentPage onSubmit={handleSubmitForSelectedChild} error={null} />; // Error is handled globally
            case 'clinic':
                if (!isSubscribed) return <UpgradePrompt featureName="Career Clinic" onUpgrade={onUpgrade} />;
                return childProfile ? <Chatbot careerProfile={childProfile} /> : (
                     <Card><div className="p-8 text-center text-gray-500">An assessment must be completed to use the Career Clinic.</div></Card>
                );
            default: return null;
        }
    };
    
    const NavButton: React.FC<{tab: 'recommendations' | 'assessment' | 'clinic', label: string, disabled?: boolean}> = ({ tab, label, disabled = false }) => (
        <button
            onClick={() => !disabled && setActiveTab(tab)}
            disabled={disabled}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${activeTab === tab ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {label}
        </button>
    );

    return (
      <div>
        <button onClick={() => setSelectedChild(null)} className="text-sm text-cyan-600 hover:text-cyan-500 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to All Children
        </button>
        <div className="flex flex-col md:flex-row md:space-x-8">
          <aside className="md:w-1/4 flex-shrink-0 mb-8 md:mb-0">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{child.name}'s Dashboard</h3>
              <nav className="space-y-2">
                  <NavButton tab="recommendations" label="Career Profile" disabled={!childProfile} />
                  <NavButton tab="assessment" label={childProfile ? 'Retake Assessment' : 'Take Assessment'} />
                  <NavButton tab="clinic" label="Career Clinic" disabled={!childProfile} />
              </nav>
          </aside>
          <main className="flex-grow md:w-3/4">
            {renderContent()}
          </main>
        </div>
      </div>
    );
  };
  
  const renderChildSelection = () => (
    <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {children.map(child => (
                <Card 
                    key={child._id} 
                    onClick={() => setSelectedChild(child)}
                    className="p-6 text-center transform hover:scale-105 hover:border-cyan-500 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer"
                >
                    <ChildIcon />
                    <h3 className="mt-4 text-xl font-bold text-gray-800">{child.name}</h3>
                    <p className={`mt-2 text-sm font-semibold ${child.profiles && child.profiles.length > 0 ? 'text-cyan-600' : 'text-orange-500'}`}>
                        {child.profiles && child.profiles.length > 0 ? 'Profile Ready' : 'Assessment Pending'}
                    </p>
                </Card>
            ))}
             <Card 
                onClick={handleAddChildClick}
                className="p-6 text-center transform hover:scale-105 hover:border-cyan-500 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed"
            >
                <AddIcon />
                <h3 className="mt-4 text-xl font-bold text-gray-600">Add Child</h3>
                <p className="mt-2 text-sm text-gray-400">
                    {isSubscribed ? `${5 - children.length} slots remaining` : 'Upgrade for more'}
                </p>
            </Card>
        </div>
    </div>
  );

  if (isLoading) {
    return <Spinner message="Loading your dashboard..." />;
  }
  
  if (localError) {
    return renderErrorState(localError);
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
            Parent Dashboard
        </h1>
        <p className="text-lg text-gray-500 mt-1">
            {selectedChild ? `Viewing profile for ${selectedChild.name}` : `Welcome, ${user.name}! Manage your children's progress.`}
        </p>
      </div>
      
      {isAddChildModalOpen && renderAddChildModal()}
      
      {selectedChild ? renderIndividualChildDashboard(selectedChild) : renderChildSelection()}
    </div>
  );
};

export default ParentDashboard;