import React from 'react';
import Card from './shared/Card';
import { resetPassword } from '../services/apiService';

interface ResetPasswordPageProps {
  token: string;
  onResetSuccess: () => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ token, onResetSuccess }) => {
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // Clean the token from the URL as soon as the component loads
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await resetPassword(token, password);
      onResetSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <Card>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Set a New Password</h2>
          <p className="text-center text-gray-500 mb-6">Please enter your new password below.</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={6}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" 
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" 
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;