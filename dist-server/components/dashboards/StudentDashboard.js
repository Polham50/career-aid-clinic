"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const ResultsPage_1 = __importDefault(require("../ResultsPage"));
const Card_1 = __importDefault(require("../shared/Card"));
const AssessmentPage_1 = __importDefault(require("../AssessmentPage"));
const Chatbot_1 = __importDefault(require("../Chatbot"));
const UpgradeCard_1 = __importDefault(require("./UpgradeCard"));
const constants_1 = require("../../constants");
const UpgradePrompt_1 = __importDefault(require("./UpgradePrompt"));
const usePrevious = (value) => {
    const ref = react_1.default.useRef(undefined);
    react_1.default.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};
const ResourceIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) });
const ActionPlanIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" }) });
const HistoryIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 mr-2", viewBox: "0 0 20 20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z", clipRule: "evenodd" }) });
const StudentDashboard = ({ user, profiles, onSubmitAssessment, error, onUpgrade, onStartInterview, isSubscribed, redirectToRecommendations, onRedirectConsumed, onErrorAcknowledged }) => {
    const [activeTab, setActiveTab] = react_1.default.useState('overview');
    const [viewedProfile, setViewedProfile] = react_1.default.useState(null);
    const [goals, setGoals] = react_1.default.useState([
        { id: 1, text: "Research UNILAG's Computer Science program", completed: false },
        { id: 2, text: "Watch a 'Day in the Life of a Software Engineer' video", completed: true },
    ]);
    const [newGoal, setNewGoal] = react_1.default.useState('');
    const prevProfilesLength = usePrevious(profiles.length);
    const latestProfile = profiles.length > 0 ? profiles[0] : null;
    react_1.default.useEffect(() => {
        // When profiles array is updated, view the latest one by default.
        if (profiles.length > 0) {
            setViewedProfile(profiles[0]);
        }
    }, [profiles]);
    react_1.default.useEffect(() => {
        // Do not redirect if there's an error; the error component will be shown instead.
        if (error)
            return;
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
    const handleAddGoal = (e) => {
        e.preventDefault();
        if (newGoal.trim()) {
            setGoals([...goals, { id: Date.now(), text: newGoal.trim(), completed: false }]);
            setNewGoal('');
        }
    };
    const toggleGoal = (id) => {
        setGoals(goals.map(goal => goal.id === id ? { ...goal, completed: !goal.completed } : goal));
    };
    const renderFormattedSummary = (summary) => {
        if (!summary)
            return null;
        const parts = summary.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => part.startsWith('**') && part.endsWith('**') ? ((0, jsx_runtime_1.jsx)("strong", { className: "font-semibold text-gray-700", children: part.slice(2, -2) }, i)) : (part));
    };
    const renderOverview = () => {
        if (!latestProfile) {
            return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center bg-white rounded-xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mb-4", children: (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-16 w-16 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-800 mb-3", children: "Welcome to your Dashboard!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mb-6 max-w-lg mx-auto", children: "This is your personal space to discover your career path. Get started by taking the assessment to unlock your personalized recommendations and chat with your AI career counselor." }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('assessment'), className: "px-8 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transform hover:scale-105 transition-transform duration-300", children: "Take the Assessment Now" })] }) }));
        }
        return ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-2 space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600 mb-4", children: "Your Latest Personality Profile" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-4", children: renderFormattedSummary(latestProfile.summary) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-center", children: latestProfile.topHollandCodes.map((code) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-100 p-4 rounded-lg border border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center text-cyan-500 mb-2", children: [constants_1.HOLLAND_CODE_ICONS[code.code], (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-2xl font-bold", children: code.code })] }), (0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-semibold text-gray-800", children: code.name })] }, code.code))) })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-4 mb-4", children: [(0, jsx_runtime_1.jsx)(ResourceIcon, {}), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600", children: "Resource Hub" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Essential links for your journey." })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [(0, jsx_runtime_1.jsx)("a", { href: "https://www.jamb.gov.ng/", target: "_blank", rel: "noopener noreferrer", className: "bg-gray-50 p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors", children: "JAMB Official Site \u2192" }), (0, jsx_runtime_1.jsx)("a", { href: "https://www.waecnigeria.org/", target: "_blank", rel: "noopener noreferrer", className: "bg-gray-50 p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors", children: "WAEC Nigeria Portal \u2192" }), (0, jsx_runtime_1.jsx)("a", { href: "#", className: "bg-gray-50 p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors", children: "Nigerian Scholarships \u2192" }), (0, jsx_runtime_1.jsx)("a", { href: "#", className: "bg-gray-50 p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors", children: "University Directory \u2192" })] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-4 mb-4", children: [(0, jsx_runtime_1.jsx)(ActionPlanIcon, {}), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600", children: "Your Action Plan" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Turn insights into actions." })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: goals.map(goal => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: goal.completed, onChange: () => toggleGoal(goal.id), className: "h-4 w-4 rounded bg-gray-200 border-gray-300 text-cyan-600 focus:ring-cyan-500" }), (0, jsx_runtime_1.jsx)("span", { className: `ml-3 text-sm ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`, children: goal.text })] }, goal.id))) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleAddGoal, className: "mt-4 flex", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: newGoal, onChange: (e) => setNewGoal(e.target.value), placeholder: "Add a new goal...", className: "flex-grow bg-gray-100 border border-gray-300 text-gray-800 rounded-l-md py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "bg-cyan-600 text-white font-bold rounded-r-md px-3 hover:bg-cyan-700 text-lg", children: "+" })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 h-full flex flex-col justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600 mb-4", children: "Quick Actions" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => isSubscribed ? setActiveTab('recommendations') : onUpgrade(), className: "w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center transition-colors", children: [(0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 mr-3 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7l5 5m0 0l-5 5m5-5H6" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-gray-800", children: "View Recommendations" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "See all your career matches" })] })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => isSubscribed ? setActiveTab('clinic') : onUpgrade(), className: "w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center transition-colors", children: [(0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 mr-3 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-gray-800", children: "Go to Career Clinic" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Ask the AI your questions" })] })] })] })] }) })] })] }));
    };
    const renderInterview = (profile) => {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-center text-cyan-600 mb-2", children: "Mock Interview Practice" }), (0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-500 mb-6", children: "Prepare for your future. Select a career from your latest assessment to start a practice interview." }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: profile.recommendedCareers.map(career => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => onStartInterview(career.careerName), className: "p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors border border-gray-200", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-gray-800", children: career.careerName }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-cyan-600", children: "Start Interview \u2192" })] }, career.careerName))) })] }) }));
    };
    const renderHistory = () => ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-center text-cyan-600 mb-2", children: "Assessment History" }), (0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-500 mb-6", children: "Review your past assessments to see how your profile has evolved over time." }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: profiles.map((p, index) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                            setViewedProfile(p);
                            setActiveTab('recommendations');
                        }, className: "w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between transition-colors border border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(HistoryIcon, {}), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { className: "font-semibold text-gray-800", children: ["Assessment #", profiles.length - index, index === 0 && (0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-xs font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full", children: "Latest" })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: ["Taken on ", new Date(p.assessmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })] })] })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-cyan-600 font-semibold text-sm", children: "View Report \u2192" })] }, p.assessmentDate))) })] }) }));
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverview();
            case 'assessment':
                return (0, jsx_runtime_1.jsx)(AssessmentPage_1.default, { onSubmit: onSubmitAssessment, error: error });
            case 'recommendations':
                if (!isSubscribed) {
                    return (0, jsx_runtime_1.jsx)(UpgradePrompt_1.default, { featureName: "Career Recommendations", onUpgrade: onUpgrade });
                }
                return viewedProfile ? (0, jsx_runtime_1.jsx)(ResultsPage_1.default, { profile: viewedProfile }) : (0, jsx_runtime_1.jsx)("p", { className: "text-center p-8", children: "Complete the assessment to see your recommendations." });
            case 'history':
                if (!isSubscribed)
                    return (0, jsx_runtime_1.jsx)(UpgradePrompt_1.default, { featureName: "Assessment History", onUpgrade: onUpgrade });
                return renderHistory();
            case 'clinic':
                if (!isSubscribed)
                    return (0, jsx_runtime_1.jsx)(UpgradePrompt_1.default, { featureName: "Career Clinic", onUpgrade: onUpgrade });
                return latestProfile ? (0, jsx_runtime_1.jsx)(Chatbot_1.default, { careerProfile: latestProfile }) : (0, jsx_runtime_1.jsx)("p", { className: "text-center p-8", children: "Complete the assessment to access the Career Clinic." });
            case 'interview':
                if (!isSubscribed)
                    return (0, jsx_runtime_1.jsx)(UpgradePrompt_1.default, { featureName: "Mock Interviews", onUpgrade: onUpgrade });
                return latestProfile ? renderInterview(latestProfile) : (0, jsx_runtime_1.jsx)("p", { className: "text-center p-8", children: "Complete the assessment to practice interviews." });
            default:
                return null;
        }
    };
    const NavButton = ({ tab, label, disabled = false }) => {
        const lockedTabsForFreeUsers = ['recommendations', 'history', 'clinic', 'interview'];
        const isLocked = !isSubscribed && lockedTabsForFreeUsers.includes(tab);
        return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                if (disabled)
                    return;
                if (isLocked) {
                    onUpgrade();
                }
                else {
                    setActiveTab(tab);
                }
            }, disabled: disabled, className: `w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors relative ${activeTab === tab
                ? 'bg-cyan-600 text-white'
                : 'text-gray-600 hover:bg-gray-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`, children: [label, isLocked && !disabled && ((0, jsx_runtime_1.jsx)("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-orange-400", children: (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z", clipRule: "evenodd" }) }) }))] }));
    };
    const renderErrorState = () => ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center bg-white rounded-xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mb-4", children: (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-16 w-16 text-red-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-800 mb-3", children: "We Couldn't Generate Your Profile" }), (0, jsx_runtime_1.jsx)("p", { className: "text-red-600 bg-red-50 p-3 rounded-lg mb-6 max-w-xl mx-auto", children: error }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mb-6 max-w-lg mx-auto", children: "Please try the assessment again. If the problem persists, please contact support." }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                        onErrorAcknowledged();
                        setActiveTab('assessment');
                    }, className: "px-8 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500", children: "Try Assessment Again" })] }) }));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600", children: "Student Dashboard" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-lg text-gray-500 mt-1", children: ["Welcome, ", user.name, "! Your career journey starts here."] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row md:space-x-8", children: [(0, jsx_runtime_1.jsxs)("aside", { className: "md:w-1/4 flex-shrink-0 mb-8 md:mb-0", children: [(0, jsx_runtime_1.jsxs)("nav", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(NavButton, { tab: "overview", label: "Overview" }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "assessment", label: profiles.length > 0 ? 'Retake Assessment' : 'Start Assessment' }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "recommendations", label: "Recommendations", disabled: !latestProfile }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "history", label: "Assessment History", disabled: !latestProfile }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "clinic", label: "Career Clinic", disabled: !latestProfile }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "interview", label: "Mock Interview", disabled: !latestProfile })] }), !isSubscribed && (0, jsx_runtime_1.jsx)(UpgradeCard_1.default, { onUpgrade: onUpgrade })] }), (0, jsx_runtime_1.jsx)("main", { className: "flex-grow md:w-3/4", children: error ? renderErrorState() : renderContent() })] })] }));
};
exports.default = StudentDashboard;
