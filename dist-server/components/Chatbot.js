"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const apiService_1 = require("../services/apiService");
const Card_1 = __importDefault(require("./shared/Card"));
const BotMessage = ({ text }) => {
    const renderPart = (part, key) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (0, jsx_runtime_1.jsx)("strong", { children: part.slice(2, -2) }, key);
        }
        return part;
    };
    const blocks = text.split('\n\n'); // Split by double newline for paragraphs
    return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: blocks.map((block, index) => {
            const trimmedBlock = block.trim();
            // Check if the block is a list
            if (trimmedBlock.startsWith('* ') || trimmedBlock.startsWith('- ')) {
                const listItems = block.split('\n').map(item => item.trim().replace(/^[\*\-]\s*/, ''));
                return ((0, jsx_runtime_1.jsx)("ul", { className: "list-disc list-inside space-y-1", children: listItems.map((item, i) => ((0, jsx_runtime_1.jsx)("li", { children: item.split(/(\*\*.*?\*\*)/g).map(renderPart) }, i))) }, index));
            }
            // Otherwise, it's a paragraph
            return ((0, jsx_runtime_1.jsx)("p", { children: block.split(/(\*\*.*?\*\*)/g).map(renderPart) }, index));
        }) }));
};
const Chatbot = ({ careerProfile }) => {
    const [messages, setMessages] = react_1.default.useState([]);
    const [input, setInput] = react_1.default.useState('');
    const [isLoading, setIsLoading] = react_1.default.useState(false);
    const messagesEndRef = react_1.default.useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    react_1.default.useEffect(scrollToBottom, [messages]);
    const handleSend = async () => {
        if (!input.trim() || isLoading)
            return;
        const userMessage = { role: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        const botMessage = { role: 'bot', text: '' };
        setMessages((prev) => [...prev, botMessage]);
        try {
            const stream = await (0, apiService_1.getChatResponseStream)(careerProfile, [...messages, userMessage]);
            let text = '';
            for await (const chunk of stream) {
                text += chunk;
                setMessages((prev) => prev.map((msg, index) => index === prev.length - 1 ? { ...msg, text: text } : msg));
            }
        }
        catch (error) {
            console.error('Chatbot error:', error);
            const errorText = 'Sorry, I encountered an error. Please try again.';
            setMessages((prev) => prev.map((msg, index) => index === prev.length - 1 ? { ...msg, text: errorText } : msg));
        }
        finally {
            setIsLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4 md:p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-center text-cyan-600 mb-4", children: "Career Clinic" }), (0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-500 mb-6", children: "Have more questions? Ask our AI counselor in the Career Clinic!" }), (0, jsx_runtime_1.jsxs)("div", { className: "h-96 bg-gray-100 rounded-lg p-4 overflow-y-auto flex flex-col space-y-4", children: [messages.map((msg, index) => ((0, jsx_runtime_1.jsx)("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: `max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-800'}`, children: [msg.role === 'user' ? msg.text : null, msg.role === 'bot' && msg.text ? (0, jsx_runtime_1.jsx)(BotMessage, { text: msg.text }) : null, msg.role === 'bot' && !msg.text && (0, jsx_runtime_1.jsx)("span", { className: "italic", children: "Thinking..." })] }) }, index))), (0, jsx_runtime_1.jsx)("div", { ref: messagesEndRef })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 flex", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSend(), placeholder: "Ask about skills, courses, or jobs...", className: "flex-grow bg-white border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-800", disabled: isLoading }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSend, disabled: isLoading, className: "bg-cyan-600 text-white font-bold rounded-r-full px-6 py-2 hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed", children: "Send" })] })] }) }));
};
exports.default = Chatbot;
