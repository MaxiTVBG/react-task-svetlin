import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questions from './questions';
import ProgressBar from './ProgressBar';

function QuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const questionId = parseInt(id, 10);
  const currentQuestion = questions.find((q) => q.id === questionId);

  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState(() => {
    try {
      const savedAnswers = localStorage.getItem('quizAnswers');
      return savedAnswers ? JSON.parse(savedAnswers) : {};
    } catch (error) {
      console.error('Error parsing answers from localStorage', error);
      return {};
    }
  });

  useEffect(() => {
    // When the question changes, check if there's a saved answer and set it
    setSelectedOption(answers[questionId] || null);
  }, [id, answers, questionId]);

  const handleOptionSelect = (optionValue) => {
    setSelectedOption(optionValue);
  };

  const handleNext = () => {
    // Save the current answer
    const newAnswers = { ...answers, [questionId]: selectedOption };
    setAnswers(newAnswers);
    localStorage.setItem('quizAnswers', JSON.stringify(newAnswers));

    // Navigate to the next question or results
    const nextQuestionId = questionId + 1;
    if (nextQuestionId <= questions.length) {
      navigate(`/question/${nextQuestionId}`);
    } else {
      navigate('/results');
    }
  };

  const handleBack = () => {
    if (questionId > 1) {
      navigate(`/question/${questionId - 1}`);
    } else {
      navigate('/');
    }
  };

  if (!currentQuestion) {
    // Optional: redirect to a 404 page or the first question
    return <div>Question not found!</div>;
  }

  const isLastQuestion = questionId === questions.length;

  return (
    <div className="min-h-screen bg-white font-sans relative p-4">
      {/* Responsive container for Progress Bar */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-full flex justify-center 
        lg:top-[352px] lg:left-auto lg:right-24 lg:w-auto lg:translate-x-0">
        <ProgressBar current={questionId} total={questions.length} />
      </div>

      {/* Container for Question, Answers, and Navigation */}
      <div className="absolute  top-40 lg:top-[352px] left-1/2 -translate-x-1/2 w-full">
        <main className="w-full max-w-4xl flex flex-col items-center text-center mx-auto pl-4 pr-4">
          {/* Question */}
          <h2 className="text-4xl font-bricolage text-gray-700 mb-4">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="flex flex-wrap justify-center gap-2.5 p-4 my-10">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`flex text-left justify-start min-w-[189px] border border-sky-300 rounded-lg text-lg text-gray-700 hover:bg-sky-50 transition duration-200 p-2 ${
                  selectedOption === option.value ? 'bg-sky-200' : ''
                }`}
              >
                {String.fromCharCode(97 + index)}. {option.text}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={handleBack}
              className="text-lg text-[#677487] hover:text-gray-800 transition duration-200 border-b-2 border-[#677487] hover:border-gray-800"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="w-[238px] h-[47px] bg-sky-200 text-gray-700 rounded-lg text-lg hover:bg-sky-300 transition duration-200 flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLastQuestion ? 'Discover your results' : <>Next question <span className="ml-2">&rarr;</span></>}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default QuestionPage;
