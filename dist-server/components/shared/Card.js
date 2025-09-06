"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Card = ({ children, className = '', onClick }) => {
    return ((0, jsx_runtime_1.jsx)("div", { onClick: onClick, className: `bg-white border border-gray-200 rounded-xl shadow-md ${className}`, children: children }));
};
exports.default = Card;
