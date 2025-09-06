"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Card_1 = __importDefault(require("../shared/Card"));
const UpgradePrompt = ({ featureName, onUpgrade }) => {
    return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-8 text-center bg-white rounded-xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mb-4", children: (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-16 w-16 text-orange-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }), (0, jsx_runtime_1.jsxs)("h2", { className: "text-2xl font-bold text-gray-800 mb-3", children: ["Upgrade to Access ", featureName] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mb-6 max-w-lg mx-auto", children: "This is a premium feature. Subscribe to a plan to unlock full access to career recommendations, AI-powered tools, and much more." }), (0, jsx_runtime_1.jsx)("button", { onClick: onUpgrade, className: "px-8 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transform hover:scale-105 transition-transform duration-300", children: "View Premium Plans" })] }) }));
};
exports.default = UpgradePrompt;
