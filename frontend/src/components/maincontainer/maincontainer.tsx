import './maincontainer.css'
import QuizBox from '../quizbox/quizbox';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import appleImage from '../../assets/images/apple.jpg';
import teslaImage from '../../assets/images/tesla.jpg';
import googleImage from '../../assets/images/google.jpg';
import nvidiaImage from '../../assets/images/nvidia.jpg'; 
import microsoftImage from '../../assets/images/microsoft.jpg'; 

export default function MainContainer(props: any) {
    const navigate = useNavigate();
    return(
        <div className="main-container">
            <div className='header'>
                <h1 style={{color:'white'}}>Diamond Stocks</h1>
                <div style={{display: 'flex', gap:'30px', alignItems: 'center'}}>
                    <text style={{fontWeight:'bold', fontSize:22, color:'white'}}>${props.money}</text>
                    <button onClick={() => navigate('/History')}>History</button>
                </div>
            </div>
            <div className='quiz-box-container'>
                <QuizBox title="Apple" status="completed" score="N/A" image={appleImage} />
                <QuizBox title="Tesla" status="completed" score="N/A" image={teslaImage} />
                <QuizBox title="Google" status="completed" score="N/A" image={googleImage} />
                <QuizBox title="Nvidia" status="completed" score="N/A" image={nvidiaImage} />
                <QuizBox title="Microsoft" status="completed" score="N/A" image={microsoftImage} />
\            </div>
        </div>
    );
}