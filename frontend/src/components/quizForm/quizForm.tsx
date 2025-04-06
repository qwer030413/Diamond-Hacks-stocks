import './quizForm.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function QuizForm(props: any) {
    const [answer, setAnswer] = useState(""); // State to hold the answer
    const [reasoning, setReasoning] = useState(""); // State to hold the reasoning input
    const [submitted, setSubmitted] = useState(false); // State to track if the form has been submitted
    const [investment, setInvestment] = useState(0); // State to hold the investment amount
    const [investchoice, setInvestChoice] = useState(""); // State to hold the investment choice
    const [balance, setBalance] = useState(0); // State to hold the user's balance
    const [updatedBalance, setUpdatedBalance] = useState<number | null>(null); // State to hold the updated balance
    const navigate = useNavigate();

    // Fetch the user's balance from the backend
    useEffect(() => {
        async function fetchBalance() {
            try {
                const response = await fetch('http://localhost:3000/balance'); // Replace with your backend endpoint
                const data = await response.json();
                setBalance(data.balance); // Store the balance in state
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        }
        fetchBalance();
    }, []);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!answer || !reasoning || !investchoice) {
            alert("Please fill in all fields before submitting.");
        } else if (investment > balance) {
            alert("Please only invest the amount you have in your balance: " + balance);
        } else {
            props.onSubmit({
                answer,
                reasoning,
                investment,
                investchoice,
            });

            // Update the balance regardless of whether the answer is correct or not
            let updatedBalance: number;
            if (typeof props.newBalance === "number" && typeof props.difference === "number") {
                updatedBalance = props.newBalance + investment * (props.difference / 100);
                props.setNewBalance(updatedBalance);
            } else {
                updatedBalance = props.newBalance + investment * (props.difference / 100);
                console.error("Invalid inputs for balance calculation:", {
                    balance: props.newBalance,
                    investment,
                    difference: props.difference,
                    updatedBalance: updatedBalance,
                });
            }
            setUpdatedBalance(updatedBalance); // Update the balance state

            // Handle correct answers
            if (answer === props.correctAnswer) {
                props.setCorrect(props.correct + 1);
            }

            console.log("Updated balance:", updatedBalance);
            setSubmitted(true); // Mark the form as submitted
        }
    };

    const handleNext = () => {
        // Reset the states when the "Next" button is pressed
        setAnswer("");
        setReasoning("");
        setInvestment(0);
        setInvestChoice("");
        setSubmitted(false);
        setUpdatedBalance(null); // Reset the updated balance
        console.log("Resetting form for the next quiz");
        props.goNext();
    };

    return (
        <form className="formContainer" onSubmit={handleSubmit} autoComplete="off">
            <div className="section">
                <label className="title1">Choices:</label>
                <input
                    type="radio"
                    id="yes1"
                    name="likeQuiz"
                    value="Choice 1"
                    checked={answer === "Choice 1"} // Bind to state
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                />
                <label htmlFor="yes1"> {props.quiz.choice1}</label>
                <input
                    type="radio"
                    id="no1"
                    name="likeQuiz"
                    value="Choice 2"
                    checked={answer === "Choice 2"} // Bind to state
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                />
                <label htmlFor="no1">{props.quiz.choice2}</label>
            </div>
            <div className="section">
                <label className="title1">Would you invest?</label>
                <input
                    type="radio"
                    id="yes2"
                    name="recommendQuiz"
                    value="yes"
                    checked={investchoice === "yes"} // Bind to state
                    onChange={(e) => setInvestChoice(e.target.value)}
                    required
                />
                <label htmlFor="yes2">Yes</label>
                <input
                    type="radio"
                    id="no2"
                    name="recommendQuiz"
                    value="no"
                    checked={investchoice === "no"} // Bind to state
                    onChange={(e) => setInvestChoice(e.target.value)}
                    required
                />
                <label htmlFor="no2">No</label>
            </div>
            {investchoice === "yes" && (
                <>
                    <div className="section">
                        <label htmlFor="amount" className="title1">
                            How much would you invest? Enter an amount:
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={investment} // Bind to state
                            onChange={(e) => setInvestment(Number(e.target.value))}
                            required
                        />
                    </div>
                </>
            )}

            <div className="section">
                <label htmlFor="feedback" className="title1">
                    Your reasoning:
                </label>
                <textarea
                    id="feedback"
                    name="feedback"
                    rows={4}
                    cols={50}
                    value={reasoning} // Bind to state
                    onChange={(e) => setReasoning(e.target.value)}
                    required
                ></textarea>
            </div>
            <div style={{ paddingTop: 20 }}>
                {submitted ? <p>{props.answer}</p> : ""}
                {submitted && updatedBalance !== null ? (
                    <p>Your current balance is: ${updatedBalance.toFixed(2)}</p>
                ) : (
                    ""
                )}
                {submitted ? (
                    <button className="button" onClick={() => handleNext()}>
                        Next
                    </button>
                ) : (
                    <button className="button" type="button" onClick={(e) => handleSubmit(e)}>
                        Submit
                    </button>
                )}
                <button className="button" onClick={() => navigate(`/`)}>
                    Quit
                </button>
            </div>
        </form>
    );
}