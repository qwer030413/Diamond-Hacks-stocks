import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { Client } from 'pg';
const app = express();
const PORT = 3000;
let balance = 10000;
app.use(express.json());
app.use(
    cors({
      origin: 'http://localhost:5175',
    }),
  );
const client = new Client({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'postgres', // Replace with your PostgreSQL database name
  password: '12345', // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});
client.connect().then(() => {
  console.log('Connected to PostgreSQL database!');
})
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript + Express!');
});
app.get('/balance', (req, res) => {
  console.log(req.body); // Log the request body to see the incoming data
  res.status(200).json(balance);
})
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// 1 to post and one to get
app.post('/balance', async (req: Request, res: Response) => {
  const { newBalance } = req.body; // Extract the new balance from the request body
  console.log(newBalance); // Log the new balance to see the incoming data

  if (typeof newBalance === 'number' && newBalance >= 0) { // Validate the balance
    try {
      // Update the balance in the database
      await client.query('UPDATE balance SET balance = $1', [newBalance]);
      res.status(200).json({ message: 'Balance updated successfully!' });
    } catch (error) {
      console.error('Error updating balance:', error);
      res.status(500).json({ error: `Failed to update balance ${error}` });
    }
  } else {
    res.status(400).json({ message: 'Invalid balance value!' });
  }
});

app.get('/balance', async (req: Request, res: Response) => {
  try {
    const result = await client.query('SELECT balance FROM balance WHERE id = 1'); // Example query
    const balance = result.rows[0]?.balance || 0; // Get the balance or default to 0
    res.status(200).json({ balance });
  } catch (error) {
    console.error('Error retrieving balance:', error);
    res.status(500).json({ error: 'Failed to retrieve balance' });
  }
});