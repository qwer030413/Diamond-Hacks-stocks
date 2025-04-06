import React, { useState, useEffect } from 'react';
import StockChart from '../components/StockChart';
import QuizHistory from '../components/QuizHistory';
import './pages.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function History() {
  const navigate = useNavigate();
  const [rawQuizzes, setRawQuizzes] = useState<Quiz[]>([]); // State to hold fetched quizzes
  const initialBalance = 10000; // Ensure the initial balance is set to 10000

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/quiz"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the JSON response
        console.log("Fetched data:", data); // Log the fetched data
        setRawQuizzes(data); // Update state with the fetched quizzes
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Updated Quiz type to include previousMoney and currentMoney
  type Quiz = {
    id: number;
    name: string; // Name of the quiz
    correct: number; // Number of correct answers
    balancechange: number; // Net money gained/lost
    previousMoney: number; // Money from the previous quiz
    currentMoney: number; // Dynamically calculated current money
  };

  // Dynamically calculate previousMoney and currentMoney for each quiz using reduce
  const quizzes = rawQuizzes.reduce((acc, quiz, index) => {
    const balancechange = Number(quiz.balancechange) || 0; // Ensure balancechange is a valid number

    if (index === 0) {
      // Ensure the first quiz (id: 0) always has currentMoney set to 10000
      acc.push({ ...quiz, previousMoney: 0, currentMoney: initialBalance });
    } else {
      const previousQuiz = acc[index - 1];
      const previousMoney = previousQuiz.currentMoney;
      const currentMoney = previousMoney + balancechange;

      acc.push({ ...quiz, previousMoney, currentMoney });
    }
    return acc;
  }, [] as Quiz[]);

  if (quizzes.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="history">
      <h1>History</h1>
      <button onClick={() =>navigate('/')}>Home</button>
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
