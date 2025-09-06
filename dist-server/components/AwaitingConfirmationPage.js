"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Card_1 = __importDefault(require("./shared/Card"));
const apiService_1 = require("../services/apiService");
const Spinner_1 = __importDefault(require("./shared/Spinner"));
const SuccessIcon = () => ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-16 w-16 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }));
const ErrorIcon = () => ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-16 w-16 text-red-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" }) }));
const AwaitingConfirmationPage = ({ email, token, onConfirmSuccess }) => {
    const [status, setStatus] = react_1.default.useState('awaiting');
    const [errorMessage, setErrorMessage] = react_1.default.useState(null);
    // This effect triggers verification if a token is passed from the URL
    react_1.default.useEffect(() => {
        const verifyToken = async () => {
            // The condition for auto-verification is when the component is loaded
            // with a token but without an email (which is only set post-registration).
            if (token && !email) {
                window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
                setStatus('verifying');
                setErrorMessage(null);
                try {
                    await (0, apiService_1.confirmEmail)(token);
                    setStatus('success');
                    // Redirect to login after a short delay
                    setTimeout(() => {
                        onConfirmSuccess();
                    }, 3000);
                }
                catch (err) {
                    const message = err instanceof Error ? err.message : 'Confirmation failed.';
                    setErrorMessage(message);
                    setStatus('error');
                }
            }
        };
        verifyToken();
    }, [token, email, onConfirmSuccess]);
    // Render content for post-signup flow
    if (email) {
        const confirmationUrl = `/#/confirm?token=${token}`;
        return ((0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-lg text-center animate-fade-in-up", children: (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mb-4", children: (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-16 w-16 text-cyan-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-gray-800 mb-3", children: "Confirm Your Email" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600", children: ["We've sent a confirmation link to ", (0, jsx_runtime_1.jsx)("strong", { className: "text-gray-700", children: email }), ". Please check your inbox (and spam folder!) to complete your registration."] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-bold text-yellow-800", children: "For Development Only" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-yellow-700 mt-1", children: "Because the production email service is not configured, you can use this link to confirm your account directly:" }), (0, jsx_runtime_1.jsx)("a", { href: confirmationUrl, className: "mt-2 inline-block bg-yellow-200 text-yellow-900 font-mono text-xs px-2 py-1 rounded hover:bg-yellow-300 break-all", children: "Confirm Account" })] })] }) }) }));
    }
    // Render content for verification flow from URL
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-md text-center animate-fade-in", children: (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-8 min-h-[250px] flex flex-col justify-center items-center", children: [status === 'verifying' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Spinner_1.default, { message: "" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-800 mt-4", children: "Verifying your account..." })] })), status === 'success' && ((0, jsx_runtime_1.jsxs)("div", { className: 'animate-fade-in', children: [(0, jsx_runtime_1.jsx)(SuccessIcon, {}), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-green-600 mt-4 mb-2", children: "Verification Successful!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Your email has been confirmed. Redirecting you to the login page..." })] })), status === 'error' && ((0, jsx_runtime_1.jsxs)("div", { className: 'animate-fade-in', children: [(0, jsx_runtime_1.jsx)(ErrorIcon, {}), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-red-600 mt-4 mb-2", children: "Verification Failed" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: errorMessage || 'The link may be invalid or expired.' })] }))] }) }) }));
};
exports.default = AwaitingConfirmationPage;
