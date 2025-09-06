import React from 'react';
import { User, CareerProfile } from '../types';
import StudentDashboard from './dashboards/StudentDashboard';
import ParentDashboard from './dashboards/ParentDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import SchoolAdminDashboard from './dashboards/SchoolAdminDashboard';
import CbtCentreDashboard from './dashboards/CbtCentreDashboard';

interface DashboardPageProps {
  user: User;
  careerProfiles: CareerProfile[];
  onSubmitAssessment: (answers: string[]) => Promise<void>;
  error: string | null;
  onUpgrade: () => void;
  onStartInterview: (careerName: string) => void;
  isSubscribed: boolean;
  redirectToRecommendations: boolean;
  onRedirectConsumed: () => void;
  onErrorAcknowledged: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, careerProfiles, onSubmitAssessment, error, onUpgrade, onStartInterview, isSubscribed, redirectToRecommendations, onRedirectConsumed, onErrorAcknowledged }) => {
  
  const renderDashboardByRole = () => {
    const commonProps = { user, profiles: careerProfiles, onSubmitAssessment, error, onUpgrade, onStartInterview, isSubscribed, onErrorAcknowledged };
    switch (user.role) {
      case 'Student':
        return <StudentDashboard 
                  {...commonProps} 
                  redirectToRecommendations={redirectToRecommendations}
                  onRedirectConsumed={onRedirectConsumed}
                />;
      case 'Parent/Guardian':
        return <ParentDashboard {...commonProps} />;
      case 'Counselor/Teacher':
        return <TeacherDashboard {...commonProps} />;
      case 'School Administrator':
        return <SchoolAdminDashboard {...commonProps} />;
      case 'JAMB CBT Centre':
        return <CbtCentreDashboard {...commonProps} />;
      default:
        return <div className="text-center text-red-500">Error: Unknown user role.</div>;
    }
  };

  return (
    <div className="w-full animate-fade-in-up">
      {renderDashboardByRole()}
    </div>
  );
};

export default DashboardPage;