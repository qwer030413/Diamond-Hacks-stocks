import React from 'react';

interface Quiz {
  id: number;
  name: string; // Name of the quiz
  correct: number; // Number of correct answers
  balancechange: number; // Net money gained/lost
  previousMoney: number; // Money from the previous quiz
  currentMoney: number; // Dynamically calculated current money
}

export default function QuizHistory({ quizzes }: { quizzes: Quiz[] }) {
  console.log(quizzes);

  return (
    <div className="quiz-history-container">
      <div className="quiz-header">
        <h2>Past Quizzes</h2>
        <p>Starting Money: ${quizzes[0].currentMoney.toFixed(2)}</p>
      </div>
      <div className="quiz-list-container">
        <ul className="quiz-list">
          {quizzes
            .slice() // Create a shallow copy of the array to avoid mutating the original
            .reverse() // Reverse the array to show the most recent quizzes first
            .map((quiz, index) => {
              // Skip the first quiz if it's the starting point
              if (index === quizzes.length - 1) return null;

              const percentageChange =
                quiz.previousMoney > 0
                  ? ((quiz.balancechange / quiz.previousMoney) * 100).toFixed(2)
                  : "0.00";
              const isPositive = quiz.balancechange >= 0;

              return (
                <li key={quiz.id} className="quiz-item">
                  <div className="quiz-row">
                    <span>Quiz {quiz.id} ({quiz.name}):</span>
                    <span>Correct Answers: {quiz.correct}/3</span>
                    <span
                      style={{
                        color: isPositive ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {isPositive ? "+" : ""}
                      {percentageChange}% ({isPositive ? "+" : ""}$
                      {Math.abs(quiz.balancechange).toFixed(2)})
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