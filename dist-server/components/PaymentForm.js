"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Card_1 = __importDefault(require("./shared/Card"));
const Spinner_1 = __importDefault(require("./shared/Spinner"));
const apiService_1 = require("../services/apiService");
const PaymentForm = ({ user, plan, onClose, onSuccess, }) => {
    const [status, setStatus] = react_1.default.useState("initializing");
    const [error, setError] = react_1.default.useState(null);
    const [publicKey, setPublicKey] = react_1.default.useState(null);
    const [userDetails, setUserDetails] = react_1.default.useState({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
    });
    react_1.default.useEffect(() => {
        const fetchConfig = async () => {
            setStatus("fetching_config");
            console.log("PaymentForm: Fetching payment config...");
            try {
                const config = await (0, apiService_1.getPaymentConfig)();
                if (!config.publicKey) {
                    throw new Error("Public key was not returned from the server.");
                }
                setPublicKey(config.publicKey);
                console.log("PaymentForm: Payment config fetched successfully.");
                setStatus("ready");
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "An unknown error occurred";
                console.error("PaymentForm: Failed to fetch payment config:", message);
                setError(`Could not initialize payment gateway: ${message}`);
                setStatus("error");
            }
        };
        fetchConfig();
    }, []);
    const handleChange = (e) => {
        const { id, value } = e.target;
        setUserDetails((prev) => ({ ...prev, [id]: value }));
    };
    const handlePaystackPayment = async () => {
        if (!publicKey || !plan.priceValue)
            return;
        if (!userDetails.email || !userDetails.name || !userDetails.phone) {
            alert("Please fill in all your details.");
            return;
        }
        try {
            // Lazy-load Paystack only when needed
            const { default: PaystackPop } = await Promise.resolve().then(() => __importStar(require("@paystack/inline-js")));
            const paystack = new PaystackPop();
            paystack.newTransaction({
                key: publicKey,
                email: userDetails.email,
                amount: plan.priceValue * 100, // kobo
                reference: "" + Math.floor(Math.random() * 1000000000 + 1),
                metadata: {
                    user_id: user._id || user.id,
                    plan_name: plan.name,
                    full_name: userDetails.name,
                    phone_number: userDetails.phone,
                },
                onSuccess: async (transaction) => {
                    setStatus("verifying");
                    try {
                        const verification = await (0, apiService_1.verifyPaystackPayment)(transaction.reference);
                        if (verification.success) {
                            onSuccess();
                        }
                        else {
                            setError(verification.message || "Payment verification failed.");
                            setStatus("error");
                        }
                    }
                    catch (err) {
                        const message = err instanceof Error ? err.message : "An unknown error occurred.";
                        setError(`Payment could not be confirmed: ${message}`);
                        setStatus("error");
                    }
                },
                onCancel: () => {
                    console.log("Payment window closed by user.");
                },
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Payment could not be started: ${message}`);
            setStatus("error");
        }
    };
    const getButtonText = () => {
        switch (status) {
            case "initializing":
            case "fetching_config":
                return "Initializing...";
            case "ready":
                return `Pay ${plan.price} Securely`;
            case "verifying":
                return "Verifying Payment...";
            case "error":
                return "Retry Payment";
            default:
                return "Please Wait";
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 animate-fade-in p-4", children: (0, jsx_runtime_1.jsx)(Card_1.default, { className: "w-full max-w-md", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 md:p-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-800", children: "Complete Your Purchase" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-500", children: ["You are subscribing to the", " ", (0, jsx_runtime_1.jsx)("strong", { className: "text-cyan-600", children: plan.name }), " plan."] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 text-3xl leading-none", children: "\u00D7" })] }), status === "verifying" ? ((0, jsx_runtime_1.jsx)("div", { className: "min-h-[250px] flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(Spinner_1.default, { message: "Verifying your payment, please do not close this window..." }) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-600 mb-1", children: "Full Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "name", value: userDetails.name, onChange: handleChange, required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-600 mb-1", children: "Email for Receipt" }), (0, jsx_runtime_1.jsx)("input", { type: "email", id: "email", value: userDetails.email, onChange: handleChange, required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-600 mb-1", children: "Phone Number" }), (0, jsx_runtime_1.jsx)("input", { type: "tel", id: "phone", value: userDetails.phone, onChange: handleChange, required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handlePaystackPayment, 
                                // FIX: Corrected the disabled logic. The check for "verifying" was causing a TS error because this button is not rendered when status is "verifying". Also added "initializing".
                                disabled: status === "initializing" || status === "fetching_config", className: `w-full py-3 mt-4 font-bold rounded-lg transition-colors
                  ${status === "ready"
                                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                                    : status === "error"
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-gray-400 text-white cursor-not-allowed"}`, children: getButtonText() }), error && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 text-red-700 p-3 mt-4 rounded-lg text-sm text-center", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Error:" }), " ", error] }))] }))] }) }) }));
};
exports.default = PaymentForm;
