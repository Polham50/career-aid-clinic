"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Card_1 = __importDefault(require("./shared/Card"));
const apiService_1 = require("../services/apiService");
const ResetPasswordPage = ({ token, onResetSuccess }) => {
    const [password, setPassword] = react_1.default.useState('');
    const [confirmPassword, setConfirmPassword] = react_1.default.useState('');
    const [error, setError] = react_1.default.useState(null);
    const [isLoading, setIsLoading] = react_1.default.useState(false);
    react_1.default.useEffect(() => {
        // Clean the token from the URL as soon as the component loads
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await (0, apiService_1.resetPassword)(token, password);
            onResetSuccess();
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to reset password.';
            setError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-md animate-fade-in", children: (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-8", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-center text-gray-800 mb-2", children: "Set a New Password" }), (0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-500 mb-6", children: "Please enter your new password below." }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4", role: "alert", children: (0, jsx_runtime_1.jsx)("span", { className: "block sm:inline", children: error }) })), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-600 mb-1", children: "New Password" }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-600 mb-1", children: "Confirm New Password" }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "confirmPassword", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading, className: "w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors disabled:bg-gray-400", children: isLoading ? 'Resetting...' : 'Reset Password' })] })] }) }) }));
};
exports.default = ResetPasswordPage;
