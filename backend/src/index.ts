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
  database: 'diamondstocks', // Replace with your PostgreSQL database name
  password: 'qwer', // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});
client.connect().then(() => {
  console.log('Connected to PostgreSQL database!');
}).catch((err) => {
  console.error('Error connecting to PostgreSQL database:', err);
});
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript + Express!');
});
app.get('/balance', (req, res) => {
  console.log(req.body); // Log the request body to see the incoming data
  res.status(200).json(balance);
})

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
  const getQuizzesQuery = "SELECT quiz FROM quiz;"; // SQL query to fetch all quizzes

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
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});