"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Card_1 = __importDefault(require("../shared/Card"));
const UpgradeIcon = () => ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 mr-2 text-orange-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 11l7-7 7 7M5 19l7-7 7 7" }) }));
const UpgradeCard = ({ onUpgrade }) => {
    return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "mt-8 border-orange-300", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-5", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-bold text-gray-800 flex items-center mb-2", children: [(0, jsx_runtime_1.jsx)(UpgradeIcon, {}), "Upgrade Your Plan"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mb-4", children: "Unlock unlimited assessments, custom roadmaps, and more powerful features." }), (0, jsx_runtime_1.jsx)("button", { onClick: onUpgrade, className: "w-full py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors", children: "View Premium Plans" })] }) }));
};
exports.default = UpgradeCard;
