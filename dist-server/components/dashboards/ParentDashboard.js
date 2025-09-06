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
const UpgradePrompt_1 = __importDefault(require("./UpgradePrompt"));
const apiService_1 = require("../../services/apiService");
const Spinner_1 = __importDefault(require("../shared/Spinner"));
const ChildIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-12 w-12 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-6-6H6a6 6 0 00-6 6v2" }) });
const AddIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-12 w-12 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" }) });
const ParentDashboard = ({ user, onSubmitAssessment, error, onUpgrade, isSubscribed, onErrorAcknowledged }) => {
    const [children, setChildren] = react_1.default.useState([]);
    const [isLoading, setIsLoading] = react_1.default.useState(true);
    const [selectedChild, setSelectedChild] = react_1.default.useState(null);
    const [isAddChildModalOpen, setIsAddChildModalOpen] = react_1.default.useState(false);
    const [newChildName, setNewChildName] = react_1.default.useState('');
    const [activeTab, setActiveTab] = react_1.default.useState('recommendations');
    const [localError, setLocalError] = react_1.default.useState(null);
    const fetchChildrenData = react_1.default.useCallback(async () => {
        try {
            setIsLoading(true);
            const childrenData = await (0, apiService_1.getChildren)();
            setChildren(childrenData);
        }
        catch (err) {
            setLocalError(err instanceof Error ? err.message : 'Could not load children data.');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    react_1.default.useEffect(() => {
        fetchChildrenData();
    }, [fetchChildrenData]);
    const handleAddChildClick = () => {
        if (!isSubscribed && children.length >= 1) {
            onUpgrade();
        }
        else if (isSubscribed && children.length >= 5) {
            alert("You have reached the maximum of 5 children for your premium plan.");
        }
        else {
            setIsAddChildModalOpen(true);
        }
    };
    const handleAddChildSubmit = async (e) => {
        e.preventDefault();
        if (newChildName.trim()) {
            try {
                const newChildUser = await (0, apiService_1.addChild)(newChildName.trim());
                const newChildForState = {
                    _id: newChildUser._id,
                    name: newChildUser.name,
                    profiles: []
                };
                setChildren(prev => [...prev, newChildForState]);
                setNewChildName('');
                setIsAddChildModalOpen(false);
            }
            catch (err) {
                alert(err instanceof Error ? err.message : 'An error occurred.');
            }
        }
    };
    const handleSubmitForSelectedChild = async (answers) => {
        if (selectedChild) {
            onErrorAcknowledged(); // Clear previous global errors
            try {
                await onSubmitAssessment(answers, selectedChild._id);
                // Refresh data to get the new profile
                await fetchChildrenData();
                // The useEffect below will update the selectedChild state
                setActiveTab('recommendations');
            }
            catch (err) {
                // Global error state is set by App.tsx, this component will react to it
            }
        }
    };
    // When children data is refetched, update the selected child's data as well
    react_1.default.useEffect(() => {
        if (selectedChild) {
            const updatedChild = children.find(c => c._id === selectedChild._id);
            if (updatedChild) {
                setSelectedChild(updatedChild);
            }
        }
    }, [children, selectedChild]);
    const renderAddChildModal = () => ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in", children: (0, jsx_runtime_1.jsx)(Card_1.default, { className: "w-full max-w-md", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleAddChildSubmit, className: "p-8", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-gray-800 mb-4", children: "Add a New Child" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mb-6", children: "Enter your child's name to create a new profile for them." }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "childName", className: "block text-sm font-medium text-gray-600 mb-1", children: "Child's Full Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "childName", value: newChildName, onChange: (e) => setNewChildName(e.target.value), required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 flex justify-end space-x-3", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setIsAddChildModalOpen(false), className: "px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700", children: "Add Child" })] })] }) }) }));
    const renderErrorState = (errorMessage) => ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center bg-white rounded-xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mb-4", children: (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-16 w-16 text-red-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-800 mb-3", children: "An Error Occurred" }), (0, jsx_runtime_1.jsx)("p", { className: "text-red-600 bg-red-50 p-3 rounded-lg mb-6 max-w-xl mx-auto", children: errorMessage }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                        if (error)
                            onErrorAcknowledged();
                        if (localError)
                            setLocalError(null);
                        setActiveTab('assessment');
                    }, className: "px-8 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-700", children: "Try Assessment Again" })] }) }));
    const renderIndividualChildDashboard = (child) => {
        if (error) {
            return renderErrorState(error);
        }
        const childProfile = child.profiles && child.profiles.length > 0 ? child.profiles[0] : null;
        const renderContent = () => {
            switch (activeTab) {
                case 'recommendations':
                    return childProfile ? (0, jsx_runtime_1.jsx)(ResultsPage_1.default, { profile: childProfile }) : ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-8 text-center text-gray-500", children: "No profile generated yet. Take the assessment to begin." }) }));
                case 'assessment':
                    return (0, jsx_runtime_1.jsx)(AssessmentPage_1.default, { onSubmit: handleSubmitForSelectedChild, error: null }); // Error is handled globally
                case 'clinic':
                    if (!isSubscribed)
                        return (0, jsx_runtime_1.jsx)(UpgradePrompt_1.default, { featureName: "Career Clinic", onUpgrade: onUpgrade });
                    return childProfile ? (0, jsx_runtime_1.jsx)(Chatbot_1.default, { careerProfile: childProfile }) : ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-8 text-center text-gray-500", children: "An assessment must be completed to use the Career Clinic." }) }));
                default: return null;
            }
        };
        const NavButton = ({ tab, label, disabled = false }) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => !disabled && setActiveTab(tab), disabled: disabled, className: `w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${activeTab === tab ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`, children: label }));
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setSelectedChild(null), className: "text-sm text-cyan-600 hover:text-cyan-500 mb-4 flex items-center", children: [(0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), "Back to All Children"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row md:space-x-8", children: [(0, jsx_runtime_1.jsxs)("aside", { className: "md:w-1/4 flex-shrink-0 mb-8 md:mb-0", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: [child.name, "'s Dashboard"] }), (0, jsx_runtime_1.jsxs)("nav", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(NavButton, { tab: "recommendations", label: "Career Profile", disabled: !childProfile }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "assessment", label: childProfile ? 'Retake Assessment' : 'Take Assessment' }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "clinic", label: "Career Clinic", disabled: !childProfile })] })] }), (0, jsx_runtime_1.jsx)("main", { className: "flex-grow md:w-3/4", children: renderContent() })] })] }));
    };
    const renderChildSelection = () => ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6", children: [children.map(child => ((0, jsx_runtime_1.jsxs)(Card_1.default, { onClick: () => setSelectedChild(child), className: "p-6 text-center transform hover:scale-105 hover:border-cyan-500 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer", children: [(0, jsx_runtime_1.jsx)(ChildIcon, {}), (0, jsx_runtime_1.jsx)("h3", { className: "mt-4 text-xl font-bold text-gray-800", children: child.name }), (0, jsx_runtime_1.jsx)("p", { className: `mt-2 text-sm font-semibold ${child.profiles && child.profiles.length > 0 ? 'text-cyan-600' : 'text-orange-500'}`, children: child.profiles && child.profiles.length > 0 ? 'Profile Ready' : 'Assessment Pending' })] }, child._id))), (0, jsx_runtime_1.jsxs)(Card_1.default, { onClick: handleAddChildClick, className: "p-6 text-center transform hover:scale-105 hover:border-cyan-500 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed", children: [(0, jsx_runtime_1.jsx)(AddIcon, {}), (0, jsx_runtime_1.jsx)("h3", { className: "mt-4 text-xl font-bold text-gray-600", children: "Add Child" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-400", children: isSubscribed ? `${5 - children.length} slots remaining` : 'Upgrade for more' })] })] }) }));
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(Spinner_1.default, { message: "Loading your dashboard..." });
    }
    if (localError) {
        return renderErrorState(localError);
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600", children: "Parent Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-gray-500 mt-1", children: selectedChild ? `Viewing profile for ${selectedChild.name}` : `Welcome, ${user.name}! Manage your children's progress.` })] }), isAddChildModalOpen && renderAddChildModal(), selectedChild ? renderIndividualChildDashboard(selectedChild) : renderChildSelection()] }));
};
exports.default = ParentDashboard;
