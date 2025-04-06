"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
const PORT = 3000;
// PostgreSQL connection setup
const pool = new pg_1.Pool({
    user: 'postgres', // Replace with your PostgreSQL username
    host: 'localhost',
    database: 'stock_analysis',
    password: 'your_password', // Replace with your PostgreSQL password
    port: 5432, // Default PostgreSQL port
});
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5432',
}));
// Test database connection
app.get('/test-db', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool.query('SELECT NOW()');
        res.json({ message: 'Database connected!', time: result.rows[0].now });
    }
    catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
}));
// Insert data into the table
app.post('/add-metric', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { percentage_correct, net_change_dollars } = req.body;
    try {
        const query = `
      INSERT INTO performance_metrics (percentage_correct, net_change_dollars)
      VALUES ($1, $2)
      RETURNING *;
    `;
        const values = [percentage_correct, net_change_dollars];
        const result = yield pool.query(query, values);
        res.status(201).json({ message: 'Metric added!', data: result.rows[0] });
    }
    catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Failed to add metric' });
    }
}));
app.get('/', (req, res) => {
    res.send('Hello from TypeScript + Express!');
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
