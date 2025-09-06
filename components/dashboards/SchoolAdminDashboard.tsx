import React from 'react';
import { User } from '../../types';
import Card from '../shared/Card';
import UpgradeCard from './UpgradeCard';
import UpgradePrompt from './UpgradePrompt';
import { getSchoolStudents, addSchoolStudent, SchoolStudent } from '../../services/apiService';
import Spinner from '../shared/Spinner';

interface Teacher {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Invited';
}

const mockTeachers: Teacher[] = [
    { id: 1, name: 'Bamidele Adeboye', email: 'b.adeboye@school.com', role: 'SS1 Coordinator', status: 'Active' },
    { id: 2, name: 'Chisom Okoro', email: 'c.okoro@school.com', role: 'Head Counselor', status: 'Active' },
    { id: 3, name: 'Aisha Yusuf', email: 'a.yusuf@school.com', role: 'JSS3 Teacher', status: 'Invited' },
]

const mockHollandData = [
    { code: 'R', count: 180, color: 'bg-red-500' },
    { code: 'I', count: 250, color: 'bg-blue-500' },
    { code: 'A', count: 220, color: 'bg-purple-500' },
    { code: 'S', count: 310, color: 'bg-cyan-500' },
    { code: 'E', count: 190, color: 'bg-orange-500' },
    { code: 'C', count: 280, color: 'bg-indigo-500' },
];

interface SchoolAdminDashboardProps {
  user: User;
  onUpgrade: () => void;
  isSubscribed: boolean;
}

type Tab = 'overview' | 'manageStudents' | 'manageTeachers' | 'analytics' | 'reports';

const AddUserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

const SchoolAdminDashboard: React.FC<SchoolAdminDashboardProps> = ({ user, onUpgrade, isSubscribed }) => {
  const [activeTab, setActiveTab] = React.useState<Tab>('overview');
  const [students, setStudents] = React.useState<SchoolStudent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string|null>(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = React.useState(false);
  const [newStudent, setNewStudent] = React.useState({ name: '', classLevel: 'JSS3' });
  
  const STUDENT_LIMIT = user.isSubscribed ? 1000 : 20;

  const fetchStudents = React.useCallback(async () => {
    try {
        setIsLoading(true);
        setError(null);
        const fetchedStudents = await getSchoolStudents();
        setStudents(fetchedStudents);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not fetch students.');
    } finally {
        setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab === 'manageStudents') {
        fetchStudents();
    } else if (activeTab === 'overview') {
        // Fetch students in background for overview stats
        getSchoolStudents().then(setStudents).catch(console.error);
    }
  }, [activeTab, fetchStudents]);
  
  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (students.length >= STUDENT_LIMIT) {
        alert(`Student limit of ${STUDENT_LIMIT} reached. Please upgrade your plan to add more students.`);
        return;
    }
    if (newStudent.name && newStudent.classLevel) {
        try {
            const addedStudent = await addSchoolStudent(newStudent.name, newStudent.classLevel);
            setStudents(prev => [addedStudent, ...prev]);
            setNewStudent({ name: '', classLevel: 'JSS3' });
            setIsAddStudentModalOpen(false);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to add student.');
        }
    }
  }

  const renderOverview = () => {
    const activeStudents = students.filter(s => s.status === 'Active').length;
    const completionRate = students.length > 0 ? Math.round((activeStudents / students.length) * 100) : 0;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <Card className="p-4">
                    <p className="text-sm font-medium text-gray-500">Student Licenses</p>
                    <p className="text-2xl font-bold text-gray-800">{students.length} / {STUDENT_LIMIT}</p>
                    <p className="text-xs text-gray-400">Go to "Manage Students" to sync.</p>
                </Card>
                <Card className="p-4">
                    <p className="text-sm font-medium text-gray-500">Total Teachers</p>
                    <p className="text-2xl font-bold text-gray-800">{mockTeachers.length}</p>
                </Card>
                 <Card className="p-4">
                    <p className="text-sm font-medium text-gray-500">Active Students</p>
                    <p className="text-2xl font-bold text-cyan-600">{activeStudents}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-sm font-medium text-gray-500">Engagement Rate</p>
                    <p className="text-2xl font-bold text-cyan-600">{completionRate}%</p>
                </Card>
            </div>
             <Card>
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-cyan-600 mb-4">School-Wide Insights</h3>
                     <p className="text-sm text-gray-500 mb-2 font-semibold">Holland Code Distribution:</p>
                    <div className="space-y-1.5">
                        {mockHollandData.map(item => (
                            <div key={item.code} className="flex items-center">
                                <span className="w-8 font-bold text-gray-600">{item.code}</span>
                                <div className="flex-grow bg-gray-200 rounded-full h-5">
                                    <div className={`${item.color} h-5 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold`} style={{ width: `${(item.count / 400) * 100}%` }}>{item.count}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    )
  };
  
  const renderManageStudents = () => (
    <Card>
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-cyan-600">Student Roster</h3>
                    <p className="text-gray-500 text-sm">{students.length} / {STUDENT_LIMIT} Students Registered</p>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                    <button onClick={() => alert("Bulk upload functionality coming soon!")} className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                        <UploadIcon /> Bulk Upload
                    </button>
                    <button onClick={() => setIsAddStudentModalOpen(true)} className="flex items-center justify-center px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors">
                        <AddUserIcon /> Add New Student
                    </button>
                </div>
            </div>
            {isLoading && <Spinner message="Loading students..." />}
            {error && <p className="text-red-500 text-center p-4">{error}</p>}
            {!isLoading && !error && (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200 text-gray-500">
                            <tr>
                                <th className="py-2 px-3">Student Name</th>
                                <th className="py-2 px-3">Class</th>
                                <th className="py-2 px-3">Access Code</th>
                                <th className="py-2 px-3">Status</th>
                                <th className="py-2 px-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-3 font-medium text-gray-800">{student.name}</td>
                                    <td className="py-3 px-3 text-gray-600">{student.classLevel}</td>
                                    <td className="py-3 px-3 font-mono text-orange-600">{student.accessCode}</td>
                                    <td className="py-3 px-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${student.status === 'Active' ? 'bg-cyan-100 text-cyan-800' : 'bg-orange-100 text-orange-800'}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <button className="text-red-600 hover:text-red-500 text-xs">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </Card>
  );

  const renderManageTeachers = () => (
    <Card>
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                 <h3 className="text-xl font-semibold text-cyan-600">Teacher & Counselor Roster</h3>
                 <button onClick={() => alert("Invite teacher functionality coming soon!")} className="flex items-center justify-center px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors mt-4 sm:mt-0">
                    <AddUserIcon /> Invite New Staff
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    {/* Table content as before */}
                </table>
            </div>
        </div>
    </Card>
  );

  const renderAddStudentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
        <Card className="w-full max-w-md">
             <form onSubmit={handleAddStudent} className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Register a New Student</h3>
                 <div>
                    <label htmlFor="studentName" className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        id="studentName" 
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                        required 
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" 
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="classLevel" className="block text-sm font-medium text-gray-600 mb-1">Class Level</label>
                    <select 
                        id="classLevel" 
                        value={newStudent.classLevel}
                        onChange={(e) => setNewStudent({...newStudent, classLevel: e.target.value})}
                        required 
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    >
                        <option value="JSS3">JSS3</option>
                        <option value="SS1">SS1</option>
                        <option value="SS2">SS2</option>
                        <option value="SS3">SS3</option>
                    </select>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                     <button type="button" onClick={() => setIsAddStudentModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
                     <button type="submit" className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700">Register Student</button>
                </div>
             </form>
        </Card>
    </div>
  );

  const renderContent = () => {
    const isLocked = !isSubscribed;
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'manageStudents': return renderManageStudents();
      case 'manageTeachers': return renderManageTeachers();
      case 'analytics':
        if (isLocked) return <UpgradePrompt featureName="Analytics" onUpgrade={onUpgrade} />;
        return <p>Analytics coming soon.</p>;
      case 'reports':
        if (isLocked) return <UpgradePrompt featureName="Reports" onUpgrade={onUpgrade} />;
        return <p>Reports coming soon.</p>;
      default: return null;
    }
  };

  const NavButton: React.FC<{tab: Tab, label: string}> = ({ tab, label }) => (
     <button
        onClick={() => {
            if (!isSubscribed && (tab === 'analytics' || tab === 'reports')) { onUpgrade(); } 
            else { setActiveTab(tab); }
        }}
        className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors relative ${ activeTab === tab ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-200' }`}
    >
        {label}
        {!isSubscribed && (tab === 'analytics' || tab === 'reports') && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            </span>
        )}
    </button>
  );

  return (
    <React.Fragment>
     {isAddStudentModalOpen && renderAddStudentModal()}
     <div className="w-full max-w-7xl mx-auto">
       <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                School Administrator Dashboard
            </h1>
            <p className="text-lg text-gray-500 mt-1">Welcome, {user.name}! Manage your institution's access.</p>
       </div>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <aside className="md:w-1/4 flex-shrink-0 mb-8 md:mb-0">
          <nav className="space-y-2">
            <NavButton tab="overview" label="Overview" />
            <NavButton tab="manageStudents" label="Manage Students" />
            <NavButton tab="manageTeachers" label="Manage Teachers" />
            <NavButton tab="analytics" label="Analytics" />
            <NavButton tab="reports" label="Reports" />
          </nav>
          {!isSubscribed && <UpgradeCard onUpgrade={onUpgrade} />}
        </aside>
        <main className="flex-grow md:w-3/4">
          {renderContent()}
        </main>
      </div>
    </div>
    </React.Fragment>
  );
};

export default SchoolAdminDashboard;