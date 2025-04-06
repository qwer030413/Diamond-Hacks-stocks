import './maincontainer.css';
import QuizBox from '../quizbox/quizbox';
import { useNavigate } from 'react-router-dom';
import appleImage from '../../assets/images/apple.jpg';
import teslaImage from '../../assets/images/tesla.jpg';
import googleImage from '../../assets/images/google.jpg';
import nvidiaImage from '../../assets/images/nvidia.jpg';
import microsoftImage from '../../assets/images/microsoft.jpg';
import { useEffect, useState } from 'react';

export default function MainContainer(props: any) {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<any[]>([]); // State to store quiz data

  // Fetch quiz data from the backend
  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const response = await fetch('http://localhost:3000/quizzes'); // Replace with your backend endpoint
        const data = await response.json();
        setQuizzes(data); // Store the quiz data in state
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    }
    fetchQuizzes();
  }, []);

  // Map quiz data to include images
  const quizDataWithImages = [
    { name: "Apple", image: appleImage },
    { name: "Tesla", image: teslaImage },
    { name: "Google", image: googleImage },
    { name: "Nvidia", image: nvidiaImage },
    { name: "Microsoft", image: microsoftImage },
  ].map((quiz) => {
    const backendQuiz = quizzes.find((q) => q.name === quiz.name) || { correct: 0 };
    return {
      ...quiz,
      correct: backendQuiz.correct,
      status: backendQuiz.correct > 0 ? "completed" : "not done",
      score: backendQuiz.correct > 0 ? `${backendQuiz.correct}/3` : "N/A",
    };
  });

  return (
    <div className="main-container">
      <div className="header">
        <h1 style={{ color: 'white' }}>Diamond Stocks</h1>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>
            ${props.money}
          </text>
          <button onClick={() => navigate('/History')}>History</button>
        </div>
      </div>
      <div className="quiz-box-container">
        {quizDataWithImages.map((quiz, index) => (
          <QuizBox
            key={index}
            title={quiz.name}
            status={quiz.status}
            score={quiz.score}
            image={quiz.image}
          />
        ))}
      </div>
    </div>
  );
}