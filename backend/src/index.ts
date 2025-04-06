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
  password: 'qwer', // Replace with your PostgreSQL password
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