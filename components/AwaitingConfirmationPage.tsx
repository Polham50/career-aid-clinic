import React from 'react';
import Card from './shared/Card';
import { confirmEmail } from '../services/apiService';
import Spinner from './shared/Spinner';

interface AwaitingConfirmationPageProps {
  email: string | null;
  token: string | null;
  onConfirmSuccess: () => void;
}

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AwaitingConfirmationPage: React.FC<AwaitingConfirmationPageProps> = ({ email, token, onConfirmSuccess }) => {
  const [status, setStatus] = React.useState<'awaiting' | 'verifying' | 'success' | 'error'>('awaiting');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // This effect triggers verification if a token is passed from the URL
  React.useEffect(() => {
    const verifyToken = async () => {
      // The condition for auto-verification is when the component is loaded
      // with a token but without an email (which is only set post-registration).
      if (token && !email) {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        setStatus('verifying');
        setErrorMessage(null);
        try {
          await confirmEmail(token);
          setStatus('success');
          // Redirect to login after a short delay
          setTimeout(() => {
            onConfirmSuccess();
          }, 3000);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Confirmation failed.';
          setErrorMessage(message);
          setStatus('error');
        }
      }
    };
    verifyToken();
  }, [token, email, onConfirmSuccess]);

  // Render content for post-signup flow
  if (email) {
    const confirmationUrl = `/#/confirm?token=${token}`;
    return (
      <div className="w-full max-w-lg text-center animate-fade-in-up">
        <Card>
          <div className="p-8">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Confirm Your Email</h2>
            <p className="text-gray-600">
              We've sent a confirmation link to <strong className="text-gray-700">{email}</strong>. Please check your inbox (and spam folder!) to complete your registration.
            </p>
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-bold text-yellow-800">For Development Only</h4>
                <p className="text-sm text-yellow-700 mt-1">
                    Because the production email service is not configured, you can use this link to confirm your account directly:
                </p>
                <a 
                    href={confirmationUrl}
                    className="mt-2 inline-block bg-yellow-200 text-yellow-900 font-mono text-xs px-2 py-1 rounded hover:bg-yellow-300 break-all"
                >
                    Confirm Account
                </a>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Render content for verification flow from URL
  return (
    <div className="w-full max-w-md text-center animate-fade-in">
      <Card>
        <div className="p-8 min-h-[250px] flex flex-col justify-center items-center">
          {status === 'verifying' && (
            <>
              <Spinner message="" />
              <h2 className="text-2xl font-bold text-gray-800 mt-4">Verifying your account...</h2>
            </>
          )}
          {status === 'success' && (
            <div className='animate-fade-in'>
              <SuccessIcon />
              <h2 className="text-2xl font-bold text-green-600 mt-4 mb-2">Verification Successful!</h2>
              <p className="text-gray-600">Your email has been confirmed. Redirecting you to the login page...</p>
            </div>
          )}
          {status === 'error' && (
             <div className='animate-fade-in'>
              <ErrorIcon />
              <h2 className="text-2xl font-bold text-red-600 mt-4 mb-2">Verification Failed</h2>
              <p className="text-gray-600">{errorMessage || 'The link may be invalid or expired.'}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AwaitingConfirmationPage;