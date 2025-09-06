import React from 'react';
import { CareerProfile, Career } from '../types';
import Card from './shared/Card';
import { HOLLAND_CODE_ICONS } from '../constants';

interface ResultsPageProps {
  profile: CareerProfile;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ profile }) => {
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );
  };

  return (
    <div className="w-full animate-fade-in-up space-y-12">
      <div>
        <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Your Career Profile</h2>
            <p className="text-sm text-gray-500 mt-1">
              Assessment taken on: {new Date(profile.assessmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
        </div>
        <Card>
          <div className="p-6">
             <h3 className="text-xl font-semibold text-cyan-600 mb-3">Your Personality Type Summary</h3>
            <p className="text-gray-600">{renderFormattedText(profile.summary)}</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {(profile.topHollandCodes || []).map((code) => (
                <div key={code.code} className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center justify-center text-cyan-500 mb-2">
                    {HOLLAND_CODE_ICONS[code.code]}
                    <span className="ml-3 text-2xl font-bold">{code.code}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">{code.name}</h4>
                   <p className="text-sm text-gray-500 mt-1">{code.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-center text-cyan-600 mb-6">Recommended Career Paths</h3>
        <div className="space-y-4">
          {profile.recommendedCareers && profile.recommendedCareers.length > 0 ? (
            profile.recommendedCareers.map((career: Career, index: number) => (
              <Card key={index}>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-cyan-600">{career.careerName}</h4>
                  <p className="text-sm text-orange-600 font-medium mt-1 mb-2">Salary Est: {career.salaryRange}</p>
                  <p className="text-gray-600 mb-4">{renderFormattedText(career.description)}</p>
                  
                  <div className="space-y-6">
                      <div>
                        <h5 className="font-semibold mb-2 text-gray-800">Top Skills Needed:</h5>
                        <div className="flex flex-wrap gap-2">
                          {(career.requiredSkills || []).map((skill, i) => (
                            <span key={i} className="bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                          ))}
                        </div>
                      </div>

                       <div>
                        <h5 className="font-semibold mb-2 text-gray-800">Academic Recommendations:</h5>
                        {career.courseRecommendations && career.courseRecommendations.length > 0 ? (
                            <div className="space-y-4">
                                {career.courseRecommendations.map((course, i) => (
                                    <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <h6 className="font-semibold text-gray-800">{course.courseName}</h6>
                                        <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                                            <li><strong>O'Level:</strong> {course.olevelRequirements}</li>
                                            <li><strong>JAMB Score:</strong> {course.jambScoreRange}</li>
                                            {course.utmeScoreRange && <li><strong>Post-UTME:</strong> {course.utmeScoreRange}</li>}
                                        </ul>
                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-gray-800 mb-1.5">Institutions:</p>
                                            <div className="flex flex-wrap gap-2">
                                              {(course.institutions || []).map((inst, j) => (
                                                <span key={j} className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{inst}</span>
                                              ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No specific academic recommendations were generated.</p>
                        )}
                      </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="p-6 text-center text-gray-500">
                <p>No career recommendations were generated for this profile.</p>
                <p>This can sometimes happen due to an issue with the AI model. Please try taking the assessment again.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;