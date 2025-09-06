"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Card_1 = __importDefault(require("./shared/Card"));
const apiService_1 = require("../services/apiService");
const LoginPage = ({ onLoginSuccess, onGoToSignUp, onGoToForgotPassword, notification }) => {
    const [activeTab, setActiveTab] = react_1.default.useState('staff');
    const [email, setEmail] = react_1.default.useState('');
    const [password, setPassword] = react_1.default.useState('');
    const [studentName, setStudentName] = react_1.default.useState('');
    const [accessCode, setAccessCode] = react_1.default.useState('');
    const [error, setError] = react_1.default.useState(null);
    const [isLoading, setIsLoading] = react_1.default.useState(false);
    const handleStaffLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const { user } = await (0, apiService_1.loginUser)(email, password);
            onLoginSuccess(user);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleStudentLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const { user } = await (0, apiService_1.loginWithAccessCode)(studentName, accessCode);
            onLoginSuccess(user);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const renderStaffLogin = () => ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleStaffLogin, className: "space-y-4 animate-fade-in", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-600 mb-1", children: "Email Address" }), (0, jsx_runtime_1.jsx)("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-600 mb-1", children: "Password" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onGoToForgotPassword, className: "text-sm font-semibold text-cyan-600 hover:text-cyan-500", children: "Forgot Password?" })] }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading, className: "w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 disabled:bg-gray-400", children: isLoading ? 'Logging In...' : 'Log In' })] }));
    const renderStudentLogin = () => ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleStudentLogin, className: "space-y-4 animate-fade-in", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "studentName", className: "block text-sm font-medium text-gray-600 mb-1", children: "Full Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "studentName", value: studentName, onChange: (e) => setStudentName(e.target.value), required: true, placeholder: "As registered by your school", className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "accessCode", className: "block text-sm font-medium text-gray-600 mb-1", children: "Access Code" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "accessCode", value: accessCode, onChange: (e) => setAccessCode(e.target.value.toUpperCase()), required: true, placeholder: "e.g., C8XF2A", className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading, className: "w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 disabled:bg-gray-400", children: isLoading ? 'Logging In...' : 'Log In' })] }));
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-md animate-fade-in", children: (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-8", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-center text-gray-800 mb-2", children: "Welcome Back!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-500 mb-6", children: "Log in to continue your career journey." }), notification && ((0, jsx_runtime_1.jsx)("div", { className: "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4", role: "alert", children: (0, jsx_runtime_1.jsx)("span", { className: "block sm:inline", children: notification }) })), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4", role: "alert", children: (0, jsx_runtime_1.jsx)("span", { className: "block sm:inline", children: error }) })), (0, jsx_runtime_1.jsx)("div", { className: "mb-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("nav", { className: "-mb-px flex space-x-4", "aria-label": "Tabs", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('staff'), className: `whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'staff' ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: "Staff / Parent" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('student'), className: `whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'student' ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: "Student (with Access Code)" })] }) }), activeTab === 'staff' ? renderStaffLogin() : renderStudentLogin(), (0, jsx_runtime_1.jsxs)("p", { className: "mt-6 text-center text-sm text-gray-500", children: ["Don't have an account?", ' ', (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onGoToSignUp, className: "font-semibold text-cyan-600 hover:text-cyan-500", children: "Sign Up" })] })] }) }) }));
};
exports.default = LoginPage;
