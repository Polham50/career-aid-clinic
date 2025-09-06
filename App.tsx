import React from 'react';
import { AppPhase, CareerProfile, User } from './types';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import { getCareerProfile, getProfilesForUser, getMe } from './services/apiService';
import Spinner from './components/shared/Spinner';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import SubscriptionPage from './components/SubscriptionPage';
import MockInterviewPage from './components/MockInterviewPage';
import AwaitingConfirmationPage from './components/AwaitingConfirmationPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';

const App: React.FC = () => {
  const [phase, setPhase] = React.useState<AppPhase>(AppPhase.INIT);
  const [user, setUser] = React.useState<User | null>(null);
  const [careerProfiles, setCareerProfiles] = React.useState<CareerProfile[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCareer, setSelectedCareer] = React.useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false);
  const [notification, setNotification] = React.useState<string | null>(null);
  const [actionToken, setActionToken] = React.useState<string | null>(null);
  const [userEmailForConfirmation, setUserEmailForConfirmation] = React.useState<string | null>(null);
  const [redirectToRecommendations, setRedirectToRecommendations] = React.useState<boolean>(false);
  const [assessmentAnswers, setAssessmentAnswers] = React.useState<string[] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = React.useState<string>('');

  React.useEffect(() => {
    const initializeApp = async () => {
      // Hash-based routing for SPA actions like email confirmation
      const hash = window.location.hash.substring(1); // from '#/confirm?token=xyz' to '/confirm?token=xyz'
      if (hash) {
        const [path, queryString] = hash.split('?');
        const params = new URLSearchParams(queryString);
        const token = params.get('token');
        
        if (path.startsWith('/confirm') && token) {
          setActionToken(token);
          setPhase(AppPhase.AWAITING_CONFIRMATION);
          return;
        }
        
        if (path.startsWith('/reset') && token) {
          setActionToken(token);
          setPhase(AppPhase.RESET_PASSWORD);
          return;
        }
      }
      
      // If no URL action, proceed with reauthentication
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        try {
          const loggedInUser = await getMe();
          await handleLoginSuccess(loggedInUser);
        } catch (error) {
          console.error("Reauthentication failed:", error);
          localStorage.removeItem('authToken');
          setPhase(AppPhase.HOME);
        }
      } else {
        setPhase(AppPhase.HOME);
      }
    };

    initializeApp();
  }, []);

  const resetToHome = () => {
    setPhase(AppPhase.HOME);
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
  }

  const goToSignUp = () => {
    setPhase(AppPhase.SIGNUP);
    setNotification(null);
  };

  const goToLogin = () => {
    setPhase(AppPhase.LOGIN);
  };

  const goToSubscription = () => {
    setPhase(AppPhase.SUBSCRIPTION);
  };

  const goToForgotPassword = () => {
    setPhase(AppPhase.FORGOT_PASSWORD);
  };

  const clearError = () => setError(null);

  const handleSubscriptionSuccess = async () => {
    alert('Subscription successful! Your plan has been upgraded.');
    // Refetch user data to get the new subscription status
    if (user?._id) {
        setIsLoading(true);
        setLoadingMessage('Activating your premium features...');
        try {
            const updatedUser = await getMe();
            setUser(updatedUser);
            setIsSubscribed(updatedUser.isSubscribed || false);

            if (assessmentAnswers) {
              setLoadingMessage('Finalizing your subscription and generating your profile...');
              const newProfile = await getCareerProfile(assessmentAnswers);
              setCareerProfiles(prev => [newProfile, ...prev]);
              setAssessmentAnswers(null); // Clear temp answers
              setRedirectToRecommendations(true);
            }
        } catch (e) {
            console.error(e);
            setError("Failed to update your account after subscription. Please re-login.");
        } finally {
            setIsLoading(false);
            setPhase(AppPhase.DASHBOARD);
        }
    } else {
      setPhase(AppPhase.DASHBOARD);
    }
  };

  const handleStartInterview = (careerName: string) => {
      setSelectedCareer(careerName);
      setPhase(AppPhase.MOCK_INTERVIEW);
  };

  const handleEndInterview = () => {
      setPhase(AppPhase.DASHBOARD);
      setSelectedCareer(null);
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    resetToHome();
  }

  const handleSignUpSuccess = (email: string, token: string) => {
    setUserEmailForConfirmation(email);
    setActionToken(token);
    setPhase(AppPhase.AWAITING_CONFIRMATION);
  };

  const handleConfirmationSuccess = () => {
    setNotification("Email confirmed successfully! Please log in.");
    setUserEmailForConfirmation(null);
    setActionToken(null);
    setPhase(AppPhase.LOGIN);
  }
  
  const handleResetPasswordSuccess = () => {
    setNotification("Your password has been reset successfully. Please log in.");
    setActionToken(null);
    setPhase(AppPhase.LOGIN);
  }

  const handleLoginSuccess = async (loggedInUser: User) => {
    setUser(loggedInUser);
    setNotification(null);
    setIsLoading(true);
    setLoadingMessage('Loading your dashboard...');
    try {
      if (loggedInUser._id) {
        const profiles = await getProfilesForUser(loggedInUser._id);
        setCareerProfiles(profiles);
      }
      setIsSubscribed(!!loggedInUser.isSubscribed || !!loggedInUser.isSchoolSponsored);
    } catch (err) {
      console.error("Failed to fetch user profiles:", err);
      setError("Could not load your saved profiles. Please try again later.");
    } finally {
      setIsLoading(false);
      setPhase(AppPhase.DASHBOARD);
    }
  };

  const submitAssessment = React.useCallback(async (answers: string[], childId?: string) => {
    if (!user?._id && !childId) {
      setError("You must be logged in to submit an assessment.");
      setPhase(AppPhase.LOGIN);
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Analyzing your personality and matching careers... This may take a moment.');
    setError(null);

    // School-sponsored students or subscribed users can take the assessment directly
    if (isSubscribed) {
      try {
        const newProfile = await getCareerProfile(answers, childId);
        // Only refresh the main user's profiles if they took it for themselves
        if (!childId && user?._id) {
          const profiles = await getProfilesForUser(user._id);
          setCareerProfiles(profiles);
        }
      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(errorMessage);
        throw e; // Re-throw to be caught in the component
      } finally {
        setIsLoading(false);
        if (!childId) {
            setPhase(AppPhase.DASHBOARD);
        }
      }
    } else { // Freemium users must upgrade
      setIsLoading(false);
      setAssessmentAnswers(answers);
      setRedirectToRecommendations(true);
      setPhase(AppPhase.SUBSCRIPTION);
    }
  }, [user, isSubscribed]);

  const renderContent = () => {
    switch (phase) {
      case AppPhase.HOME:
        return <HomePage onStart={goToSignUp} />;
      case AppPhase.SIGNUP:
        return <SignUpPage onSignUpSuccess={handleSignUpSuccess} onGoToLogin={goToLogin} />;
      case AppPhase.LOGIN:
        return <LoginPage onLoginSuccess={handleLoginSuccess} onGoToSignUp={goToSignUp} onGoToForgotPassword={goToForgotPassword} notification={notification} />;
      case AppPhase.AWAITING_CONFIRMATION:
          if (!userEmailForConfirmation && !actionToken) {
              resetToHome();
              return null;
          }
          return <AwaitingConfirmationPage email={userEmailForConfirmation} token={actionToken} onConfirmSuccess={handleConfirmationSuccess} />;
      case AppPhase.FORGOT_PASSWORD:
          return <ForgotPasswordPage onGoToLogin={goToLogin} />;
      case AppPhase.RESET_PASSWORD:
          if (!actionToken) {
              goToLogin();
              return null;
          }
          return <ResetPasswordPage token={actionToken} onResetSuccess={handleResetPasswordSuccess} />;
      case AppPhase.DASHBOARD:
        if (!user) {
            resetToHome();
            return <HomePage onStart={goToSignUp} />;
        }
        return <DashboardPage 
                    user={user} 
                    careerProfiles={careerProfiles} 
                    onSubmitAssessment={submitAssessment} 
                    error={error} 
                    onUpgrade={goToSubscription} 
                    onStartInterview={handleStartInterview} 
                    isSubscribed={isSubscribed}
                    redirectToRecommendations={redirectToRecommendations}
                    onRedirectConsumed={() => setRedirectToRecommendations(false)}
                    onErrorAcknowledged={clearError}
                />;
      case AppPhase.SUBSCRIPTION:
        return <SubscriptionPage user={user} onBack={() => setPhase(AppPhase.DASHBOARD)} onSubscriptionSuccess={handleSubscriptionSuccess} />;
       case AppPhase.MOCK_INTERVIEW:
        if (!selectedCareer) {
            setPhase(AppPhase.DASHBOARD);
            return null;
        }
        return <MockInterviewPage careerName={selectedCareer} onEndInterview={handleEndInterview} />;
      default:
        return <HomePage onStart={goToSignUp} />;
    }
  };

  const mainContainerClasses = `flex-grow container mx-auto px-4 py-8 flex flex-col items-center ${
    (phase !== AppPhase.DASHBOARD && phase !== AppPhase.MOCK_INTERVIEW) ? 'justify-center' : ''
  }`;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
       {(isLoading || phase === AppPhase.INIT) && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
            <Spinner message={isLoading ? loadingMessage : "Initializing..."} />
          </div>
        )}
      <Header 
        user={user}
        onLogoClick={resetToHome} 
        onSignUp={goToSignUp} 
        onLogin={goToLogin} 
        onLogout={handleLogout}
      />
      <main className={mainContainerClasses}>
        {phase !== AppPhase.INIT && renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;