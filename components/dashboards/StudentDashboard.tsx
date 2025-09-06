import React from 'react';
import { User, CareerProfile } from '../../types';
import ResultsPage from '../ResultsPage';
import Card from '../shared/Card';
import AssessmentPage from '../AssessmentPage';
import Chatbot from '../Chatbot';
import UpgradeCard from './UpgradeCard';
import { HOLLAND_CODE_ICONS } from '../../constants';
import UpgradePrompt from './UpgradePrompt';

interface StudentDashboardProps {
  user: User;
  profiles: CareerProfile[];
  onSubmitAssessment: (answers: string[]) => Promise<void>;
  error: string | null;
  onUpgrade: () => void;
  onStartInterview: (careerName: string) => void;
  isSubscribed: boolean;
  redirectToRecommendations: boolean;
  onRedirectConsumed: () => void;
  onErrorAcknowledged: () => void;
}

type Tab = 'overview' | 'assessment' | 'recommendations' | 'clinic' | 'interview' | 'history';

interface Goal {
  id: number;
  text: string;
  completed: boolean;
}

const usePrevious = <T,>(value: T): T | undefined => {
    const ref = React.useRef<T | undefined>(undefined);
    React.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const ResourceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const ActionPlanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;


const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, profiles, onSubmitAssessment, error, onUpgrade, onStartInterview, isSubscribed, redirectToRecommendations, onRedirectConsumed, onErrorAcknowledged }) => {
  const [activeTab, setActiveTab] = React.useState<Tab>('overview');
  const [viewedProfile, setViewedProfile] = React.useState<CareerProfile | null>(null);

  const [goals, setGoals] = React.useState<Goal[]>([
      { id: 1, text: "Research UNILAG's Computer Science program", completed: false },
      { id: 2, text: "Watch a 'Day in the Life of a Software Engineer' video", completed: true },
  ]);
  const [newGoal, setNewGoal] = React.useState('');
  const prevProfilesLength = usePrevious(profiles.length);
  const latestProfile = profiles.length > 0 ? profiles[0] : null;

  React.useEffect(() => {
    // When profiles array is updated, view the latest one by default.
    if (profiles.length > 0) {
      setViewedProfile(profiles[0]);
    }
  }, [profiles]);

  React.useEffect(() => {
    // Do not redirect if there's an error; the error component will be shown instead.
    if (error) return;

    // When a user subscribes after an assessment, redirect them to the recommendations.
    // We must check isSubscribed here to prevent a race condition where the tab switches
    // before the component re-renders with the new subscription status.
    if (redirectToRecommendations && isSubscribed) {
      setActiveTab('recommendations');
      onRedirectConsumed(); // Consume the redirect so it doesn't happen again on re-render.
    } 
    // This handles the case for already-subscribed users finishing an assessment.
    else if (prevProfilesLength !== undefined && profiles.length > prevProfilesLength) {
      setActiveTab('recommendations');
    }
  }, [profiles.length, prevProfilesLength, redirectToRecommendations, onRedirectConsumed, isSubscribed, error]);


  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (newGoal.trim()) {
          setGoals([...goals, { id: Date.now(), text: newGoal.trim(), completed: false }]);
          setNewGoal('');
      }
  };

  const toggleGoal = (id: number) => {
      setGoals(goals.map(goal => goal.id === id ? { ...goal, completed: !goal.completed } : goal));
  };

  const renderFormattedSummary = (summary: string) => {
    if (!summary) return null;
    const parts = summary.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="font-semibold text-gray-700">{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );
  };

  const renderOverview = () => {
    if (!latestProfile) {
      return (
         <Card>
            <div className="p-8 text-center bg-white rounded-xl">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to your Dashboard!</h2>
              <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                This is your personal space to discover your career path. Get started by taking the assessment to unlock your personalized recommendations and chat with your AI career counselor.
              </p>
              <button
                onClick={() => setActiveTab('assessment')}
                className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transform hover:scale-105 transition-transform duration-300"
              >
                Take the Assessment Now
              </button>
            </div>
          </Card>
      );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-cyan-600 mb-4">Your Latest Personality Profile</h3>
                        <p className="text-gray-600 mb-4">{renderFormattedSummary(latestProfile.summary)}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            {latestProfile.topHollandCodes.map((code) => (
                                <div key={code.code} className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-center text-cyan-500 mb-2">
                                        {HOLLAND_CODE_ICONS[code.code]}
                                        <span className="ml-3 text-2xl font-bold">{code.code}</span>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-800">{code.name}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="p-6">
                        <div className="flex items-start space-x-4 mb-4">
                            <ResourceIcon />
                            <div>
                                <h3 className="text-xl font-semibold text-cyan-600">Resource Hub</h3>
                                <p className="text-sm text-gray-500">Essential links for your journey.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <a href="https://www.jamb.gov.ng/" target="_blank" rel="noopener noreferrer" className="bg-gray-50 p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors">JAMB Official Site &rarr;</a>
                            <a href="https://www.waecnigeria.org/" target="_blank" rel="noopener noreferrer" className="bg-gray-50 p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors">WAEC Nigeria Portal &rarr;</a>
                            <a href="#" className="bg-gray-50 p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors">Nigerian Scholarships &rarr;</a>
                            <a href="#" className="bg-gray-50 p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors">University Directory &rarr;</a>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                 <Card>
                    <div className="p-6">
                         <div className="flex items-start space-x-4 mb-4">
                            <ActionPlanIcon />
                            <div>
                                <h3 className="text-xl font-semibold text-cyan-600">Your Action Plan</h3>
                                <p className="text-sm text-gray-500">Turn insights into actions.</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {goals.map(goal => (
                                <div key={goal.id} className="flex items-center">
                                    <input type="checkbox" checked={goal.completed} onChange={() => toggleGoal(goal.id)} className="h-4 w-4 rounded bg-gray-200 border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                                    <span className={`ml-3 text-sm ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{goal.text}</span>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleAddGoal} className="mt-4 flex">
                            <input type="text" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="Add a new goal..." className="flex-grow bg-gray-100 border border-gray-300 text-gray-800 rounded-l-md py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            <button type="submit" className="bg-cyan-600 text-white font-bold rounded-r-md px-3 hover:bg-cyan-700 text-lg">+</button>
                        </form>
                    </div>
                </Card>
                 <Card>
                    <div className="p-6 h-full flex flex-col justify-between">
                         <h3 className="text-xl font-semibold text-cyan-600 mb-4">Quick Actions</h3>
                         <div className="space-y-4">
                            <button onClick={() => isSubscribed ? setActiveTab('recommendations') : onUpgrade()} className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                <div>
                                    <h4 className="font-semibold text-gray-800">View Recommendations</h4>
                                    <p className="text-sm text-gray-500">See all your career matches</p>
                                </div>
                            </button>
                             <button onClick={() => isSubscribed ? setActiveTab('clinic') : onUpgrade()} className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Go to Career Clinic</h4>
                                    <p className="text-sm text-gray-500">Ask the AI your questions</p>
                                </div>
                            </button>
                         </div>
                    </div>
                </Card>
            </div>
        </div>
    );
  };
  
  const renderInterview = (profile: CareerProfile) => {
    return (
        <Card>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-center text-cyan-600 mb-2">Mock Interview Practice</h3>
                <p className="text-center text-gray-500 mb-6">Prepare for your future. Select a career from your latest assessment to start a practice interview.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.recommendedCareers.map(career => (
                        <button 
                            key={career.careerName}
                            onClick={() => onStartInterview(career.careerName)}
                            className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors border border-gray-200"
                        >
                            <h4 className="font-semibold text-gray-800">{career.careerName}</h4>
                            <p className="text-sm text-cyan-600">Start Interview &rarr;</p>
                        </button>
                    ))}
                </div>
            </div>
        </Card>
    );
  };
  
  const renderHistory = () => (
    <Card>
        <div className="p-6">
            <h3 className="text-2xl font-bold text-center text-cyan-600 mb-2">Assessment History</h3>
            <p className="text-center text-gray-500 mb-6">Review your past assessments to see how your profile has evolved over time.</p>
            <div className="space-y-4">
                {profiles.map((p, index) => (
                    <button 
                        key={p.assessmentDate}
                        onClick={() => {
                            setViewedProfile(p);
                            setActiveTab('recommendations');
                        }}
                        className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between transition-colors border border-gray-200"
                    >
                        <div className="flex items-center">
                            <HistoryIcon />
                            <div>
                                <p className="font-semibold text-gray-800">
                                    Assessment #{profiles.length - index}
                                    {index === 0 && <span className="ml-2 text-xs font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full">Latest</span>}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Taken on {new Date(p.assessmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <span className="text-cyan-600 font-semibold text-sm">View Report &rarr;</span>
                    </button>
                ))}
            </div>
        </div>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'assessment':
        return <AssessmentPage onSubmit={onSubmitAssessment} error={error} />;
      case 'recommendations':
        if (!isSubscribed) {
            return <UpgradePrompt featureName="Career Recommendations" onUpgrade={onUpgrade} />;
        }
        return viewedProfile ? <ResultsPage profile={viewedProfile} /> : <p className="text-center p-8">Complete the assessment to see your recommendations.</p>;
      case 'history':
        if (!isSubscribed) return <UpgradePrompt featureName="Assessment History" onUpgrade={onUpgrade} />;
        return renderHistory();
      case 'clinic':
        if (!isSubscribed) return <UpgradePrompt featureName="Career Clinic" onUpgrade={onUpgrade} />;
        return latestProfile ? <Chatbot careerProfile={latestProfile} /> : <p className="text-center p-8">Complete the assessment to access the Career Clinic.</p>;
      case 'interview':
        if (!isSubscribed) return <UpgradePrompt featureName="Mock Interviews" onUpgrade={onUpgrade} />;
        return latestProfile ? renderInterview(latestProfile) : <p className="text-center p-8">Complete the assessment to practice interviews.</p>;
      default:
        return null;
    }
  };
  
  const NavButton: React.FC<{tab: Tab, label: string, disabled?: boolean}> = ({ tab, label, disabled = false }) => {
    const lockedTabsForFreeUsers: Tab[] = ['recommendations', 'history', 'clinic', 'interview'];
    const isLocked = !isSubscribed && lockedTabsForFreeUsers.includes(tab);

    return (
     <button
        onClick={() => {
            if (disabled) return;
            if (isLocked) {
                onUpgrade();
            } else {
                setActiveTab(tab);
            }
        }}
        disabled={disabled}
        className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors relative ${
            activeTab === tab 
                ? 'bg-cyan-600 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {label}
        {isLocked && !disabled && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            </span>
        )}
    </button>
    );
  };

  const renderErrorState = () => (
    <Card>
        <div className="p-8 text-center bg-white rounded-xl">
            <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">We Couldn't Generate Your Profile</h2>
            <p className="text-red-600 bg-red-50 p-3 rounded-lg mb-6 max-w-xl mx-auto">
                {error}
            </p>
            <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                Please try the assessment again. If the problem persists, please contact support.
            </p>
            <button
                onClick={() => {
                  onErrorAcknowledged();
                  setActiveTab('assessment');
                }}
                className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
                Try Assessment Again
            </button>
        </div>
    </Card>
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
       <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                Student Dashboard
            </h1>
            <p className="text-lg text-gray-500 mt-1">Welcome, {user.name}! Your career journey starts here.</p>
       </div>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <aside className="md:w-1/4 flex-shrink-0 mb-8 md:mb-0">
          <nav className="space-y-2">
            <NavButton tab="overview" label="Overview" />
            <NavButton tab="assessment" label={profiles.length > 0 ? 'Retake Assessment' : 'Start Assessment'} />
            <NavButton tab="recommendations" label="Recommendations" disabled={!latestProfile} />
            <NavButton tab="history" label="Assessment History" disabled={!latestProfile} />
            <NavButton tab="clinic" label="Career Clinic" disabled={!latestProfile} />
            <NavButton tab="interview" label="Mock Interview" disabled={!latestProfile} />
          </nav>
          {!isSubscribed && <UpgradeCard onUpgrade={onUpgrade} />}
        </aside>
        <main className="flex-grow md:w-3/4">
          {error ? renderErrorState() : renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;