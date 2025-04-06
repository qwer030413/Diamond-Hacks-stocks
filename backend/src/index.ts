import express, { Request, Response } from 'express';
import cors from 'cors';
import { Client } from 'pg';

const app = express();
const PORT = 3000;

// PostgreSQL connection setup
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
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5432',
  }),
);

// // Function to check and initialize the database
// const initializeDatabase = async () => {
//   try {
//     // Check if the table exists
//     const tableCheckQuery = `
//       SELECT EXISTS (
//         SELECT FROM information_schema.tables 
//         WHERE table_schema = 'public' 
//         AND table_name = 'performance_metrics'
//       );
//     `;
//     const tableCheckResult = await pool.query(tableCheckQuery);

//     if (!tableCheckResult.rows[0].exists) {
//       console.log('Table "performance_metrics" does not exist. Creating it...');
//       const createTableQuery = `
//         CREATE TABLE performance_metrics (
//           id SERIAL PRIMARY KEY,
//           percentage_correct NUMERIC(5, 2) NOT NULL,
//           net_change_dollars NUMERIC(10, 2) NOT NULL,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );
//       `;
//       await pool.query(createTableQuery);
//       console.log('Table "performance_metrics" created successfully.');
//     } else {
//       console.log('Table "performance_metrics" already exists.');
//     }
//   } catch (error) {
//     console.error('Error initializing database:', error);
//     process.exit(1); // Exit the process if the database initialization fails
//   }
// };

// // Test database connection
// app.get('/test-db', async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query('SELECT NOW()');
//     res.json({ message: 'Database connected!', time: result.rows[0].now });
//   } catch (error) {
//     console.error('Database connection error:', error); // Log the full error
//     res.status(500).json({ error: 'Database connection failed', details: (error as Error).message });
//   }
// });

// // Insert data into the table
// app.post('/add-metric', async (req: Request, res: Response) => {
//   const { percentage_correct, net_change_dollars } = req.body;

//   try {
//     const query = `
//       INSERT INTO performance_metrics (percentage_correct, net_change_dollars)
//       VALUES ($1, $2)
//       RETURNING *;
//     `;
//     const values = [percentage_correct, net_change_dollars];
//     const result = await pool.query(query, values);

//     res.status(201).json({ message: 'Metric added!', data: result.rows[0] });
//   } catch (error) {
//     console.error('Error inserting data:', error);
//     res.status(500).json({ error: 'Failed to add metric' });
//   }
// });

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript + Express!');
});
app.get('/info', (req,res) => {
  const getInfo = "SELECT * FROM performance_metrics;"
  client.query(getInfo, (err, result) => {
    res.status(200).json(result.rows);
  })
})
app.get('/post', (req,res) => {
  const getInfo = "INSERT INTO performance_metrics(id,created_at,net_change_dollars,percentage_correct);"
  client.query(getInfo, (err, result) => {
    res.status(200).json(result.rows);
  })
})
// Start the server after initializing the database
app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  // await initializeDatabase(); // Initialize the database before accepting requests
});