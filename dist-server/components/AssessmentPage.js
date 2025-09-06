"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const constants_1 = require("../constants");
const Card_1 = __importDefault(require("./shared/Card"));
const AssessmentPage = ({ onSubmit, error }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = react_1.default.useState(0);
    const [answers, setAnswers] = react_1.default.useState([]);
    const handleAnswer = (answer) => {
        const questionText = constants_1.ASSESSMENT_QUESTIONS[currentQuestionIndex];
        const formattedAnswer = `${questionText}: ${answer}`;
        const newAnswers = [...answers, formattedAnswer];
        setAnswers(newAnswers);
        if (currentQuestionIndex < constants_1.ASSESSMENT_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        else {
            onSubmit(newAnswers);
        }
    };
    const progressPercentage = Math.round(((currentQuestionIndex) / constants_1.ASSESSMENT_QUESTIONS.length) * 100);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-2xl animate-fade-in", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-center mb-2 text-cyan-600", children: "Career Personality Test" }), (0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-600 mb-6", children: "For each statement, choose if you agree or disagree. Go with your first instinct!" }), error && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6", role: "alert", children: [(0, jsx_runtime_1.jsx)("strong", { className: "font-bold", children: "Error: " }), (0, jsx_runtime_1.jsx)("span", { className: "block sm:inline", children: error })] })), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2.5 mb-6", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-cyan-500 h-2.5 rounded-full", style: { width: `${progressPercentage}%`, transition: 'width 0.5s' } }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-8", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xl md:text-2xl text-center font-medium text-gray-800 mb-8 h-24 flex items-center justify-center", children: constants_1.ASSESSMENT_QUESTIONS[currentQuestionIndex] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-around", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleAnswer('Agree'), className: "w-40 px-6 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transform hover:scale-105 transition-all duration-300", children: "Agree" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleAnswer('Disagree'), className: "w-40 px-6 py-3 bg-gray-500 text-white font-bold rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transform hover:scale-105 transition-all duration-300", children: "Disagree" })] })] }) }), (0, jsx_runtime_1.jsxs)("p", { className: "text-center mt-4 text-sm text-gray-500", children: ["Question ", currentQuestionIndex + 1, " of ", constants_1.ASSESSMENT_QUESTIONS.length] })] }));
};
exports.default = AssessmentPage;
