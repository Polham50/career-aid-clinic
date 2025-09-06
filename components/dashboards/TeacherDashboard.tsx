import React from 'react';
import { User, CareerProfile } from '../../types';
import Card from '../shared/Card';
import ResultsPage from '../ResultsPage';
import AssessmentPage from '../AssessmentPage';
import Chatbot from '../Chatbot';
import UpgradeCard from './UpgradeCard';
import UpgradePrompt from './UpgradePrompt';

interface TeacherDashboardProps {
  user: User;
  profiles: CareerProfile[];
  onSubmitAssessment: (answers: string[]) => Promise<void>;
  error: string | null;
  onUpgrade: () => void;
  onStartInterview: (careerName: string) => void;
  isSubscribed: boolean;
}

type Tab = 'overview' | 'copilot' | 'assessment' | 'recommendations' | 'clinic';

const usePrevious = <T,>(value: T): T | undefined => {
    const ref = React.useRef<T | undefined>(undefined);
    React.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const UserAddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;

const mockStudents = [
    { name: 'Adebayo Johnson', class: 'SS2', status: 'Completed', date: '2 days ago'},
    { name: 'Chiamaka Nwosu', class: 'SS3', status: 'Completed', date: '5 days ago'},
    { name: 'Musa Ibrahim', class: 'SS2', status: 'Pending', date: 'N/A'},
    { name: 'Fatima Bello', class: 'SS3', status: 'Completed', date: '1 week ago'},
    { name: 'Tunde Adekunle', class: 'SS2', status: 'Pending', date: 'N/A'},
];

const mockHollandData = [
    { code: 'R', count: 8, color: 'bg-red-500' },
    { code: 'I', count: 12, color: 'bg-blue-500' },
    { code: 'A', count: 15, color: 'bg-purple-500' },
    { code: 'S', count: 18, color: 'bg-cyan-500' },
    { code: 'E', count: 10, color: 'bg-orange-500' },
    { code: 'C', count: 13, color: 'bg-indigo-500' },
];

const StatCard: React.FC<{title: string; value: string; color?: string}> = ({ title, value, color = "text-gray-800" }) => (
    <Card className="p-4 text-center">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </Card>
);

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, profiles, onSubmitAssessment, error, onUpgrade, isSubscribed }) => {
  const [activeTab, setActiveTab] = React.useState<Tab>('overview');
  const [copilotQuery, setCopilotQuery] = React.useState('');
  const [copilotResponse, setCopilotResponse] = React.useState('');
  const prevProfilesLength = usePrevious(profiles.length);

  const latestProfile = profiles.length > 0 ? profiles[0] : null;

  React.useEffect(() => {
    if (prevProfilesLength !== undefined && profiles.length > prevProfilesLength && isSubscribed) {
      setActiveTab('recommendations');
    }
  }, [profiles, prevProfilesLength, isSubscribed]);

  const handleGetAdvice = () => {
    if (!copilotQuery) return;
    // Mocked AI response
    setCopilotResponse(`
        <h4 class="font-bold text-lg text-gray-800 mb-2">Guidance Strategy</h4>
        <p class="text-gray-600 mb-4">This is a common and sensitive situation. The key is to validate both the student's passion and the parents' concerns, then bridge the gap with data and possibilities.</p>
        <ol class="list-decimal list-inside space-y-3 text-gray-600">
            <li><strong>Validate & Empathize:</strong> Start by acknowledging the parents' desire for their child's security and success, which is often the root of their preference for traditional careers like medicine. Then, validate the student's artistic talent and passion.</li>
            <li><strong>Reframe the "Struggling Artist" Narrative:</strong> Use local data to show the viability of creative careers. You could say, "Nigeria's creative industry, including fields like UI/UX Design, Animation, and Digital Marketing, contributed over ₦730 billion to our GDP. Let's explore how [Student's Name]'s talent fits into these modern, high-demand roles."</li>
            <li><strong>Explore Hybrid Pathways:</strong> Suggest careers that blend art with science or technology, such as Medical Illustration, UI/UX Design for HealthTech apps, or Architectural Design. This shows a compromise and opens new avenues.</li>
            <li><strong>Set Up an Informational Interview:</strong> Connect the family with a successful Nigerian professional in a creative field. Hearing a real-life success story is often more powerful than any statistic.</li>
        </ol>
    `);
  };

  const profileExists = !!latestProfile;

  const renderOverview = () => (
    <div className="space-y-8">
        {!isSubscribed && (
            <Card className="bg-orange-50 border-orange-200">
                <div className="p-4 text-center">
                    <p className="font-semibold text-orange-700">You are on the Freemium Plan.</p>
                    <p className="text-sm text-orange-600">You can manage 1 student. Upgrade to manage up to 5 students monthly and unlock classroom tools.</p>
                </div>
            </Card>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Students" value="48" />
            <StatCard title="Assessments Taken" value="35" color="text-cyan-600" />
            <StatCard title="Completion Rate" value="73%" color="text-cyan-600" />
            <StatCard title="Pending Invites" value="13" color="text-orange-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-cyan-600 mb-4">Classroom Insights</h3>
                    <p className="text-sm text-gray-500 mb-4">Holland Code distribution for your SS2 class:</p>
                    <div className="space-y-2">
                        {mockHollandData.map(item => (
                            <div key={item.code} className="flex items-center">
                                <span className="w-8 font-bold text-gray-600">{item.code}</span>
                                <div className="flex-grow bg-gray-200 rounded-full h-6">
                                    <div className={`${item.color} h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold`} style={{ width: `${(item.count / 20) * 100}%` }}>{item.count}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
            <div className="space-y-6">
                 <Card>
                    <div className="p-6 h-full flex flex-col">
                        <h3 className="text-xl font-semibold text-cyan-600 mb-4">Classroom Tools</h3>
                        <div className="space-y-4 flex-grow">
                            <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center transition-colors">
                                <UserAddIcon />
                                <div>
                                    <h4 className="font-semibold text-gray-800">Invite Students</h4>
                                    <p className="text-sm text-gray-500">Generate and send invitation codes.</p>
                                </div>
                            </button>
                            <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center transition-colors">
                                <ChartIcon />
                                <div>
                                    <h4 className="font-semibold text-gray-800">View Full Analytics</h4>
                                    <p className="text-sm text-gray-500">See class-wide career interest trends.</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </Card>
                 <Card>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-cyan-600 mb-4">Resource Library</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="flex items-center text-gray-600 hover:text-cyan-600"><DownloadIcon /> <span className="ml-2">Classroom Guide: Discussing Careers</span></a></li>
                            <li><a href="#" className="flex items-center text-gray-600 hover:text-cyan-600"><DownloadIcon /> <span className="ml-2">Lesson Plan: Holland Codes</span></a></li>
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
        <Card>
            <div className="p-6">
                <h3 className="text-xl font-semibold text-cyan-600 mb-4">Student Roster (SS2 Class)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200 text-gray-500">
                            <tr>
                                <th className="py-2 px-3">Student Name</th>
                                <th className="py-2 px-3">Status</th>
                                <th className="py-2 px-3">Last Activity</th>
                                <th className="py-2 px-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockStudents.map(student => (
                                <tr key={student.name} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-3 font-medium text-gray-800">{student.name}</td>
                                    <td className="py-3 px-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${student.status === 'Completed' ? 'bg-cyan-100 text-cyan-800' : 'bg-orange-100 text-orange-800'}`}>{student.status}</span>
                                    </td>
                                    <td className="py-3 px-3 text-gray-500">{student.date}</td>
                                    <td className="py-3 px-3">
                                        {student.status === 'Completed' ? (
                                            <button onClick={() => alert(`Downloading report for ${student.name}...`)} className="flex items-center text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300">
                                                <DownloadIcon />
                                                <span className="ml-1">Download Report</span>
                                            </button>
                                        ) : (
                                            <button className="text-xs text-gray-400 cursor-not-allowed">N/A</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    </div>
  );

  const renderCopilot = () => (
    <Card>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-center text-cyan-600 mb-2">Guidance Co-Pilot</h3>
        <p className="text-center text-gray-500 mb-6">Describe a challenging student guidance scenario to get AI-powered advice.</p>
        
        <div className="space-y-4">
            <textarea
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                placeholder="E.g., How do I advise a student who is artistically gifted but whose parents insist on them studying medicine?"
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none min-h-[100px]"
            />
            <button
                onClick={handleGetAdvice}
                className="w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                disabled={!copilotQuery}
            >
              Get AI-Powered Advice
            </button>
            {copilotResponse && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fade-in">
                    <div dangerouslySetInnerHTML={{ __html: copilotResponse }} />
                </div>
            )}
        </div>
      </div>
    </Card>
  );

  const renderContent = () => {
    const isLocked = !isSubscribed;
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'copilot':
        if (isLocked) return <UpgradePrompt featureName="Guidance Co-Pilot" onUpgrade={onUpgrade} />;
        return renderCopilot();
      case 'assessment':
        return <AssessmentPage onSubmit={onSubmitAssessment} error={error} />;
      case 'recommendations':
         if (isLocked) return <UpgradePrompt featureName="Sample Profiles" onUpgrade={onUpgrade} />;
        return latestProfile ? <ResultsPage profile={latestProfile} /> : <p className="text-center p-8">Complete the assessment to view a sample career profile.</p>;
      case 'clinic':
        if (isLocked) return <UpgradePrompt featureName="Career Clinic" onUpgrade={onUpgrade} />;
        return latestProfile ? <Chatbot careerProfile={latestProfile} /> : <p className="text-center p-8">Complete the assessment to access the Career Clinic.</p>;
      default:
        return null;
    }
  };

  const NavButton: React.FC<{tab: Tab, label: string, disabled?: boolean}> = ({ tab, label, disabled = false }) => (
     <button
        onClick={() => {
            if (disabled) return;
            if (!isSubscribed && (tab !== 'overview' && tab !== 'assessment')) {
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
        {!isSubscribed && (tab !== 'overview' && tab !== 'assessment') && !disabled && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            </span>
        )}
    </button>
  );

  return (
     <div className="w-full max-w-7xl mx-auto">
       <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                Teacher & Counselor Dashboard
            </h1>
            <p className="text-lg text-gray-500 mt-1">Welcome, {user.name}! Guide your students to success.</p>
       </div>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <aside className="md:w-1/4 flex-shrink-0 mb-8 md:mb-0">
          <nav className="space-y-2">
            <NavButton tab="overview" label="Overview" />
            <NavButton tab="copilot" label="Guidance Co-Pilot" />
            <NavButton tab="assessment" label="Take Sample Assessment" />
            <NavButton tab="recommendations" label="My Sample Profile" disabled={!profileExists} />
            <NavButton tab="clinic" label="Career Clinic" disabled={!profileExists} />
          </nav>
          {!isSubscribed && <UpgradeCard onUpgrade={onUpgrade} />}
        </aside>
        <main className="flex-grow md:w-3/4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;