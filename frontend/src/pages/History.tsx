import React from 'react';
import StockChart from '../components/StockChart';
import QuizHistory from '../components/QuizHistory';
import './pages.css';

export default function History() {
  const rawQuizzes = [
    { id: 0, score: 8, totalQuestions: 10, netMoney: 700 },
    { id: 1, score: 8, totalQuestions: 10, netMoney: 700 },
    { id: 2, score: 5, totalQuestions: 10, netMoney: -300 },
    { id: 3, score: 10, totalQuestions: 10, netMoney: 500 },
    { id: 4, score: 7, totalQuestions: 10, netMoney: -200 },
    { id: 5, score: 4, totalQuestions: 10, netMoney: -400 },
    { id: 6, score: 9, totalQuestions: 10, netMoney: 1000 },
    { id: 7, score: 10, totalQuestions: 10, netMoney: 800 },
    { id: 8, score: 9, totalQuestions: 10, netMoney: 500 },
    { id: 9, score: 8, totalQuestions: 10, netMoney: 400 },
    { id: 10, score: 1, totalQuestions: 10, netMoney: -1200 },
    { id: 11, score: 2, totalQuestions: 10, netMoney: -800 },
    { id: 12, score: 10, totalQuestions: 10, netMoney: 3000 },
  ];

  // Updated Quiz type to include previousMoney and currentMoney
  type Quiz = {
    id: number;
    score: number;
    totalQuestions: number;
    netMoney: number;
    previousMoney: number;
    currentMoney: number;
  };

  // Dynamically calculate previousMoney and currentMoney for each quiz using reduce
  const quizzes = rawQuizzes.reduce((acc, quiz, index) => {
    if (index === 0) {
      acc.push({ ...quiz, previousMoney: 0, currentMoney: 1000 });
    } else {
      const previousQuiz = acc[index - 1];
      const previousMoney = previousQuiz.currentMoney;
      const currentMoney = previousMoney + quiz.netMoney;

      acc.push({ ...quiz, previousMoney, currentMoney });
    }
    return acc;
  }, [] as Quiz[]);

  return (
    <div className="history">
      <h1>History Page</h1>
      <div className="history-container">
        <div className="stock-chart">
          <StockChart quizzes={quizzes} />
        </div>
        <hr className="separator" /> {/* Add a horizontal line */}
        <div className="quiz-history">
          <QuizHistory quizzes={quizzes} />
        </div>
      </div>
    </div>
  );
}