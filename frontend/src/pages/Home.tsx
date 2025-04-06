
import './pages.css'
import MainContainer from '../components/maincontainer/maincontainer';
import Placeholder from '../components/placeholder/placeholder';
import { useState } from 'react';
export default function Home() {
  const [balance, setbalance] = useState(10000); // Initialize balance state
  return (
    <div className="home">
        <Placeholder />
        <MainContainer money = {balance}setbalance = {setbalance} />

    </div>
  );
}