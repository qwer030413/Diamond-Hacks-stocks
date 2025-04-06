import './quizbox.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function QuizBox(props: any) {
    const navigate = useNavigate();
    return (
        <div className="quiz-box" onClick={() => navigate(`/Quiz/${props.title}`)}>
            <img src={props.image} className="quiz-image" />
            <text className="title">{props.title}</text>
            <div className='info'>
                <text>status: {props.status}</text>
                <text>score: {props.score}</text>
            </div>
        </div>
    );
}