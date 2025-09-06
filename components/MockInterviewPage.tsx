
import React from 'react';
import { InterviewQuestion } from '../types';
import { getMockInterviewQuestions, getInterviewFeedback } from '../services/apiService';
import Card from './shared/Card';
import Spinner from './shared/Spinner';

interface MockInterviewPageProps {
  careerName: string;
  onEndInterview: () => void;
}

const MockInterviewPage: React.FC<MockInterviewPageProps> = ({ careerName, onEndInterview }) => {
  const [questions, setQuestions] = React.useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [userAnswer, setUserAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isGettingFeedback, setIsGettingFeedback] = React.useState(false);

  React.useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const fetchedQuestions = await getMockInterviewQuestions(careerName);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Failed to fetch interview questions:", error);
        setFeedback("Sorry, I couldn't load the interview questions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [careerName]);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsGettingFeedback(true);
    setFeedback(null);
    try {
        const currentQuestion = questions[currentQuestionIndex].question;
        const fetchedFeedback = await getInterviewFeedback(currentQuestion, userAnswer);
        setFeedback(fetchedFeedback);
    } catch (error) {
        console.error("Failed to get feedback:", error);
        setFeedback("There was an error getting feedback for your answer.");
    } finally {
        setIsGettingFeedback(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setUserAnswer('');
        setFeedback(null);
    } else {
        // End of interview
        alert("You've completed the mock interview!");
        onEndInterview();
    }
  };

  if (isLoading) {
    return <Spinner message={`Preparing interview questions for a ${careerName}...`} />;
  }
  
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full max-w-4xl animate-fade-in-up">
        <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                Mock Interview: {careerName}
            </h1>
            <p className="mt-2 text-lg text-gray-600">Practice makes perfect. Let's begin.</p>
        </div>
        <Card>
            <div className="p-6 md:p-8">
                 <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                         <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${currentQuestion.type === 'Behavioral' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {currentQuestion.type}
                        </span>
                        <span className="text-sm font-medium text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-800">{currentQuestion.question}</p>
                </div>
                
                <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Structure your answer here..."
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none min-h-[150px]"
                    disabled={isGettingFeedback || !!feedback}
                />

                {isGettingFeedback && <Spinner message="Analyzing your answer..." />}

                {feedback && (
                    <div className="mt-6 bg-cyan-50/50 p-4 rounded-lg border border-cyan-200 animate-fade-in">
                        <h4 className="font-bold text-lg text-cyan-700 mb-2">AI Feedback</h4>
                        <div className="text-gray-700 space-y-2" dangerouslySetInnerHTML={{ __html: feedback }} />
                    </div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <button onClick={onEndInterview} className="text-gray-500 hover:text-gray-800 transition-colors">End Interview</button>
                    <div>
                        {!feedback ? (
                             <button
                                onClick={handleSubmitAnswer}
                                disabled={isGettingFeedback || !userAnswer.trim()}
                                className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Submit for Feedback
                            </button>
                        ) : (
                             <button
                                onClick={handleNextQuestion}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none"
                            >
                                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    </div>
  );
};

export default MockInterviewPage;
