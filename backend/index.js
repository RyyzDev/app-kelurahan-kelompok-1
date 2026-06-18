import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './src/routes/index.js';

dotenv.config();


const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('SI-GERCAP Backend is running!');
});

// Fallback for 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
