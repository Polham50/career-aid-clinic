"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Card_1 = __importDefault(require("./shared/Card"));
const apiService_1 = require("../services/apiService");
const ForgotPasswordPage = ({ onGoToLogin }) => {
    const [email, setEmail] = react_1.default.useState('');
    const [error, setError] = react_1.default.useState(null);
    const [isLoading, setIsLoading] = react_1.default.useState(false);
    const [message, setMessage] = react_1.default.useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { message } = await (0, apiService_1.forgotPassword)(email);
            setMessage(message);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
            setError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-md animate-fade-in", children: (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-8", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-center text-gray-800 mb-2", children: "Reset Your Password" }), (0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-500 mb-6", children: "Enter your email and we'll send you a link to reset your password." }), message && ((0, jsx_runtime_1.jsx)("div", { className: "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4", role: "alert", children: (0, jsx_runtime_1.jsx)("span", { className: "block sm:inline", children: message }) })), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4", role: "alert", children: (0, jsx_runtime_1.jsx)("span", { className: "block sm:inline", children: error }) })), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-600 mb-1", children: "Email Address" }), (0, jsx_runtime_1.jsx)("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading || !!message, className: "w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors disabled:bg-gray-400", children: isLoading ? 'Sending...' : 'Send Reset Link' }), (0, jsx_runtime_1.jsxs)("p", { className: "text-center text-sm text-gray-500", children: ["Remember your password?", ' ', (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onGoToLogin, className: "font-semibold text-cyan-600 hover:text-cyan-500", children: "Log In" })] })] })] }) }) }));
};
exports.default = ForgotPasswordPage;
