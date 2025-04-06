import './quizbox.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function QuizBox(props: { title: string; status: string; score: string; image: string }) {
    const navigate = useNavigate();
    return (
        <div className="quiz-box" onClick={() => navigate(`/Quiz/${props.title}`)}>
            <img src={props.image} alt={props.title} className="quiz-image" /> {/* Use the image from props */}
            <text className="title">{props.title}</text>
            <div className="info">
                <text>status: {props.status}</text>
                <div className="divider"></div>
                <text>score: {props.score}</text>
            </div>
        </div>
    );
}