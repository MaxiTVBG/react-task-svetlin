import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StartPage.css';

function StartPage() {
  useEffect(() => {
    localStorage.removeItem('quizAnswers');
  }, []);

  return (
    <div className="start-page-background h-[526px] top-0 w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-black/40 bg-blend-multiply">
      <div className="w-full max-w-[583px] bg-transparent px-8 flex flex-col items-center text-center">
        <h1 className="text-5xl max-h-[88px] mb-4 text-white size-40px font-bricolade">
          Build a self care routine suitable for you
        </h1>
        <p className="text-[16px] mb-6 text-white font-montserrat">
          Take out test to get a personalised self care routine based on your needs.
        </p>
        <Link to="/question/1">
          <button className="px-10 py-2.5 bg-[#C3EDFF] hover:bg-[#c3edffd6] rounded-lg text-[#1C2635] font-montserrat text-size-16px">
            Start the quiz
          </button>
        </Link>
      </div>
    </div>
  );
}

export default StartPage;