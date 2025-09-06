import React from 'react';
import Card from './shared/Card';
import { User } from '../types';
import { registerUser } from '../services/apiService';

interface SignUpPageProps {
  onSignUpSuccess: (email: string, token: string) => void;
  onGoToLogin: () => void;
}

const StudentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>;
const ParentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm-3 5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const TeacherIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-6-6H6a6 6 0 00-6 6v2" /><path strokeLinecap="round" strokeLinejoin="round" d="M18.5 10.5l-1.5-1.5V6a2.5 2.5 0 015 0v3l-1.5 1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M22 10h-7" /></svg>;
const SchoolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9 12.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 12.75z" /></svg>;
const CBTIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>;

const userSegments = [
  { role: 'Student', description: 'For students (JSS3 – SS3) seeking career guidance.', icon: <StudentIcon /> },
  { role: 'Parent/Guardian', description: 'Monitor your child’s progress and get parental tips.', icon: <ParentIcon /> },
  { role: 'Counselor/Teacher', description: 'Access tools to guide your students effectively.', icon: <TeacherIcon /> },
  { role: 'School Administrator', description: 'Manage student assessments and view analytics.', icon: <SchoolIcon /> },
  { role: 'JAMB CBT Centre', description: 'Integrate career assessment into your prep sessions.', icon: <CBTIcon /> },
];

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUpSuccess, onGoToLogin }) => {
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
      name: '',
      email: '',
      password: '',
      // Role-specific fields
      classLevel: 'JSS3',
      schoolName: '',
      schoolAddress: '',
      centreName: '',
      centreAddress: '',
  });
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value }));
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setIsLoading(true);
    setError(null);
    try {
        const user: User = { 
            name: formData.name, 
            email: formData.email,
            password: formData.password,
            role: selectedRole,
            classLevel: formData.classLevel,
            schoolName: formData.schoolName,
            schoolAddress: formData.schoolAddress,
            centreName: formData.centreName,
            centreAddress: formData.centreAddress,
        };
        const { token } = await registerUser(user);
        if (!token) {
          throw new Error("Verification token was not provided by the server.");
        }
        onSignUpSuccess(user.email, token);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
            setError("Could not connect to the server. Please make sure the backend is running and there are no network issues.");
        } else {
            setError(err.message);
        }
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
        setIsLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case 'Student':
        return (
          <div>
            <label htmlFor="classLevel" className="block text-sm font-medium text-gray-600 mb-1">Current Class</label>
            <select id="classLevel" value={formData.classLevel} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                <option>JSS3</option>
                <option>SS1</option>
                <option>SS2</option>
                <option>SS3</option>
            </select>
          </div>
        );
      case 'Counselor/Teacher':
        return (
          <div>
            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-600 mb-1">School Name</label>
            <input type="text" id="schoolName" value={formData.schoolName} onChange={handleChange} required placeholder="e.g., King's College, Lagos" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
          </div>
        );
      case 'School Administrator':
        return (
          <>
            <div>
              <label htmlFor="schoolName" className="block text-sm font-medium text-gray-600 mb-1">School Name</label>
              <input type="text" id="schoolName" value={formData.schoolName} onChange={handleChange} required placeholder="e.g., Queen's College, Yaba" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="schoolAddress" className="block text-sm font-medium text-gray-600 mb-1">School Address</label>
              <input type="text" id="schoolAddress" value={formData.schoolAddress} onChange={handleChange} required className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
          </>
        );
      case 'JAMB CBT Centre':
        return (
          <>
            <div>
              <label htmlFor="centreName" className="block text-sm font-medium text-gray-600 mb-1">CBT Centre Name</label>
              <input type="text" id="centreName" value={formData.centreName} onChange={handleChange} required className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="centreAddress" className="block text-sm font-medium text-gray-600 mb-1">Centre Address</label>
              <input type="text" id="centreAddress" value={formData.centreAddress} onChange={handleChange} required className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
          </>
        );
      default:
        return null;
    }
  };


  if (!selectedRole) {
    return (
      <div className="w-full max-w-4xl text-center animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">
          Join CareerAid Clinic
        </h2>
        <p className="text-lg text-gray-600 mb-12">First, tell us who you are. Choose the account type that best describes you.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userSegments.map(({ role, description, icon }) => (
            <div key={role} onClick={() => setSelectedRole(role)} className="cursor-pointer">
              <Card className="h-full p-6 text-center transform hover:scale-105 hover:border-cyan-500 transition-all duration-300 flex flex-col items-center">
                {icon}
                <h3 className="mt-4 text-xl font-bold text-gray-800">{role}</h3>
                <p className="mt-2 text-sm text-gray-500">{description}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      <Card>
        <div className="p-8">
          <button onClick={() => setSelectedRole(null)} className="text-sm text-cyan-600 hover:text-cyan-500 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to roles
          </button>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Create Your {selectedRole} Account</h2>
          <p className="text-center text-gray-500 mb-6">Let's get you started on your journey.</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
              <input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
            {renderRoleSpecificFields()}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
              <input type="email" id="email" value={formData.email} onChange={handleChange} required className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input type="password" id="password" value={formData.password} onChange={handleChange} required minLength={6} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-300 disabled:bg-gray-400"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
            <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button type="button" onClick={onGoToLogin} className="font-semibold text-cyan-600 hover:text-cyan-500">
                    Log In
                </button>
            </p>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default SignUpPage;