import './maincontainer.css'
import QuizBox from '../quizbox/quizbox';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function MainContainer(props: any) {
    const navigate = useNavigate();
    return(
        <div className="main-container">
            <div className='header'>
                <h1 style={{color:'black'}}>Diamond Stocks</h1>
                <div style={{display: 'flex', gap:'30px', alignItems: 'center'}}>
                    <text style={{fontWeight:'bold', fontSize:22, color:'black'}}>${props.money}</text>
                    <button onClick={() => navigate('/History')}>History</button>
                </div>
            </div>
            <div className='quiz-box-container'>
                <QuizBox title = 'Apple' status = "completed" score = "N/A"/>
            </div>
        </div>
    );
}