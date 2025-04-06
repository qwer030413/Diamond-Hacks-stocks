import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuizForm from '../components/quizForm/quizForm';
import { GoogleGenAI } from "@google/genai";


export default function Quiz() {
    const { id } = useParams();
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0); // Track current quiz index
    const [answers, setAnswers] = useState(""); // Store user answers
    const [question, setQuestion] = useState(""); // Store the current question text
    const [correctAnswer, setCorrectAnswer] = useState(""); // Store the correct answer for the current question
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [quizData, setQuizData] = useState<{ question: string; choice1: string; choice2: string; answer: string; }[]>([]); // Store quiz data from AI
    const ai = new GoogleGenAI({ apiKey: "AIzaSyBaH4rns3_6ue8vfEd_lrZpy-hOK4QH-C0" });
    const [newBalance, setNewBalance] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/balance"); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json(); // Parse the JSON response
                setNewBalance(data);
                console.log("Fetched data:", data); // Log the fetched data
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
        async function fetchQuestions() {
            setLoading(true); // Set loading to true before fetching
            await gemini_questions("Apple", 10);
            setLoading(false); // Set loading to false after fetching
        }
        fetchQuestions();
    }, []);
    useEffect(() => {
        if (quizData.length > 0 && currentQuizIndex < quizData.length) {
            const currentQuiz = quizData[currentQuizIndex];
            setQuestion(currentQuiz.question); // Update the question state
            setCorrectAnswer(currentQuiz.answer); // Update the correct answer state
        }
    }, [quizData, currentQuizIndex]); 
    const submitQuiz = async (answer:any) => {
        const explanation = await fetchExplanation(correctAnswer, answer.answer, answer.reasoning, question);
        setAnswers(explanation)
      };
    function goNext(){
        if (currentQuizIndex < quizData.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
            setCorrectAnswer("")
        } else {
            alert("You have completed all quizzes!");
            navigate(`/`)
        }
    }

    async function gemini_questions(stockName: string, questionAmount: number) {
        // Dynamically update the prompt with the stock name
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Provide ${questionAmount} fact-checkable multiple-choice questions about ${stockName} stock performance relative to past stock prices. Each question should include a month and year, and be based on real historical events.
      Each question must follow this format exactly, without any markdown, bullets, or formatting:
      Question: [Situational event with ${stockName} and time reference]
      Choice 1: [Describe a potential stock price change, with percentage (e.g., Increase of 10%)]
      Choice 2: [Describe another potential stock price change, with percentage (e.g., Decrease of 5%)]
      Answer: [Correct choice, either "Choice 1" or "Choice 2"]
      The scenarios should be situational, such as ${stockName} announcing new features, facing production delays, or major economic events. The answer choices must involve actual increase/decrease percentages that could realistically reflect ${stockName}'s stock movement during that time. Ensure the data is historically grounded and the format is consistent for parsing.
      Do not add any additional explanation or formatting outside of the 10 question blocks. Only return the 10 formatted Q&A blocks.
      `
                }
              ]
            }
          ]
        });
      
        // Safely extract the text
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";      
        const pattern = /Question:\s*(.*?)\s*Choice 1:\s*(.*?)\s*Choice 2:\s*(.*?)\s*Answer:\s*(Choice 1|Choice 2)/gs;
      
        // Extract matched questions and map them into an array of objects
        const questionsArray = Array.from(text.matchAll(pattern)).map(match => {
            const choice1 = match[2].trim();
            const choice2 = match[3].trim();
          
            // Extract percentages from choice1 and choice2
            const percentagePattern = /(-?\d+)%/;
            const choice1Percentage = choice1.match(percentagePattern)?.[1] ?? null;
            const choice2Percentage = choice2.match(percentagePattern)?.[1] ?? null;          
            return {
              question: match[1].trim(),
              choice1,
              choice2,
              answer: match[4].trim(),
              choice1Percentage: choice1Percentage ? parseInt(choice1Percentage, 10) : null,
              choice2Percentage: choice2Percentage ? parseInt(choice2Percentage, 10) : null,
            };
          });
        setQuizData(questionsArray)
        console.log("Parsed questions:", questionsArray);
      
      }
    
      async function fetchExplanation(correctAnswer: string, userChoice: string, explanation: string, question:string) {
        console.log("Fetching explanation for:", { correctAnswer, userChoice, explanation, question });
        const explanationResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `The question is ${question}. The correct answer to this question is ${correctAnswer}. 
                            The user entered ${userChoice} with explanantion ${explanation}. 
                            First, say if the user's answer choice is right or wrong. If the correct answer and the user choice matches, 
                            say it is correct no matter what. 
                            If not, then the user is wrong and please explain why or why not my reasoning is correct in a short and concise paragraph. 
                            Finally, provide the correct answer when the user gets it wrong`
                        }
                    ]
                }
            ]
        });
    
        const explanationText = explanationResponse.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        return explanationText;
    }

    
    const currentQuiz = quizData[currentQuizIndex];
    return (
    <div className="quiz">
        {loading ? (
                <p>Loading quiz data...</p>
            ) : (
                <>
                    <h1>{id} Quiz</h1>
                    <text>Question {currentQuizIndex + 1}</text>
                    <p>{currentQuiz.question}</p>
                    <QuizForm quiz={currentQuiz} onSubmit={submitQuiz} goNext={goNext} answer = {answers}/>
                </>
            )}
        {/* <h1>{id} Quiz</h1>
        <text>question {currentQuizIndex + 1}</text>
        <p>{currentQuiz.question}</p>
        <QuizForm quiz = {currentQuiz} onSubmit={handleNextQuiz} goNext = {goNext}/> */}
    </div>
    );
}