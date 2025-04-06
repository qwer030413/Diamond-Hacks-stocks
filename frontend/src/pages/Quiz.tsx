import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuizForm from '../components/quizForm/quizForm';
import { GoogleGenAI } from "@google/genai";

// Import your images
import appleImage from '../assets/images/apple.jpg';
import teslaImage from '../assets/images/tesla.jpg';
import googleImage from '../assets/images/google.jpg';
import nvidiaImage from '../assets/images/nvidia.jpg';
import microsoftImage from '../assets/images/microsoft.jpg';

export default function Quiz() {
    const { id } = useParams();
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0); // Track current quiz index
    const [answers, setAnswers] = useState(""); // Store user answers
    const [question, setQuestion] = useState(""); // Store the current question text
    const [correctAnswer, setCorrectAnswer] = useState(""); // Store the correct answer for the current question
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [quizData, setQuizData] = useState<{ question: string; choice1: string; choice2: string; answer: string; choice1Percentage: number | null; choice2Percentage: number | null;}[]>([]); // Store quiz data from AI
    const ai = new GoogleGenAI({ apiKey: "AIzaSyBaH4rns3_6ue8vfEd_lrZpy-hOK4QH-C0" });
    const [newBalance, setNewBalance] = useState(0);
    const [originalBalance, setOriginalBalance] = useState(0); // Store the original balance for comparison
    const [correct, setCorrect] = useState(0); // Store the correct answer count for balance calculation
    const [difference, setDifference] = useState(0); // State to hold the investment amount

    // Create a mapping of IDs to images
    const imageMapping: { [key: string]: string } = {
        apple: appleImage,
        tesla: teslaImage,
        google: googleImage,
        nvidia: nvidiaImage,
        microsoft: microsoftImage,
    };

    // Get the image based on the id
    const quizImage = id && imageMapping[id.toLowerCase()]; // Use `toLowerCase()` to handle case-insensitive IDs

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/balance"); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json(); // Parse the JSON response
                setNewBalance(data.balance);
                setOriginalBalance(data.balance)
                console.log("called new balance")
                console.log("Fetched data:", data.balance); // Log the fetched data
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
        async function fetchQuestions() {
            setLoading(true); // Set loading to true before fetching
            if (id) {
                await gemini_questions(id, 10);
            } else {
                console.error("Stock ID is undefined");
            }
            setLoading(false); // Set loading to false after fetching
        }
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (quizData.length > 0 && currentQuizIndex < quizData.length) {
            const currentQuiz = quizData[currentQuizIndex];
            setQuestion(currentQuiz.question); // Update the question state
            setCorrectAnswer(currentQuiz.answer); // Update the correct answer state
            if (currentQuiz.answer === "Choice 1") {
                setDifference(currentQuiz.choice1Percentage ?? 0); // Set the difference for Choice 1
            }
            else{
                setDifference(currentQuiz.choice2Percentage ?? 0); // Set the difference for Choice 2
            }
        }
    }, [quizData, currentQuizIndex]);

    const submitQuiz = async (answer: any) => {
        const explanation = await fetchExplanation(correctAnswer, answer.answer, answer.reasoning, question);
        setAnswers(explanation)
      };
    function goNext(){
        if (currentQuizIndex < 2) {
            setCurrentQuizIndex(currentQuizIndex + 1);
            console.log(newBalance);
            setCorrectAnswer("")
        } else {
            alert("You have completed all quizzes!");
            postQuiz(newBalance); // Post the quiz results to the server
            postBalance(newBalance); // Post the updated balance to the server
            navigate(`/`)
        }
    }
    console.log(correctAnswer)
    async function postBalance(updatedBalance: number) {
        console.log("Posting updated balance:", updatedBalance);
        console.log("balance type:", typeof updatedBalance);
        try {
          const response = await fetch("http://localhost:3000/balance", {
            method: "POST", // Use POST to update the balance
            headers: {
              "Content-Type": "application/json", // Specify JSON content type
            },
            body: JSON.stringify({ newBalance: updatedBalance }), // Send the updated balance
          });
      
          if (!response.ok) {
            throw new Error("Failed to update balance");
          }
      
          const data = await response.json();
          console.log("Balance successfully updated:", data);
        } catch (error) {
          console.error("Error updating balance:", error);
        }
      }
    async function postQuiz(updatedBalance: number) {
    console.log("Posting updated balance:", updatedBalance);
    console.log("balance type:", typeof updatedBalance);
    try {
        const response = await fetch("http://localhost:3000/quiz", {
        method: "POST", // Use POST to update the balance
        headers: {
            "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify({ name: id, correct: correct, balancechange: -(originalBalance - newBalance) }), // Send the updated balance
        });
    
        if (!response.ok) {
        throw new Error("Failed to update balance");
        }
    
        const data = await response.json();
        console.log("Balance successfully updated:", data);
    } catch (error) {
        console.error("Error updating balance:", error);
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
      `,
                        },
                    ],
                },
            ],
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        const pattern = /Question:\s*(.*?)\s*Choice 1:\s*(.*?)\s*Choice 2:\s*(.*?)\s*Answer:\s*(Choice 1|Choice 2)/gs;

// Extract matched questions and map them into an array of objects
        const questionsArray = Array.from(text.matchAll(pattern)).map(match => {
            const choice1 = match[2].trim();
            const choice2 = match[3].trim();
            // Extract percentages from choice1 and choice2
            const percentagePattern = /(-?\d+(.\d+)?)%/; // Match integers or decimals
            const choice1Percentage = choice1.match(percentagePattern)?.[1] ?? "";
            const choice2Percentage = choice2.match(percentagePattern)?.[1] ?? "";

            // Determine if the percentage is positive or negative based on keywords
            const choice1SignedPercentage = choice1.toUpperCase().includes("INCREASE OF")
                ? +(parseFloat(choice1Percentage) || 0)
                : choice1.toUpperCase().includes("DECREASE OF")
                ? -(parseFloat(choice1Percentage) || 0)
                : parseFloat(choice1Percentage) || 0;

            const choice2SignedPercentage = choice2.toUpperCase().includes("INCREASE OF")
                ? +(parseFloat(choice2Percentage) || 0)
                : choice2.toUpperCase().includes("DECREASE OF")
                ? -(parseFloat(choice2Percentage) || 0)
                : parseFloat(choice2Percentage) || 0;
            return {
              question: match[1].trim(),
              choice1,
              choice2,
              answer: match[4].trim(),
              choice1Percentage: choice1SignedPercentage, // Include the signed percentage as a string
              choice2Percentage: choice2SignedPercentage, // Include the signed percentage as a string

            };
        });
        setQuizData(questionsArray);
        console.log("Parsed questions:", questionsArray);
    }

    async function fetchExplanation(correctAnswer: string, userChoice: string, explanation: string, question: string) {
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
                            Finally, provide the correct answer when the user gets it wrong`,
                        },
                    ],
                },
            ],
        });

        const explanationText = explanationResponse.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        return explanationText;
    }

    return (
        <div className="quiz">
            {loading ? (
                <p>Loading quiz data...</p>
            ) : (
                <>
                    {quizImage && (
                        <img
                            src={quizImage}
                            alt={`${id} logo`}
                            className="quiz-img"
                        />
                    )}
                    <div className="formContainer">
                        <h1 style={{margin: 10}}>{id} Quiz</h1>
                        <p>Question {currentQuizIndex + 1}</p>
                        <p>{quizData[currentQuizIndex]?.question}</p>
                        <form className="formContainer">
                            <QuizForm
                                quiz={quizData[currentQuizIndex]}
                                onSubmit={submitQuiz}
                                goNext={goNext}
                                answer={answers}
                                setCorrect = {setCorrect} 
                                correct = {correct} 
                                correctAnswer = {correctAnswer}
                                setNewBalance = {setNewBalance}
                                newBalance = {newBalance} // diff is balance
                                difference = {difference} // Pass the investment difference to QuizForm
                            />
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}