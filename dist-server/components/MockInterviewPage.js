"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const apiService_1 = require("../services/apiService");
const Card_1 = __importDefault(require("./shared/Card"));
const Spinner_1 = __importDefault(require("./shared/Spinner"));
const MockInterviewPage = ({ careerName, onEndInterview }) => {
    const [questions, setQuestions] = react_1.default.useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = react_1.default.useState(0);
    const [userAnswer, setUserAnswer] = react_1.default.useState('');
    const [feedback, setFeedback] = react_1.default.useState(null);
    const [isLoading, setIsLoading] = react_1.default.useState(true);
    const [isGettingFeedback, setIsGettingFeedback] = react_1.default.useState(false);
    react_1.default.useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true);
            try {
                const fetchedQuestions = await (0, apiService_1.getMockInterviewQuestions)(careerName);
                setQuestions(fetchedQuestions);
            }
            catch (error) {
                console.error("Failed to fetch interview questions:", error);
                setFeedback("Sorry, I couldn't load the interview questions. Please try again later.");
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, [careerName]);
    const handleSubmitAnswer = async () => {
        if (!userAnswer.trim())
            return;
        setIsGettingFeedback(true);
        setFeedback(null);
        try {
            const currentQuestion = questions[currentQuestionIndex].question;
            const fetchedFeedback = await (0, apiService_1.getInterviewFeedback)(currentQuestion, userAnswer);
            setFeedback(fetchedFeedback);
        }
        catch (error) {
            console.error("Failed to get feedback:", error);
            setFeedback("There was an error getting feedback for your answer.");
        }
        finally {
            setIsGettingFeedback(false);
        }
    };
    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setUserAnswer('');
            setFeedback(null);
        }
        else {
            // End of interview
            alert("You've completed the mock interview!");
            onEndInterview();
        }
    };
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(Spinner_1.default, { message: `Preparing interview questions for a ${careerName}...` });
    }
    const currentQuestion = questions[currentQuestionIndex];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-4xl animate-fade-in-up", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8 text-center", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600", children: ["Mock Interview: ", careerName] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-lg text-gray-600", children: "Practice makes perfect. Let's begin." })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 md:p-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: `px-2.5 py-1 text-xs font-semibold rounded-full ${currentQuestion.type === 'Behavioral' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`, children: currentQuestion.type }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-gray-500", children: ["Question ", currentQuestionIndex + 1, " of ", questions.length] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl font-semibold text-gray-800", children: currentQuestion.question })] }), (0, jsx_runtime_1.jsx)("textarea", { value: userAnswer, onChange: (e) => setUserAnswer(e.target.value), placeholder: "Structure your answer here...", className: "w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none min-h-[150px]", disabled: isGettingFeedback || !!feedback }), isGettingFeedback && (0, jsx_runtime_1.jsx)(Spinner_1.default, { message: "Analyzing your answer..." }), feedback && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6 bg-cyan-50/50 p-4 rounded-lg border border-cyan-200 animate-fade-in", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-bold text-lg text-cyan-700 mb-2", children: "AI Feedback" }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-700 space-y-2", dangerouslySetInnerHTML: { __html: feedback } })] })), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onEndInterview, className: "text-gray-500 hover:text-gray-800 transition-colors", children: "End Interview" }), (0, jsx_runtime_1.jsx)("div", { children: !feedback ? ((0, jsx_runtime_1.jsx)("button", { onClick: handleSubmitAnswer, disabled: isGettingFeedback || !userAnswer.trim(), className: "px-6 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed", children: "Submit for Feedback" })) : ((0, jsx_runtime_1.jsx)("button", { onClick: handleNextQuestion, className: "px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none", children: currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview' })) })] })] }) })] }));
};
exports.default = MockInterviewPage;
