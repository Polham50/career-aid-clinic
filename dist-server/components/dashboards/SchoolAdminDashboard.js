"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const Card_1 = __importDefault(require("../shared/Card"));
const UpgradeCard_1 = __importDefault(require("./UpgradeCard"));
const UpgradePrompt_1 = __importDefault(require("./UpgradePrompt"));
const apiService_1 = require("../../services/apiService");
const Spinner_1 = __importDefault(require("../shared/Spinner"));
const mockTeachers = [
    { id: 1, name: 'Bamidele Adeboye', email: 'b.adeboye@school.com', role: 'SS1 Coordinator', status: 'Active' },
    { id: 2, name: 'Chisom Okoro', email: 'c.okoro@school.com', role: 'Head Counselor', status: 'Active' },
    { id: 3, name: 'Aisha Yusuf', email: 'a.yusuf@school.com', role: 'JSS3 Teacher', status: 'Invited' },
];
const mockHollandData = [
    { code: 'R', count: 180, color: 'bg-red-500' },
    { code: 'I', count: 250, color: 'bg-blue-500' },
    { code: 'A', count: 220, color: 'bg-purple-500' },
    { code: 'S', count: 310, color: 'bg-cyan-500' },
    { code: 'E', count: 190, color: 'bg-orange-500' },
    { code: 'C', count: 280, color: 'bg-indigo-500' },
];
const AddUserIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 mr-2", viewBox: "0 0 20 20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z", clipRule: "evenodd" }) });
const UploadIcon = () => (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" }) });
const SchoolAdminDashboard = ({ user, onUpgrade, isSubscribed }) => {
    const [activeTab, setActiveTab] = react_1.default.useState('overview');
    const [students, setStudents] = react_1.default.useState([]);
    const [isLoading, setIsLoading] = react_1.default.useState(true);
    const [error, setError] = react_1.default.useState(null);
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = react_1.default.useState(false);
    const [newStudent, setNewStudent] = react_1.default.useState({ name: '', classLevel: 'JSS3' });
    const STUDENT_LIMIT = user.isSubscribed ? 1000 : 20;
    const fetchStudents = react_1.default.useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedStudents = await (0, apiService_1.getSchoolStudents)();
            setStudents(fetchedStudents);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Could not fetch students.');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    react_1.default.useEffect(() => {
        if (activeTab === 'manageStudents') {
            fetchStudents();
        }
        else if (activeTab === 'overview') {
            // Fetch students in background for overview stats
            (0, apiService_1.getSchoolStudents)().then(setStudents).catch(console.error);
        }
    }, [activeTab, fetchStudents]);
    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (students.length >= STUDENT_LIMIT) {
            alert(`Student limit of ${STUDENT_LIMIT} reached. Please upgrade your plan to add more students.`);
            return;
        }
        if (newStudent.name && newStudent.classLevel) {
            try {
                const addedStudent = await (0, apiService_1.addSchoolStudent)(newStudent.name, newStudent.classLevel);
                setStudents(prev => [addedStudent, ...prev]);
                setNewStudent({ name: '', classLevel: 'JSS3' });
                setIsAddStudentModalOpen(false);
            }
            catch (err) {
                alert(err instanceof Error ? err.message : 'Failed to add student.');
            }
        }
    };
    const renderOverview = () => {
        const activeStudents = students.filter(s => s.status === 'Active').length;
        const completionRate = students.length > 0 ? Math.round((activeStudents / students.length) * 100) : 0;
        return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-6 text-center", children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-500", children: "Student Licenses" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-2xl font-bold text-gray-800", children: [students.length, " / ", STUDENT_LIMIT] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400", children: "Go to \"Manage Students\" to sync." })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-500", children: "Total Teachers" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-gray-800", children: mockTeachers.length })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-500", children: "Active Students" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-cyan-600", children: activeStudents })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-500", children: "Engagement Rate" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-2xl font-bold text-cyan-600", children: [completionRate, "%"] })] })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600 mb-4", children: "School-Wide Insights" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mb-2 font-semibold", children: "Holland Code Distribution:" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1.5", children: mockHollandData.map(item => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-8 font-bold text-gray-600", children: item.code }), (0, jsx_runtime_1.jsx)("div", { className: "flex-grow bg-gray-200 rounded-full h-5", children: (0, jsx_runtime_1.jsx)("div", { className: `${item.color} h-5 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold`, style: { width: `${(item.count / 400) * 100}%` }, children: item.count }) })] }, item.code))) })] }) })] }));
    };
    const renderManageStudents = () => ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600", children: "Student Roster" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-500 text-sm", children: [students.length, " / ", STUDENT_LIMIT, " Students Registered"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2 mt-4 sm:mt-0", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => alert("Bulk upload functionality coming soon!"), className: "flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors", children: [(0, jsx_runtime_1.jsx)(UploadIcon, {}), " Bulk Upload"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsAddStudentModalOpen(true), className: "flex items-center justify-center px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors", children: [(0, jsx_runtime_1.jsx)(AddUserIcon, {}), " Add New Student"] })] })] }), isLoading && (0, jsx_runtime_1.jsx)(Spinner_1.default, { message: "Loading students..." }), error && (0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-center p-4", children: error }), !isLoading && !error && ((0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full text-left text-sm", children: [(0, jsx_runtime_1.jsx)("thead", { className: "border-b border-gray-200 text-gray-500", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Student Name" }), (0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Class" }), (0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Access Code" }), (0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "py-2 px-3", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: students.map(student => ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-3 px-3 font-medium text-gray-800", children: student.name }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-3 text-gray-600", children: student.classLevel }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-3 font-mono text-orange-600", children: student.accessCode }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-3", children: (0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 text-xs font-semibold rounded-full ${student.status === 'Active' ? 'bg-cyan-100 text-cyan-800' : 'bg-orange-100 text-orange-800'}`, children: student.status }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-3", children: (0, jsx_runtime_1.jsx)("button", { className: "text-red-600 hover:text-red-500 text-xs", children: "Remove" }) })] }, student._id))) })] }) }))] }) }));
    const renderManageTeachers = () => ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-cyan-600", children: "Teacher & Counselor Roster" }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => alert("Invite teacher functionality coming soon!"), className: "flex items-center justify-center px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors mt-4 sm:mt-0", children: [(0, jsx_runtime_1.jsx)(AddUserIcon, {}), " Invite New Staff"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsx)("table", { className: "w-full text-left text-sm" }) })] }) }));
    const renderAddStudentModal = () => ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in", children: (0, jsx_runtime_1.jsx)(Card_1.default, { className: "w-full max-w-md", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleAddStudent, className: "p-8", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-gray-800 mb-4", children: "Register a New Student" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "studentName", className: "block text-sm font-medium text-gray-600 mb-1", children: "Full Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "studentName", value: newStudent.name, onChange: (e) => setNewStudent({ ...newStudent, name: e.target.value }), required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "classLevel", className: "block text-sm font-medium text-gray-600 mb-1", children: "Class Level" }), (0, jsx_runtime_1.jsxs)("select", { id: "classLevel", value: newStudent.classLevel, onChange: (e) => setNewStudent({ ...newStudent, classLevel: e.target.value }), required: true, className: "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "JSS3", children: "JSS3" }), (0, jsx_runtime_1.jsx)("option", { value: "SS1", children: "SS1" }), (0, jsx_runtime_1.jsx)("option", { value: "SS2", children: "SS2" }), (0, jsx_runtime_1.jsx)("option", { value: "SS3", children: "SS3" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 flex justify-end space-x-3", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setIsAddStudentModalOpen(false), className: "px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700", children: "Register Student" })] })] }) }) }));
    const renderContent = () => {
        const isLocked = !isSubscribed;
        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'manageStudents': return renderManageStudents();
            case 'manageTeachers': return renderManageTeachers();
            case 'analytics':
                if (isLocked)
                    return (0, jsx_runtime_1.jsx)(UpgradePrompt_1.default, { featureName: "Analytics", onUpgrade: onUpgrade });
                return (0, jsx_runtime_1.jsx)("p", { children: "Analytics coming soon." });
            case 'reports':
                if (isLocked)
                    return (0, jsx_runtime_1.jsx)(UpgradePrompt_1.default, { featureName: "Reports", onUpgrade: onUpgrade });
                return (0, jsx_runtime_1.jsx)("p", { children: "Reports coming soon." });
            default: return null;
        }
    };
    const NavButton = ({ tab, label }) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => {
            if (!isSubscribed && (tab === 'analytics' || tab === 'reports')) {
                onUpgrade();
            }
            else {
                setActiveTab(tab);
            }
        }, className: `w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors relative ${activeTab === tab ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`, children: [label, !isSubscribed && (tab === 'analytics' || tab === 'reports') && ((0, jsx_runtime_1.jsx)("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-orange-400", children: (0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z", clipRule: "evenodd" }) }) }))] }));
    return ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [isAddStudentModalOpen && renderAddStudentModal(), (0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600", children: "School Administrator Dashboard" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-lg text-gray-500 mt-1", children: ["Welcome, ", user.name, "! Manage your institution's access."] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row md:space-x-8", children: [(0, jsx_runtime_1.jsxs)("aside", { className: "md:w-1/4 flex-shrink-0 mb-8 md:mb-0", children: [(0, jsx_runtime_1.jsxs)("nav", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(NavButton, { tab: "overview", label: "Overview" }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "manageStudents", label: "Manage Students" }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "manageTeachers", label: "Manage Teachers" }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "analytics", label: "Analytics" }), (0, jsx_runtime_1.jsx)(NavButton, { tab: "reports", label: "Reports" })] }), !isSubscribed && (0, jsx_runtime_1.jsx)(UpgradeCard_1.default, { onUpgrade: onUpgrade })] }), (0, jsx_runtime_1.jsx)("main", { className: "flex-grow md:w-3/4", children: renderContent() })] })] })] }));
};
exports.default = SchoolAdminDashboard;
