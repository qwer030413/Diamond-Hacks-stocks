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
      origin: 'http://localhost:5173',
    }),
  );
const client = new Client({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'postgres', // Replace with your PostgreSQL database name
  password: '12345', // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});
async function initializeDatabase() {
  try {
    // Create the `balance` table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS balance (
        balance NUMERIC(15, 2) NOT NULL DEFAULT 10000
      );
    `);

    // Insert an initial balance if the table is empty
    const balanceResult = await client.query('SELECT COUNT(*) FROM balance;');
    if (parseInt(balanceResult.rows[0].count, 10) === 0) {
      await client.query('INSERT INTO balance (balance) VALUES (10000);');
      console.log('Initial balance inserted.');
    }

    // Create the `quiz` table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        correct INTEGER NOT NULL,
        balancechange NUMERIC(15, 2) NOT NULL
      );
    `);

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
client.connect().then(async() => {
  await initializeDatabase();
  console.log('Connected to PostgreSQL database!');
}).catch((err) => {
  console.error('Error connecting to PostgreSQL database:', err);
});
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript + Express!');
});

app.post("/quiz", (req: any, res:any) => {
  const newQuiz = "INSERT INTO quiz(name, correct, balancechange) VALUES ($1,$2,$3);";
  try {
    //retrieve data from body
    const { name, correct, balancechange } = req.body;
    //checking for edge cases and validating data

    if (!name || !correct || !balancechange) {
      return res.status(400).json({ error: "Invalid fields" });
    }
    //query
    client.query(newQuiz, [name, correct, balancechange]);
    res.status(200).json({ message: "New quiz submitted!" });
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
});

app.get("/quiz", async (req: any, res:any) => {
  const getQuizzesQuery = "SELECT id, name, correct, balancechange FROM quiz;"; // Fetch specific columns

  try {
    const result = await client.query(getQuizzesQuery); // Execute the query
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No quizzes found" }); // Handle empty result
    }
    res.status(200).json(result.rows); // Return all quizzes
  } catch (err) {
    console.error("Error fetching quizzes:", err); // Log the error
    res.status(500).json({ error: "Internal server error" }); // Return a generic error message
  }
  });

  app.get('/quizzes', async (req: Request, res: Response) => {
    try {
      const result = await client.query(`
        SELECT name, correct, 10 AS total
        FROM quiz
      `);
      res.status(200).json(result.rows); // Return the quiz data
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
  });

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
    const result = await client.query('SELECT * FROM balance'); // Example query
    const balance = result.rows[0]?.balance || 0; // Get the balance or default to 0
    res.status(200).json({ balance });
  } catch (error) {
    console.error('Error retrieving balance:', error);
    res.status(500).json({ error: 'Failed to retrieve balance' });
  }
});