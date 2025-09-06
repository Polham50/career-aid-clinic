"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const StudentDashboard_1 = __importDefault(require("./dashboards/StudentDashboard"));
const ParentDashboard_1 = __importDefault(require("./dashboards/ParentDashboard"));
const TeacherDashboard_1 = __importDefault(require("./dashboards/TeacherDashboard"));
const SchoolAdminDashboard_1 = __importDefault(require("./dashboards/SchoolAdminDashboard"));
const CbtCentreDashboard_1 = __importDefault(require("./dashboards/CbtCentreDashboard"));
const DashboardPage = ({ user, careerProfiles, onSubmitAssessment, error, onUpgrade, onStartInterview, isSubscribed, redirectToRecommendations, onRedirectConsumed, onErrorAcknowledged }) => {
    const renderDashboardByRole = () => {
        const commonProps = { user, profiles: careerProfiles, onSubmitAssessment, error, onUpgrade, onStartInterview, isSubscribed, onErrorAcknowledged };
        switch (user.role) {
            case 'Student':
                return (0, jsx_runtime_1.jsx)(StudentDashboard_1.default, { ...commonProps, redirectToRecommendations: redirectToRecommendations, onRedirectConsumed: onRedirectConsumed });
            case 'Parent/Guardian':
                return (0, jsx_runtime_1.jsx)(ParentDashboard_1.default, { ...commonProps });
            case 'Counselor/Teacher':
                return (0, jsx_runtime_1.jsx)(TeacherDashboard_1.default, { ...commonProps });
            case 'School Administrator':
                return (0, jsx_runtime_1.jsx)(SchoolAdminDashboard_1.default, { ...commonProps });
            case 'JAMB CBT Centre':
                return (0, jsx_runtime_1.jsx)(CbtCentreDashboard_1.default, { ...commonProps });
            default:
                return (0, jsx_runtime_1.jsx)("div", { className: "text-center text-red-500", children: "Error: Unknown user role." });
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full animate-fade-in-up", children: renderDashboardByRole() }));
};
exports.default = DashboardPage;
