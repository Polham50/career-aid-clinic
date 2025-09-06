"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Card_1 = __importDefault(require("./shared/Card"));
const apiService_1 = require("../services/apiService");
const StudentIcon = () => (0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: [(0, jsx_runtime_1.jsx)("path", { d: "M12 14l9-5-9-5-9 5 9 5z" }), (0, jsx_runtime_1.jsx)("path", { d: "M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" }), (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 14l9-5-9-5-9 5 9 5zm0 0v6" })] });
const ParentIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm-3 5a2 2 0 11-4 0 2 2 0 014 0z" }) });
const TeacherIcon = () => (0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: [(0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-6-6H6a6 6 0 00-6 6v2" }), (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M18.5 10.5l-1.5-1.5V6a2.5 2.5 0 015 0v3l-1.5 1.5" }), (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M22 10h-7" })] });
const SchoolIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9 12.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 12.75z" }) });
const CBTIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" }) });
const userSegments = [
    { role: 'Student', description: 'For students (JSS3 – SS3) seeking career guidance.', icon: (0, jsx_runtime_1.jsx)(StudentIcon, {}) },
    { role: 'Parent/Guardian', description: 'Monitor your child’s progress and get parental tips.', icon: (0, jsx_runtime_1.jsx)(ParentIcon, {}) },
    { role: 'Counselor/Teacher', description: 'Access tools to guide your students effectively.', icon: (0, jsx_runtime_1.jsx)(TeacherIcon, {}) },
    { role: 'School Administrator', description: 'Manage student assessments and view analytics.', icon: (0, jsx_runtime_1.jsx)(SchoolIcon, {}) },
    { role: 'JAMB CBT Centre', description: 'Integrate career assessment into your prep sessions.', icon: (0, jsx_runtime_1.jsx)(CBTIcon, {}) },
];
const SignUpPage = ({ onSignUpSuccess, onGoToLogin }) => {
    const [selectedRole, setSelectedRole] = react_1.default.useState(null);
    const [formData, setFormData] = react_1.default.useState({
        name: '',
        email: '',
        password: '',
        // Role-specific fields
        classLevel: 'JSS3',
        schoolName: '',
        schoolAddress: '',
        centreName: '',
        centreAddress: '',
    });
    const [error, setError] = react_1.default.useState(null);
    const [isLoading, setIsLoading] = react_1.default.useState(false);
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!selectedRole)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const user = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: selectedRole,
                classLevel: formData.classLevel,
                schoolName: formData.schoolName,
                schoolAddress: formData.schoolAddress,
                centreName: formData.centreName,
                centreAddress: formData.centreAddress,
            };
            const { token } = await (0, apiService_1.registerUser)(user);
            if (!token) {
                throw new Error("Verification token was not provided by the server.");
            }
            onSignUpSuccess(user.email, token);
        }
        catch (err) {
            if (err instanceof Error) {
                if (err.message.includes("Failed to fetch")) {
                    setError("Could not connect to the server. Please make sure the backend is running and there are no network issues.");
                }
                else {
                    setError(err.message);
                }
            }
            else {
                setError('An unknown error occurred.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const renderRoleSpecificFields = () => {
        switch (selectedRole) {
            case 'Student':
                return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "classLevel", className: "block text-sm font-medium text-gray-600 mb-1", children: "Current Class" }), (0, jsx_runtime_1.jsxs)("select", { id: "classLevel", value: formData.classLevel, onChange: handleChange, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { children: "JSS3" }), (0, jsx_runtime_1.jsx)("option", { children: "SS1" }), (0, jsx_runtime_1.jsx)("option", { children: "SS2" }), (0, jsx_runtime_1.jsx)("option", { children: "SS3" })] })] }));
            case 'Counselor/Teacher':
                return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "schoolName", className: "block text-sm font-medium text-gray-600 mb-1", children: "School Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "schoolName", value: formData.schoolName, onChange: handleChange, required: true, placeholder: "e.g., King's College, Lagos", className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }));
            case 'School Administrator':
                return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "schoolName", className: "block text-sm font-medium text-gray-600 mb-1", children: "School Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "schoolName", value: formData.schoolName, onChange: handleChange, required: true, placeholder: "e.g., Queen's College, Yaba", className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "schoolAddress", className: "block text-sm font-medium text-gray-600 mb-1", children: "School Address" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "schoolAddress", value: formData.schoolAddress, onChange: handleChange, required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] })] }));
            case 'JAMB CBT Centre':
                return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "centreName", className: "block text-sm font-medium text-gray-600 mb-1", children: "CBT Centre Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "centreName", value: formData.centreName, onChange: handleChange, required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "centreAddress", className: "block text-sm font-medium text-gray-600 mb-1", children: "Centre Address" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "centreAddress", value: formData.centreAddress, onChange: handleChange, required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] })] }));
            default:
                return null;
        }
    };
    if (!selectedRole) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-4xl text-center animate-fade-in-up", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-4", children: "Join CareerAid Clinic" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-gray-600 mb-12", children: "First, tell us who you are. Choose the account type that best describes you." }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: userSegments.map(({ role, description, icon }) => ((0, jsx_runtime_1.jsx)("div", { onClick: () => setSelectedRole(role), className: "cursor-pointer", children: (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "h-full p-6 text-center transform hover:scale-105 hover:border-cyan-500 transition-all duration-300 flex flex-col items-center", children: [icon, (0, jsx_runtime_1.jsx)("h3", { className: "mt-4 text-xl font-bold text-gray-800", children: role }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-500", children: description })] }) }, role))) })] }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-md animate-fade-in", children: (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-8", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setSelectedRole(null), className: "text-sm text-cyan-600 hover:text-cyan-500 mb-4 flex items-center", children: [(0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), "Back to roles"] }), (0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-center text-gray-800 mb-2", children: ["Create Your ", selectedRole, " Account"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-500 mb-6", children: "Let's get you started on your journey." }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4", role: "alert", children: (0, jsx_runtime_1.jsx)("span", { className: "block sm:inline", children: error }) })), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSignUp, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-600 mb-1", children: "Full Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "name", value: formData.name, onChange: handleChange, required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), renderRoleSpecificFields(), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-600 mb-1", children: "Email Address" }), (0, jsx_runtime_1.jsx)("input", { type: "email", id: "email", value: formData.email, onChange: handleChange, required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-600 mb-1", children: "Password" }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "password", value: formData.password, onChange: handleChange, required: true, minLength: 6, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading, className: "w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-300 disabled:bg-gray-400", children: isLoading ? 'Creating Account...' : 'Sign Up' }), (0, jsx_runtime_1.jsxs)("p", { className: "text-center text-sm text-gray-500", children: ["Already have an account?", ' ', (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onGoToLogin, className: "font-semibold text-cyan-600 hover:text-cyan-500", children: "Log In" })] })] })] }) }) }));
};
exports.default = SignUpPage;
