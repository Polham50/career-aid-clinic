import React from 'react';
import { User, CareerProfile } from '../../types';
import Card from '../shared/Card';
import ResultsPage from '../ResultsPage';
import AssessmentPage from '../AssessmentPage';
import Chatbot from '../Chatbot';
import UpgradeCard from './UpgradeCard';

interface CbtCentreDashboardProps {
  user: User;
  profiles: CareerProfile[];
  onSubmitAssessment: (answers: string[]) => Promise<void>;
  error: string | null;
  onUpgrade: () => void;
  onStartInterview: (careerName: string) => void;
}

type Tab = 'overview' | 'codeManager' | 'support' | 'assessment' | 'recommendations' | 'clinic';

const usePrevious = <T,>(value: T): T | undefined => {
    const ref = React.useRef<T | undefined>(undefined);
    React.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

interface AccessCode {
    code: string;
    status: 'Used' | 'Available';
    createdAt: string;
    usedBy?: string;
}

const mockAccessCodes: AccessCode[] = [
    { code: 'JAMB-C8XF-2A9B', status: 'Used', createdAt: '2024-07-20', usedBy: 'Student ID 1023' },
    { code: 'JAMB-K9B3-L1C4', status: 'Used', createdAt: '2024-07-20', usedBy: 'Student ID 1024' },
    { code: 'JAMB-P5G7-H4D5', status: 'Available', createdAt: '2024-07-21' },
    { code: 'JAMB-Z2V6-J9E6', status: 'Used', createdAt: '2024-07-21', usedBy: 'Student ID 1025' },
    { code: 'JAMB-R4N1-M5F7', status: 'Available', createdAt: '2024-07-22' },
    { code: 'JAMB-A3B8-K2G8', status: 'Available', createdAt: '2024-07-22' },
];

const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 017.743-5.743z" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const LightbulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;

const mockUsageData = [
    { month: 'Jan', count: 2100 },
    { month: 'Feb', count: 2800 },
    { month: 'Mar', count: 3500 },
    { month: 'Apr', count: 3200 },
    { month: 'May', count: 4100 },
    { month: 'Jun', count: 3402 },
];

const faqQuestions: { [key: string]: string } = {
    'cs_vs_se': "<strong>Computer Science</strong> is broader, focusing on theory, algorithms, and computation. <strong>Software Engineering</strong> is more specific, applying engineering principles to the design, development, and maintenance of software systems. Think of a computer scientist as an architect who understands the physics of a building, and a software engineer as the civil engineer who actually builds it.",
    'jamb_scores': "JAMB scores for competitive courses like Medicine or Law at top federal universities often need to be <strong>280 and above</strong>. For Engineering or Sciences, a score of <strong>240-270</strong> is typically competitive. However, this varies greatly by university and year, so it's crucial to check with the specific institution.",
    'marketable_skills': "Currently in Nigeria, skills in high demand include: <strong>Digital Marketing</strong>, <strong>Data Analysis</strong>, <strong>UI/UX Design</strong>, <strong>Mobile App Development (especially Android)</strong>, and <strong>Cybersecurity</strong>. Vocational skills like fashion design and modern agriculture are also very valuable."
};

const CbtCentreDashboard: React.FC<CbtCentreDashboardProps> = ({ user, profiles, onSubmitAssessment, error, onUpgrade }) => {
  const [activeTab, setActiveTab] = React.useState<Tab>('overview');
  const [faqQuery, setFaqQuery] = React.useState('cs_vs_se');
  const [faqResponse, setFaqResponse] = React.useState('');
  const prevProfilesLength = usePrevious(profiles.length);

  const latestProfile = profiles.length > 0 ? profiles[0] : null;

  React.useEffect(() => {
    if (prevProfilesLength === 0 && profiles.length > 0) {
      setActiveTab('recommendations');
    }
  }, [profiles, prevProfilesLength]);

  const profileExists = !!latestProfile;
  
  const handleGetFaqAnswer = () => {
    setFaqResponse(faqQuestions[faqQuery]);
  };

  const renderOverview = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <Card className="p-6">
                <p className="text-sm font-medium text-gray-500">Assessments Used (This Month)</p>
                <p className="text-4xl font-bold text-cyan-600">3,402</p>
            </Card>
            <Card className="p-6">
                <p className="text-sm font-medium text-gray-500">Total Assessments Used</p>
                <p className="text-4xl font-bold text-gray-800">27,198</p>
            </Card>
            <Card className="p-6">
                <p className="text-sm font-medium text-gray-500">Licenses Remaining</p>
                <p className="text-4xl font-bold text-orange-500">1,598</p>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
                <Card>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-cyan-600 mb-4">Assessment Usage Over Time</h3>
                        <div className="flex items-end h-48 space-x-2">
                            {mockUsageData.map(item => (
                                <div key={item.month} className="flex-1 flex flex-col items-center justify-end">
                                    <div className="text-gray-800 text-xs font-bold">{item.count}</div>
                                    <div className="w-full bg-cyan-500 rounded-t-md hover:bg-cyan-400" style={{ height: `${(item.count / 5000) * 100}%` }}></div>
                                    <div className="text-gray-500 text-sm mt-1">{item.month}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
             <div className="lg:col-span-2 space-y-6">
                <Card>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-cyan-600 mb-4">Marketing Kit</h3>
                        <p className="text-sm text-gray-500 mb-3">Download resources to promote this service to your students.</p>
                        <div className="space-y-2">
                           <button className="w-full text-sm text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center transition-colors">Download Flyer Template</button>
                           <button className="w-full text-sm text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center transition-colors">Download Social Media Posts</button>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="p-6">
                         <div className="flex items-start">
                            <LightbulbIcon />
                            <div>
                                <h3 className="text-xl font-semibold text-orange-500">Monetization Tip</h3>
                                <p className="text-sm text-gray-600 mt-2">Offer a "Premium Career Report" print-out as an optional add-on service for students after they complete their JAMB mock exams.</p>
                            </div>
                         </div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
  
  const renderAccessCodeManager = () => (
    <Card>
        <div className="p-6">
             <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                 <h3 className="text-xl font-semibold text-cyan-600">Access Code Manager</h3>
                 <button className="flex items-center justify-center px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors mt-4 sm:mt-0">
                    <KeyIcon /> Generate New Codes
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-200 text-gray-500">
                        <tr>
                            <th className="py-2 px-3">Access Code</th>
                            <th className="py-2 px-3">Status</th>
                            <th className="py-2 px-3">Date Created</th>
                            <th className="py-2 px-3">Used By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockAccessCodes.map(code => (
                            <tr key={code.code} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-3 font-mono text-orange-600">{code.code}</td>
                                <td className="py-3 px-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${code.status === 'Used' ? 'bg-gray-200 text-gray-700' : 'bg-cyan-100 text-cyan-800'}`}>{code.status}</span>
                                </td>
                                <td className="py-3 px-3 text-gray-500">{code.createdAt}</td>
                                <td className="py-3 px-3 text-gray-600">{code.usedBy || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </Card>
  );

  const renderSupportFaq = () => (
    <Card>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-center text-cyan-600 mb-2">AI Support FAQ</h3>
        <p className="text-center text-gray-500 mb-6">Get quick, AI-powered answers to common student questions.</p>
        
        <div className="space-y-4">
            <select
                value={faqQuery}
                onChange={(e) => setFaqQuery(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
                <option value="cs_vs_se">What's the difference between Computer Science and Software Engineering?</option>
                <option value="jamb_scores">What's a good JAMB score for competitive courses?</option>
                <option value="marketable_skills">What are the most marketable skills in Nigeria today?</option>
            </select>
            <button
                onClick={handleGetFaqAnswer}
                className="w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700"
            >
              Get Answer
            </button>
            {faqResponse && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fade-in">
                    <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: faqResponse }} />
                </div>
            )}
        </div>
      </div>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'codeManager':
        return renderAccessCodeManager();
      case 'support':
        return renderSupportFaq();
      case 'assessment':
        return <AssessmentPage onSubmit={onSubmitAssessment} error={error} />;
      case 'recommendations':
        return latestProfile ? <ResultsPage profile={latestProfile} /> : <p className="text-center p-8">Generate a sample report to see student recommendations.</p>;
      case 'clinic':
        return latestProfile ? <Chatbot careerProfile={latestProfile} /> : <p className="text-center p-8">Generate a sample report to access the Career Clinic.</p>;
      default:
        return null;
    }
  };

  const NavButton: React.FC<{tab: Tab, label: string, disabled?: boolean}> = ({ tab, label, disabled = false }) => (
     <button
        onClick={() => !disabled && setActiveTab(tab)}
        disabled={disabled}
        className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === tab 
                ? 'bg-cyan-600 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {label}
    </button>
  );

  return (
     <div className="w-full max-w-7xl mx-auto">
       <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                CBT Centre Dashboard
            </h1>
            <p className="text-lg text-gray-500 mt-1">Welcome, {user.name}! Manage your assessment integration.</p>
       </div>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <aside className="md:w-1/4 flex-shrink-0 mb-8 md:mb-0">
          <nav className="space-y-2">
            <NavButton tab="overview" label="Overview" />
            <NavButton tab="codeManager" label="Access Code Manager" />
            <NavButton tab="support" label="AI Support FAQ" />
            <NavButton tab="assessment" label="Generate Sample Report" />
            <NavButton tab="recommendations" label="Sample Recommendations" disabled={!profileExists} />
            <NavButton tab="clinic" label="Career Clinic" disabled={!profileExists} />
          </nav>
          <UpgradeCard onUpgrade={onUpgrade} />
        </aside>
        <main className="flex-grow md:w-3/4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default CbtCentreDashboard;