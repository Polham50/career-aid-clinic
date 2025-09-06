"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Card_1 = __importDefault(require("./shared/Card"));
const constants_1 = require("../constants");
const PaymentForm_1 = __importDefault(require("./PaymentForm"));
const SubscriptionPage = ({ user, onBack, onSubscriptionSuccess }) => {
    const [selectedPlan, setSelectedPlan] = react_1.default.useState(null);
    const handleChoosePlan = (plan) => {
        if (!user) {
            alert("You must be logged in to subscribe.");
            return;
        }
        if (plan.price === "Contact Us") {
            alert("Please contact our sales team for custom pricing.");
            return;
        }
        setSelectedPlan(plan);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [selectedPlan && user && ((0, jsx_runtime_1.jsx)(PaymentForm_1.default, { user: user, plan: selectedPlan, onClose: () => setSelectedPlan(null), onSuccess: () => {
                    setSelectedPlan(null);
                    onSubscriptionSuccess();
                } })), (0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-7xl animate-fade-in-up", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8 text-center", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: onBack, className: "text-sm text-cyan-600 hover:text-cyan-500 mb-6 flex items-center mx-auto", children: [(0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), "Back to Dashboard"] }), (0, jsx_runtime_1.jsx)("h1", { className: "text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600", children: "Upgrade Your Experience" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-lg text-gray-600", children: "Choose the plan that best fits your needs and unlock your full potential." })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: constants_1.subscriptionPlans.map((plan, index) => ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: `flex flex-col relative ${plan.highlight ? 'border-cyan-500 ring-2 ring-cyan-500' : 'border-gray-200'}`, children: [plan.highlight && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase", children: "Most Popular" })), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 flex-grow flex flex-col", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-gray-800", children: plan.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mb-6", children: plan.audience }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-3 text-gray-600 flex-grow", children: plan.features.map((feature, i) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)(constants_1.CheckIcon, {}), (0, jsx_runtime_1.jsx)("span", { children: feature })] }, i))) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-8 text-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-3xl font-bold text-gray-800", children: plan.price }), plan.priceDetails && (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: plan.priceDetails }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleChoosePlan(plan), className: `w-full mt-4 py-2 font-bold rounded-lg ${plan.highlight ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, children: plan.price === "Contact Us" ? 'Get in Touch' : 'Choose Plan' })] })] })] }, index))) })] })] }));
};
exports.default = SubscriptionPage;
