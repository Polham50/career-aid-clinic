"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Spinner = ({ message }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center text-center p-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-lg text-gray-600", children: message })] }));
};
exports.default = Spinner;
