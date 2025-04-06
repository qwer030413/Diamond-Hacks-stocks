import './quizForm.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'; // Import useState for managing state in the component
export default function QuizForm(props: any) {
    const [answer, setAnswer] = useState(""); // State to hold the answer
    const [reasoning, setReasoning] = useState(""); // State to hold the reasoning input
    const [submitted, setSubmitted] = useState(false); // State to track if the form has been submitted
    const [investment, setInvestment] = useState(""); // State to hold the investment amount
    const [investchoice, setInvestChoice] = useState(""); // State to hold the investment choice (yes/no)
    const navigate = useNavigate();
    useEffect(() => {
        console.log("Submitted state changed:", submitted);
    }, [submitted]);
    const handleSubmit = (e:any) => {
        e.preventDefault();
        if (!answer || !reasoning || !investchoice) {
            alert("Please fill in all fields before submitting.");  
        }
        else{
            props.onSubmit({
                answer,
                reasoning,
                investment,
                investchoice,
            });
            // Reset the states after submission
            setAnswer("");
            setReasoning("");
            setInvestment("");
            setInvestChoice("");
            setSubmitted(true)
        }
      };
      
    const handleNext = () => {
        setSubmitted(false); 
        console.log(submitted)
        props.goNext(); 
    };
    return(
        <form className='formContainer' onSubmit={handleSubmit} autoComplete="off">
            <div className="section">
                <label className="title1">Choices:</label>
                    <input type="radio" id="yes1" name="likeQuiz" value="Choice 1" onChange={e => setAnswer(e.target.value)} required/>
                    <label htmlFor="yes1"> {props.quiz.choice1}</label>
                    <input type="radio" id="no1" name="likeQuiz" value="Choice 2" onChange={e => setAnswer(e.target.value)} required/>
                    <label htmlFor="no1">{props.quiz.choice2}</label> 
            </div>
            <div className="section">
                <label className="title1">Would you invest?</label>
                    <input type="radio" id="yes2" name="recommendQuiz" value="yes" onChange={e => setInvestChoice(e.target.value)} required/>
                    <label htmlFor="yes2">Yes</label>
                    <input type="radio" id="no2" name="recommendQuiz" value="no" onChange={e => setInvestChoice(e.target.value)} required/>
                    <label htmlFor="no2">No</label>
            </div>
            <div className="section">
                <label htmlFor="amount" className="title1">How much would you invest, Enter an amount:</label>
                <input type="number" id="amount" name="amount" onChange={e => setInvestment(e.target.value)}/>
            </div>

            <div className='section'>
                <label htmlFor="feedback" className="title1">Your reasoning:</label>
                <textarea id="feedback" name="feedback" rows={4} cols={50}onChange={e => setReasoning(e.target.value)}required></textarea>
            </div>
            <div style={{paddingTop: 20}}>
                {submitted? (
                <p>{props.answer}</p>
                ):
                ("")}
                {submitted? (
                    <button className="button" onClick={() => handleNext()}>Next</button>
                ):
                (
                    <button className="button" type="button" onClick={(e) => handleSubmit(e)}>Submit</button>
                )}
                <button  className="button"onClick={() => navigate(`/`)}>Quit</button>
            </div>    
        </form>
        
    );
}

