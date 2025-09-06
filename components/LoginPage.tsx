import React from 'react';
import Card from './shared/Card';
import { User } from '../types';
import { loginUser, loginWithAccessCode } from '../services/apiService';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onGoToSignUp: () => void;
  onGoToForgotPassword: () => void;
  notification?: string | null;
}

type LoginTab = 'staff' | 'student';

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onGoToSignUp, onGoToForgotPassword, notification }) => {
  const [activeTab, setActiveTab] = React.useState<LoginTab>('staff');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [studentName, setStudentName] = React.useState('');
  const [accessCode, setAccessCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleStaffLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const { user } = await loginUser(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { user } = await loginWithAccessCode(studentName, accessCode);
      onLoginSuccess(user);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  const renderStaffLogin = () => (
    <form onSubmit={handleStaffLogin} className="space-y-4 animate-fade-in">
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
        </div>
        <div>
            <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                <button type="button" onClick={onGoToForgotPassword} className="text-sm font-semibold text-cyan-600 hover:text-cyan-500">Forgot Password?</button>
            </div>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
        </div>
        <button type="submit" disabled={isLoading} className="w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 disabled:bg-gray-400">
            {isLoading ? 'Logging In...' : 'Log In'}
        </button>
    </form>
  );

  const renderStudentLogin = () => (
    <form onSubmit={handleStudentLogin} className="space-y-4 animate-fade-in">
        <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input type="text" id="studentName" value={studentName} onChange={(e) => setStudentName(e.target.value)} required placeholder="As registered by your school" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
        </div>
        <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-600 mb-1">Access Code</label>
            <input type="text" id="accessCode" value={accessCode} onChange={(e) => setAccessCode(e.target.value.toUpperCase())} required placeholder="e.g., C8XF2A" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
        </div>
        <button type="submit" disabled={isLoading} className="w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 disabled:bg-gray-400">
            {isLoading ? 'Logging In...' : 'Log In'}
        </button>
    </form>
  );

  return (
    <div className="w-full max-w-md animate-fade-in">
      <Card>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-center text-gray-500 mb-6">Log in to continue your career journey.</p>
          
          {notification && (
             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <span className="block sm:inline">{notification}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mb-4 border-b border-gray-200">
              <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                  <button onClick={() => setActiveTab('staff')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'staff' ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                      Staff / Parent
                  </button>
                  <button onClick={() => setActiveTab('student')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'student' ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                      Student (with Access Code)
                  </button>
              </nav>
          </div>
          
          {activeTab === 'staff' ? renderStaffLogin() : renderStudentLogin()}
          
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button type="button" onClick={onGoToSignUp} className="font-semibold text-cyan-600 hover:text-cyan-500">
                Sign Up
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;