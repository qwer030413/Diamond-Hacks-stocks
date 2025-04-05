
import './App.css'
import { Route,Routes } from 'react-router-dom';
import Home from './pages/Home'; // Import the Home component
import History from './pages/History';
function App() {
  return (
    <>
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/History" element = {<History />} />
      </Routes>
    </>
  )
}

export default App
