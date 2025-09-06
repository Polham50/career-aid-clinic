"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Card_1 = __importDefault(require("../shared/Card"));
const ResultsPage_1 = __importDefault(require("../ResultsPage"));
const AssessmentPage_1 = __importDefault(require("../AssessmentPage"));
const Chatbot_1 = __importDefault(require("../Chatbot"));
const UpgradeCard_1 = __importDefault(require("./UpgradeCard"));
const UpgradePrompt_1 = __importDefault(require("./UpgradePrompt"));
const usePrevious = (value) => {
    const ref = react_1.default.useRef(undefined);
    react_1.default.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};
const UserAddIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 mr-3 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" }) });
const ChartIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 mr-3 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) });
const DownloadIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z", clipRule: "evenodd" }) });
const mockStudents = [
    { name: 'Adebayo Johnson', class: 'SS2', status: 'Completed', date: '2 days ago' },
    { name: 'Chiamaka Nwosu', class: 'SS3', status: 'Completed', date: '5 days ago' },
    { name: 'Musa Ibrahim', class: 'SS2', status: 'Pending', date: 'N/A' },
    { name: 'Fatima Bello', class: 'SS3', status: 'Completed', date: '1 week ago' },
    { name: 'Tunde Adekunle', class: 'SS2', status: 'Pending', date: 'N/A' },
];
const mockHollandData = [
    { code: 'R', count: 8, color: 'bg-red-500' },
    { code: 'I', count: 12, color: 'bg-blue-500' },
    { code: 'A', count: 15, color: 'bg-purple-500' },
    { code: 'S', count: 18, color: 'bg-cyan-500' },
    { code: 'E', count: 10, color: 'bg-orange-500' },
    { code: 'C', count: 13, color: 'bg-indigo-500' },
];
const StatCard = ({ title, value, color = "text-gray-800" }) => ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4 text-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-500", children: title }), (0, jsx_runtime_1.jsx)("p", { className: `text-3xl font-bold ${color}`, children: value })] }));
const TeacherDashboard = ({ user, profiles, onSubmitAssessment, error, onUpgrade, isSubscribed }) => {
    const [activeTab, setActiveTab] = react_1.default.useState('overview');
    const [copilotQuery, setCopilotQuery] = react_1.default.useState('');
    const [copilotResponse, setCopilotResponse] = react_1.default.useState('');
    const prevProfilesLength = usePrevious(profiles.length);
    const latestProfile = profiles.length > 0 ? profiles[0] : null;
    react_1.default.useEffect(() => {
        if (prevProfilesLength !== undefined && profiles.length > prevProfilesLength && isSubscribed) {
            setActiveTab('recommendations');
        }
    }, [profiles, prevProfilesLength, isSubscribed]);
    const handleGetAdvice = () => {
        if (!copilotQuery)
            return;
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
    const renderOverview = () => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [!isSubscribed && ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-orange-50 border-orange-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4 text-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-orange-700", children: "You are on the Freemium Plan." }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-orange-600", children: "You can manage 1 student. Upgrade to manage up to 5 students monthly and unlock classroom tools." })] }) })), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsx)(StatCard, { title: "Total Students", value: "48" }), (0, jsx_runtime_1.jsx)(StatCard, { title: "Assessments Taken", value: "35", color: "text-cyan-600" }), (0, jsx_runtime_1.jsx)(StatCard, { title: "Completion Rate", value: "73%", color: "text-cyan-600" }), (0, jsx_runtime_1.jsx)(StatCard, { title: "Pending Invites", value: "13", color: "text-orange-500" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600 mb-4", children: "Classroom Insights" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mb-4", children: "Holland Code distribution for your SS2 class:" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: mockHollandData.map(item => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-8 font-bold text-gray-600", children: item.code }), (0, jsx_runtime_1.jsx)("div", { className: "flex-grow bg-gray-200 rounded-full h-6", children: (0, jsx_runtime_1.jsx)("div", { className: `${item.color} h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold`, style: { width: `${(item.count / 20) * 100}%` }, children: item.count }) })] }, item.code))) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 h-full flex flex-col", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600 mb-4", children: "Classroom Tools" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 flex-grow", children: [(0, jsx_runtime_1.jsxs)("button", { className: "w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center transition-colors", children: [(0, jsx_runtime_1.jsx)(UserAddIcon, {}), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-gray-800", children: "Invite Students" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Generate and send invitation codes." })] })] }), (0, jsx_runtime_1.jsxs)("button", { className: "w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center transition-colors", children: [(0, jsx_runtime_1.jsx)(ChartIcon, {}), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-gray-800", children: "View Full Analytics" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "See class-wide career interest trends." })] })] })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600 mb-4", children: "Resource Library" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-2 text-sm", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)("a", { href: "#", className: "flex items-center text-gray-600 hover:text-cyan-600", children: [(0, jsx_runtime_1.jsx)(DownloadIcon, {}), " ", (0, jsx_runtime_1.jsx)("span", { className: "ml-2", children: "Classroom Guide: Discussing Careers" })] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)("a", { href: "#", className: "flex items-center text-gray-600 hover:text-cyan-600", children: [(0, jsx_runtime_1.jsx)(DownloadIcon, {}), " ", (0, jsx_runtime_1.jsx)("span", { className: "ml-2", children: "Lesson Plan: Holland Codes" })] }) })] })] }) })] })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600 mb-4", children: "Student Roster (SS2 Class)" }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full text-left text-sm", children: [(0, jsx_runtime_1.jsx)("thead", { className: "border-b border-gray-200 text-gray-500", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Student Name" }), (0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Last Activity" }), (0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: mockStudents.map(student => ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-3 px-3 font-medium text-gray-800", children: student.name }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-3", children: (0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 text-xs font-semibold rounded-full ${student.status === 'Completed' ? 'bg-cyan-100 text-cyan-800' : 'bg-orange-100 text-orange-800'}`, children: student.status }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-3 text-gray-500", children: student.date }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-3", children: student.status === 'Completed' ? ((0, jsx_runtime_1.jsxs)("button", { onClick: () => alert(`Downloading report for ${student.name}...`), className: "flex items-center text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300", children: [(0, jsx_runtime_1.jsx)(DownloadIcon, {}), (0, jsx_runtime_1.jsx)("span", { className: "ml-1", children: "Download Report" })] })) : ((0, jsx_runtime_1.jsx)("button", { className: "text-xs text-gray-400 cursor-not-allowed", children: "N/A" })) })] }, student.name))) })] }) })] }) })] }));
    const renderCopilot = () => ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-center text-cyan-600 mb-2", children: "Guidance Co-Pilot" }), (0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-500 mb-6", children: "Describe a challenging student guidance scenario to get AI-powered advice." }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("textarea", { value: copilotQuery, onChange: (e) => setCopilotQuery(e.target.value), placeholder: "E.g., How do I advise a student who is artistically gifted but whose parents insist on them studying medicine?", className: "w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none min-h-[100px]" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleGetAdvice, className: "w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50", disabled: !copilotQuery, children: "Get AI-Powered Advice" }), copilotResponse && ((0, jsx_runtime_1.jsx)("div", { className: "mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fade-in", children: (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: copilotResponse } }) }))] })] }) }));
    const renderContent = () => {
        const isLocked = !isSubscribed;
        switch (activeTab) {
            case 'overview':
                return renderOverview();
            case 'copilot':
                if (isLocked)
                    return (0, jsx_runtime_1.jsx)(UpgradePrompt_1.default, { featureName: "Guidance Co-Pilot", onUpgrade: onUpgrade });
                return renderCopilot();
            case 'assessment':
                return (0, jsx_runtime_1.jsx)(AssessmentPage_1.default, { onSubmit: onSubmitAssessment, error: error });
            case 'recommendations':
                if (isLocked)
                    return (0, jsx_runtime_1.jsx)(UpgradePrompt_1.default, { featureName: "Sample Profiles", onUpgrade: onUpgrade });
                return latestProfile ? (0, jsx_runtime_1.jsx)(ResultsPage_1.default, { profile: latestProfile }) : (0, jsx_runtime_1.jsx)("p", { className: "text-center p-8", children: "Complete the assessment to view a sample career profile." });
            case 'clinic':
                if (isLocked)
                    return (0, jsx_runtime_1.jsx)(UpgradePrompt_1.default, { featureName: "Career Clinic", onUpgrade: onUpgrade });
                return latestProfile ? (0, jsx_runtime_1.jsx)(Chatbot_1.default, { careerProfile: latestProfile }) : (0, jsx_runtime_1.jsx)("p", { className: "text-center p-8", children: "Complete the assessment to access the Career Clinic." });
            default:
                return null;
        }
    };
    const NavButton = ({ tab, label, disabled = false }) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => {
            if (disabled)
                return;
            if (!isSubscribed && (tab !== 'overview' && tab !== 'assessment')) {
                onUpgrade();
            }
            else {
                setActiveTab(tab);
            }
        }, disabled: disabled, className: `w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors relative ${activeTab === tab
            ? 'bg-cyan-600 text-white'
            : 'text-gray-600 hover:bg-gray-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`, children: [label, !isSubscribed && (tab !== 'overview' && tab !== 'assessment') && !disabled && ((0, jsx_runtime_1.jsx)("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-orange-400", children: (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z", clipRule: "evenodd" }) }) }))] }));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600", children: "Teacher & Counselor Dashboard" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-lg text-gray-500 mt-1", children: ["Welcome, ", user.name, "! Guide your students to success."] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row md:space-x-8", children: [(0, jsx_runtime_1.jsxs)("aside", { className: "md:w-1/4 flex-shrink-0 mb-8 md:mb-0", children: [(0, jsx_runtime_1.jsxs)("nav", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(NavButton, { tab: "overview", label: "Overview" }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "copilot", label: "Guidance Co-Pilot" }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "assessment", label: "Take Sample Assessment" }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "recommendations", label: "My Sample Profile", disabled: !profileExists }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "clinic", label: "Career Clinic", disabled: !profileExists })] }), !isSubscribed && (0, jsx_runtime_1.jsx)(UpgradeCard_1.default, { onUpgrade: onUpgrade })] }), (0, jsx_runtime_1.jsx)("main", { className: "flex-grow md:w-3/4", children: renderContent() })] })] }));
};
exports.default = TeacherDashboard;
