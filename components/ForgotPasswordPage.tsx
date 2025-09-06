import React from 'react';
import Card from './shared/Card';
import { forgotPassword } from '../services/apiService';

interface ForgotPasswordPageProps {
  onGoToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onGoToLogin }) => {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { message } = await forgotPassword(email);
      setMessage(message);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <Card>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Reset Your Password</h2>
          <p className="text-center text-gray-500 mb-6">Enter your email and we'll send you a link to reset your password.</p>
          
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <span className="block sm:inline">{message}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none" 
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !!message}
              className="w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <p className="text-center text-sm text-gray-500">
                Remember your password?{' '}
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

export default ForgotPasswordPage;
