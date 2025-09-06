
import React from 'react';
import { ASSESSMENT_QUESTIONS } from '../constants';
import Card from './shared/Card';

interface AssessmentPageProps {
  onSubmit: (answers: string[]) => void;
  error: string | null;
}

const AssessmentPage: React.FC<AssessmentPageProps> = ({ onSubmit, error }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<string[]>([]);

  const handleAnswer = (answer: 'Agree' | 'Disagree') => {
    const questionText = ASSESSMENT_QUESTIONS[currentQuestionIndex];
    const formattedAnswer = `${questionText}: ${answer}`;
    const newAnswers = [...answers, formattedAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onSubmit(newAnswers);
    }
  };

  const progressPercentage = Math.round(((currentQuestionIndex) / ASSESSMENT_QUESTIONS.length) * 100);

  return (
    <div className="w-full max-w-2xl animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-2 text-cyan-600">Career Personality Test</h2>
        <p className="text-center text-gray-600 mb-6">For each statement, choose if you agree or disagree. Go with your first instinct!</p>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s' }}></div>
        </div>
        
        <Card>
            <div className="p-8">
                <p className="text-xl md:text-2xl text-center font-medium text-gray-800 mb-8 h-24 flex items-center justify-center">
                    {ASSESSMENT_QUESTIONS[currentQuestionIndex]}
                </p>
                <div className="flex justify-around">
                    <button
                        onClick={() => handleAnswer('Agree')}
                        className="w-40 px-6 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transform hover:scale-105 transition-all duration-300"
                    >
                        Agree
                    </button>
                    <button
                        onClick={() => handleAnswer('Disagree')}
                        className="w-40 px-6 py-3 bg-gray-500 text-white font-bold rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transform hover:scale-105 transition-all duration-300"
                    >
                        Disagree
                    </button>
                </div>
            </div>
        </Card>
        <p className="text-center mt-4 text-sm text-gray-500">Question {currentQuestionIndex + 1} of {ASSESSMENT_QUESTIONS.length}</p>
    </div>
  );
};

export default AssessmentPage;