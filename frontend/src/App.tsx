
import './App.css'
import { Route,Routes } from 'react-router-dom';
import Home from './pages/Home'; // Import the Home component
import History from './pages/History';
import Quiz from './pages/Quiz';
function App() {
  return (
    <>
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/History" element = {<History />} />
        <Route path = "/Quiz/:id" element = {<Quiz />} />
        {/* Add more routes here as needed */}
      </Routes>
    </>
  )
}

export default App
