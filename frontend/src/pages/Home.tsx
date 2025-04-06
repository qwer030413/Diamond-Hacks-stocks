
import './pages.css'
import MainContainer from '../components/maincontainer/maincontainer';
import Placeholder from '../components/placeholder/placeholder';
import { useEffect, useState } from 'react';
export default function Home() {
  const [balance, setbalance] = useState(0); // Initialize balance state
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('http://localhost:3000/balance'); // Fetch balance from the backend
        if (!response.ok) {
          throw new Error('Failed to fetch balance');
        }
        const data = await response.json();
        setbalance(data.balance ); // Set balance or default to 10000 if not found
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };
    fetchBalance(); // Call the function to fetch balance
  }, [])
  return (
    <div className="home">
        <Placeholder />
        <MainContainer money = {balance}setbalance = {setbalance} />

    </div>
  );
}