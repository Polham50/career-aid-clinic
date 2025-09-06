"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const types_1 = require("./types");
const HomePage_1 = __importDefault(require("./components/HomePage"));
const SignUpPage_1 = __importDefault(require("./components/SignUpPage"));
const LoginPage_1 = __importDefault(require("./components/LoginPage"));
const DashboardPage_1 = __importDefault(require("./components/DashboardPage"));
const apiService_1 = require("./services/apiService");
const Spinner_1 = __importDefault(require("./components/shared/Spinner"));
const Header_1 = __importDefault(require("./components/shared/Header"));
const Footer_1 = __importDefault(require("./components/shared/Footer"));
const SubscriptionPage_1 = __importDefault(require("./components/SubscriptionPage"));
const MockInterviewPage_1 = __importDefault(require("./components/MockInterviewPage"));
const AwaitingConfirmationPage_1 = __importDefault(require("./components/AwaitingConfirmationPage"));
const ForgotPasswordPage_1 = __importDefault(require("./components/ForgotPasswordPage"));
const ResetPasswordPage_1 = __importDefault(require("./components/ResetPasswordPage"));
const App = () => {
    const [phase, setPhase] = react_1.default.useState(types_1.AppPhase.INIT);
    const [user, setUser] = react_1.default.useState(null);
    const [careerProfiles, setCareerProfiles] = react_1.default.useState([]);
    const [error, setError] = react_1.default.useState(null);
    const [selectedCareer, setSelectedCareer] = react_1.default.useState(null);
    const [isSubscribed, setIsSubscribed] = react_1.default.useState(false);
    const [notification, setNotification] = react_1.default.useState(null);
    const [actionToken, setActionToken] = react_1.default.useState(null);
    const [userEmailForConfirmation, setUserEmailForConfirmation] = react_1.default.useState(null);
    const [redirectToRecommendations, setRedirectToRecommendations] = react_1.default.useState(false);
    const [assessmentAnswers, setAssessmentAnswers] = react_1.default.useState(null);
    const [isLoading, setIsLoading] = react_1.default.useState(false);
    const [loadingMessage, setLoadingMessage] = react_1.default.useState('');
    react_1.default.useEffect(() => {
        const initializeApp = async () => {
            // Hash-based routing for SPA actions like email confirmation
            const hash = window.location.hash.substring(1); // from '#/confirm?token=xyz' to '/confirm?token=xyz'
            if (hash) {
                const [path, queryString] = hash.split('?');
                const params = new URLSearchParams(queryString);
                const token = params.get('token');
                if (path.startsWith('/confirm') && token) {
                    setActionToken(token);
                    setPhase(types_1.AppPhase.AWAITING_CONFIRMATION);
                    return;
                }
                if (path.startsWith('/reset') && token) {
                    setActionToken(token);
                    setPhase(types_1.AppPhase.RESET_PASSWORD);
                    return;
                }
            }
            // If no URL action, proceed with reauthentication
            const authToken = localStorage.getItem('authToken');
            if (authToken) {
                try {
                    const loggedInUser = await (0, apiService_1.getMe)();
                    await handleLoginSuccess(loggedInUser);
                }
                catch (error) {
                    console.error("Reauthentication failed:", error);
                    localStorage.removeItem('authToken');
                    setPhase(types_1.AppPhase.HOME);
                }
            }
            else {
                setPhase(types_1.AppPhase.HOME);
            }
        };
        initializeApp();
    }, []);
    const resetToHome = () => {
        setPhase(types_1.AppPhase.HOME);
        setError(null);
        setCareerProfiles([]);
        setUser(null);
        setSelectedCareer(null);
        setIsSubscribed(false);
        setNotification(null);
        setActionToken(null);
        setUserEmailForConfirmation(null);
        setAssessmentAnswers(null);
        setRedirectToRecommendations(false);
        setIsLoading(false);
    };
    const goToSignUp = () => {
        setPhase(types_1.AppPhase.SIGNUP);
        setNotification(null);
    };
    const goToLogin = () => {
        setPhase(types_1.AppPhase.LOGIN);
    };
    const goToSubscription = () => {
        setPhase(types_1.AppPhase.SUBSCRIPTION);
    };
    const goToForgotPassword = () => {
        setPhase(types_1.AppPhase.FORGOT_PASSWORD);
    };
    const clearError = () => setError(null);
    const handleSubscriptionSuccess = async () => {
        alert('Subscription successful! Your plan has been upgraded.');
        // Refetch user data to get the new subscription status
        if (user?._id) {
            setIsLoading(true);
            setLoadingMessage('Activating your premium features...');
            try {
                const updatedUser = await (0, apiService_1.getMe)();
                setUser(updatedUser);
                setIsSubscribed(updatedUser.isSubscribed || false);
                if (assessmentAnswers) {
                    setLoadingMessage('Finalizing your subscription and generating your profile...');
                    const newProfile = await (0, apiService_1.getCareerProfile)(assessmentAnswers);
                    setCareerProfiles(prev => [newProfile, ...prev]);
                    setAssessmentAnswers(null); // Clear temp answers
                    setRedirectToRecommendations(true);
                }
            }
            catch (e) {
                console.error(e);
                setError("Failed to update your account after subscription. Please re-login.");
            }
            finally {
                setIsLoading(false);
                setPhase(types_1.AppPhase.DASHBOARD);
            }
        }
        else {
            setPhase(types_1.AppPhase.DASHBOARD);
        }
    };
    const handleStartInterview = (careerName) => {
        setSelectedCareer(careerName);
        setPhase(types_1.AppPhase.MOCK_INTERVIEW);
    };
    const handleEndInterview = () => {
        setPhase(types_1.AppPhase.DASHBOARD);
        setSelectedCareer(null);
    };
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        resetToHome();
    };
    const handleSignUpSuccess = (email, token) => {
        setUserEmailForConfirmation(email);
        setActionToken(token);
        setPhase(types_1.AppPhase.AWAITING_CONFIRMATION);
    };
    const handleConfirmationSuccess = () => {
        setNotification("Email confirmed successfully! Please log in.");
        setUserEmailForConfirmation(null);
        setActionToken(null);
        setPhase(types_1.AppPhase.LOGIN);
    };
    const handleResetPasswordSuccess = () => {
        setNotification("Your password has been reset successfully. Please log in.");
        setActionToken(null);
        setPhase(types_1.AppPhase.LOGIN);
    };
    const handleLoginSuccess = async (loggedInUser) => {
        setUser(loggedInUser);
        setNotification(null);
        setIsLoading(true);
        setLoadingMessage('Loading your dashboard...');
        try {
            if (loggedInUser._id) {
                const profiles = await (0, apiService_1.getProfilesForUser)(loggedInUser._id);
                setCareerProfiles(profiles);
            }
            setIsSubscribed(!!loggedInUser.isSubscribed || !!loggedInUser.isSchoolSponsored);
        }
        catch (err) {
            console.error("Failed to fetch user profiles:", err);
            setError("Could not load your saved profiles. Please try again later.");
        }
        finally {
            setIsLoading(false);
            setPhase(types_1.AppPhase.DASHBOARD);
        }
    };
    const submitAssessment = react_1.default.useCallback(async (answers, childId) => {
        if (!user?._id && !childId) {
            setError("You must be logged in to submit an assessment.");
            setPhase(types_1.AppPhase.LOGIN);
            return;
        }
        setIsLoading(true);
        setLoadingMessage('Analyzing your personality and matching careers... This may take a moment.');
        setError(null);
        // School-sponsored students or subscribed users can take the assessment directly
        if (isSubscribed) {
            try {
                const newProfile = await (0, apiService_1.getCareerProfile)(answers, childId);
                // Only refresh the main user's profiles if they took it for themselves
                if (!childId && user?._id) {
                    const profiles = await (0, apiService_1.getProfilesForUser)(user._id);
                    setCareerProfiles(profiles);
                }
            }
            catch (e) {
                console.error(e);
                const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
                setError(errorMessage);
                throw e; // Re-throw to be caught in the component
            }
            finally {
                setIsLoading(false);
                if (!childId) {
                    setPhase(types_1.AppPhase.DASHBOARD);
                }
            }
        }
        else { // Freemium users must upgrade
            setIsLoading(false);
            setAssessmentAnswers(answers);
            setRedirectToRecommendations(true);
            setPhase(types_1.AppPhase.SUBSCRIPTION);
        }
    }, [user, isSubscribed]);
    const renderContent = () => {
        switch (phase) {
            case types_1.AppPhase.HOME:
                return (0, jsx_runtime_1.jsx)(HomePage_1.default, { onStart: goToSignUp });
            case types_1.AppPhase.SIGNUP:
                return (0, jsx_runtime_1.jsx)(SignUpPage_1.default, { onSignUpSuccess: handleSignUpSuccess, onGoToLogin: goToLogin });
            case types_1.AppPhase.LOGIN:
                return (0, jsx_runtime_1.jsx)(LoginPage_1.default, { onLoginSuccess: handleLoginSuccess, onGoToSignUp: goToSignUp, onGoToForgotPassword: goToForgotPassword, notification: notification });
            case types_1.AppPhase.AWAITING_CONFIRMATION:
                if (!userEmailForConfirmation && !actionToken) {
                    resetToHome();
                    return null;
                }
                return (0, jsx_runtime_1.jsx)(AwaitingConfirmationPage_1.default, { email: userEmailForConfirmation, token: actionToken, onConfirmSuccess: handleConfirmationSuccess });
            case types_1.AppPhase.FORGOT_PASSWORD:
                return (0, jsx_runtime_1.jsx)(ForgotPasswordPage_1.default, { onGoToLogin: goToLogin });
            case types_1.AppPhase.RESET_PASSWORD:
                if (!actionToken) {
                    goToLogin();
                    return null;
                }
                return (0, jsx_runtime_1.jsx)(ResetPasswordPage_1.default, { token: actionToken, onResetSuccess: handleResetPasswordSuccess });
            case types_1.AppPhase.DASHBOARD:
                if (!user) {
                    resetToHome();
                    return (0, jsx_runtime_1.jsx)(HomePage_1.default, { onStart: goToSignUp });
                }
                return (0, jsx_runtime_1.jsx)(DashboardPage_1.default, { user: user, careerProfiles: careerProfiles, onSubmitAssessment: submitAssessment, error: error, onUpgrade: goToSubscription, onStartInterview: handleStartInterview, isSubscribed: isSubscribed, redirectToRecommendations: redirectToRecommendations, onRedirectConsumed: () => setRedirectToRecommendations(false), onErrorAcknowledged: clearError });
            case types_1.AppPhase.SUBSCRIPTION:
                return (0, jsx_runtime_1.jsx)(SubscriptionPage_1.default, { user: user, onBack: () => setPhase(types_1.AppPhase.DASHBOARD), onSubscriptionSuccess: handleSubscriptionSuccess });
            case types_1.AppPhase.MOCK_INTERVIEW:
                if (!selectedCareer) {
                    setPhase(types_1.AppPhase.DASHBOARD);
                    return null;
                }
                return (0, jsx_runtime_1.jsx)(MockInterviewPage_1.default, { careerName: selectedCareer, onEndInterview: handleEndInterview });
            default:
                return (0, jsx_runtime_1.jsx)(HomePage_1.default, { onStart: goToSignUp });
        }
    };
    const mainContainerClasses = `flex-grow container mx-auto px-4 py-8 flex flex-col items-center ${(phase !== types_1.AppPhase.DASHBOARD && phase !== types_1.AppPhase.MOCK_INTERVIEW) ? 'justify-center' : ''}`;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gray-100 text-gray-800 flex flex-col", children: [(isLoading || phase === types_1.AppPhase.INIT) && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsx)(Spinner_1.default, { message: isLoading ? loadingMessage : "Initializing..." }) })), (0, jsx_runtime_1.jsx)(Header_1.default, { user: user, onLogoClick: resetToHome, onSignUp: goToSignUp, onLogin: goToLogin, onLogout: handleLogout }), (0, jsx_runtime_1.jsx)("main", { className: mainContainerClasses, children: phase !== types_1.AppPhase.INIT && renderContent() }), (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
};
exports.default = App;
