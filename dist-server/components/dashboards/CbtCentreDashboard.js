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
const usePrevious = (value) => {
    const ref = react_1.default.useRef(undefined);
    react_1.default.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};
const mockAccessCodes = [
    { code: 'JAMB-C8XF-2A9B', status: 'Used', createdAt: '2024-07-20', usedBy: 'Student ID 1023' },
    { code: 'JAMB-K9B3-L1C4', status: 'Used', createdAt: '2024-07-20', usedBy: 'Student ID 1024' },
    { code: 'JAMB-P5G7-H4D5', status: 'Available', createdAt: '2024-07-21' },
    { code: 'JAMB-Z2V6-J9E6', status: 'Used', createdAt: '2024-07-21', usedBy: 'Student ID 1025' },
    { code: 'JAMB-R4N1-M5F7', status: 'Available', createdAt: '2024-07-22' },
    { code: 'JAMB-A3B8-K2G8', status: 'Available', createdAt: '2024-07-22' },
];
const KeyIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 mr-3 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 017.743-5.743z" }) });
const DownloadIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 mr-2", viewBox: "0 0 20 20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z", clipRule: "evenodd" }) });
const LightbulbIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 mr-3 text-orange-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }) });
const mockUsageData = [
    { month: 'Jan', count: 2100 },
    { month: 'Feb', count: 2800 },
    { month: 'Mar', count: 3500 },
    { month: 'Apr', count: 3200 },
    { month: 'May', count: 4100 },
    { month: 'Jun', count: 3402 },
];
const faqQuestions = {
    'cs_vs_se': "<strong>Computer Science</strong> is broader, focusing on theory, algorithms, and computation. <strong>Software Engineering</strong> is more specific, applying engineering principles to the design, development, and maintenance of software systems. Think of a computer scientist as an architect who understands the physics of a building, and a software engineer as the civil engineer who actually builds it.",
    'jamb_scores': "JAMB scores for competitive courses like Medicine or Law at top federal universities often need to be <strong>280 and above</strong>. For Engineering or Sciences, a score of <strong>240-270</strong> is typically competitive. However, this varies greatly by university and year, so it's crucial to check with the specific institution.",
    'marketable_skills': "Currently in Nigeria, skills in high demand include: <strong>Digital Marketing</strong>, <strong>Data Analysis</strong>, <strong>UI/UX Design</strong>, <strong>Mobile App Development (especially Android)</strong>, and <strong>Cybersecurity</strong>. Vocational skills like fashion design and modern agriculture are also very valuable."
};
const CbtCentreDashboard = ({ user, profiles, onSubmitAssessment, error, onUpgrade }) => {
    const [activeTab, setActiveTab] = react_1.default.useState('overview');
    const [faqQuery, setFaqQuery] = react_1.default.useState('cs_vs_se');
    const [faqResponse, setFaqResponse] = react_1.default.useState('');
    const prevProfilesLength = usePrevious(profiles.length);
    const latestProfile = profiles.length > 0 ? profiles[0] : null;
    react_1.default.useEffect(() => {
        if (prevProfilesLength === 0 && profiles.length > 0) {
            setActiveTab('recommendations');
        }
    }, [profiles, prevProfilesLength]);
    const profileExists = !!latestProfile;
    const handleGetFaqAnswer = () => {
        setFaqResponse(faqQuestions[faqQuery]);
    };
    const renderOverview = () => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 text-center", children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-500", children: "Assessments Used (This Month)" }), (0, jsx_runtime_1.jsx)("p", { className: "text-4xl font-bold text-cyan-600", children: "3,402" })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-500", children: "Total Assessments Used" }), (0, jsx_runtime_1.jsx)("p", { className: "text-4xl font-bold text-gray-800", children: "27,198" })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-500", children: "Licenses Remaining" }), (0, jsx_runtime_1.jsx)("p", { className: "text-4xl font-bold text-orange-500", children: "1,598" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-3", children: (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600 mb-4", children: "Assessment Usage Over Time" }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end h-48 space-x-2", children: mockUsageData.map(item => ((0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex flex-col items-center justify-end", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-800 text-xs font-bold", children: item.count }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-cyan-500 rounded-t-md hover:bg-cyan-400", style: { height: `${(item.count / 5000) * 100}%` } }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 text-sm mt-1", children: item.month })] }, item.month))) })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-2 space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600 mb-4", children: "Marketing Kit" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mb-3", children: "Download resources to promote this service to your students." }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("button", { className: "w-full text-sm text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center transition-colors", children: "Download Flyer Template" }), (0, jsx_runtime_1.jsx)("button", { className: "w-full text-sm text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center transition-colors", children: "Download Social Media Posts" })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)(LightbulbIcon, {}), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-orange-500", children: "Monetization Tip" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mt-2", children: "Offer a \"Premium Career Report\" print-out as an optional add-on service for students after they complete their JAMB mock exams." })] })] }) }) })] })] })] }));
    const renderAccessCodeManager = () => ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600", children: "Access Code Manager" }), (0, jsx_runtime_1.jsxs)("button", { className: "flex items-center justify-center px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors mt-4 sm:mt-0", children: [(0, jsx_runtime_1.jsx)(KeyIcon, {}), " Generate New Codes"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full text-left text-sm", children: [(0, jsx_runtime_1.jsx)("thead", { className: "border-b border-gray-200 text-gray-500", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Access Code" }), (0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Date Created" }), (0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Used By" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: mockAccessCodes.map(code => ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-3 px-3 font-mono text-orange-600", children: code.code }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-3", children: (0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 text-xs font-semibold rounded-full ${code.status === 'Used' ? 'bg-gray-200 text-gray-700' : 'bg-cyan-100 text-cyan-800'}`, children: code.status }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-3 text-gray-500", children: code.createdAt }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-3 text-gray-600", children: code.usedBy || 'N/A' })] }, code.code))) })] }) })] }) }));
    const renderSupportFaq = () => ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-center text-cyan-600 mb-2", children: "AI Support FAQ" }), (0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-500 mb-6", children: "Get quick, AI-powered answers to common student questions." }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("select", { value: faqQuery, onChange: (e) => setFaqQuery(e.target.value), className: "w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "cs_vs_se", children: "What's the difference between Computer Science and Software Engineering?" }), (0, jsx_runtime_1.jsx)("option", { value: "jamb_scores", children: "What's a good JAMB score for competitive courses?" }), (0, jsx_runtime_1.jsx)("option", { value: "marketable_skills", children: "What are the most marketable skills in Nigeria today?" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleGetFaqAnswer, className: "w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700", children: "Get Answer" }), faqResponse && ((0, jsx_runtime_1.jsx)("div", { className: "mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fade-in", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", dangerouslySetInnerHTML: { __html: faqResponse } }) }))] })] }) }));
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverview();
            case 'codeManager':
                return renderAccessCodeManager();
            case 'support':
                return renderSupportFaq();
            case 'assessment':
                return (0, jsx_runtime_1.jsx)(AssessmentPage_1.default, { onSubmit: onSubmitAssessment, error: error });
            case 'recommendations':
                return latestProfile ? (0, jsx_runtime_1.jsx)(ResultsPage_1.default, { profile: latestProfile }) : (0, jsx_runtime_1.jsx)("p", { className: "text-center p-8", children: "Generate a sample report to see student recommendations." });
            case 'clinic':
                return latestProfile ? (0, jsx_runtime_1.jsx)(Chatbot_1.default, { careerProfile: latestProfile }) : (0, jsx_runtime_1.jsx)("p", { className: "text-center p-8", children: "Generate a sample report to access the Career Clinic." });
            default:
                return null;
        }
    };
    const NavButton = ({ tab, label, disabled = false }) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => !disabled && setActiveTab(tab), disabled: disabled, className: `w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${activeTab === tab
            ? 'bg-cyan-600 text-white'
            : 'text-gray-600 hover:bg-gray-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`, children: label }));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600", children: "CBT Centre Dashboard" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-lg text-gray-500 mt-1", children: ["Welcome, ", user.name, "! Manage your assessment integration."] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row md:space-x-8", children: [(0, jsx_runtime_1.jsxs)("aside", { className: "md:w-1/4 flex-shrink-0 mb-8 md:mb-0", children: [(0, jsx_runtime_1.jsxs)("nav", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(NavButton, { tab: "overview", label: "Overview" }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "codeManager", label: "Access Code Manager" }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "support", label: "AI Support FAQ" }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "assessment", label: "Generate Sample Report" }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "recommendations", label: "Sample Recommendations", disabled: !profileExists }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "clinic", label: "Career Clinic", disabled: !profileExists })] }), (0, jsx_runtime_1.jsx)(UpgradeCard_1.default, { onUpgrade: onUpgrade })] }), (0, jsx_runtime_1.jsx)("main", { className: "flex-grow md:w-3/4", children: renderContent() })] })] }));
};
exports.default = CbtCentreDashboard;
