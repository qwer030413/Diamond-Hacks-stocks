import React from 'react';

interface Quiz {
  id: number;
  score: number;
  totalQuestions: number;
  netMoney: number; // Net money gained/lost
  previousMoney: number; // Money from the previous quiz
  currentMoney: number; // Dynamically calculated current money
}

export default function QuizHistory({ quizzes }: { quizzes: Quiz[] }) {
  return (
    <div className="quiz-history-container">
      <div className="quiz-header">
        <h2>Past Quizzes</h2>
        <p>Starting Money: ${quizzes[0].currentMoney}</p>
      </div>
      <div className="quiz-list-container">
        <ul className="quiz-list">
          {quizzes.slice(1).map((quiz) => {
            const percentageChange = ((quiz.netMoney / quiz.previousMoney) * 100).toFixed(2);
            const isPositive = quiz.netMoney >= 0;

            return (
              <li key={quiz.id} className="quiz-item">
                <div className="quiz-row">
                  <span>Quiz {quiz.id}:</span>
                  <span>Score: {quiz.score}/{quiz.totalQuestions}</span>
                  <span
                    style={{
                      color: isPositive ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {isPositive ? '+' : ''}
                    {percentageChange}% ({isPositive ? '+' : ''}${Math.abs(quiz.netMoney)})
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}