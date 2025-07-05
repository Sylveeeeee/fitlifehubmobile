import express from 'express';
import cors from 'cors';
import profileRouter from './routes/profile';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// ใช้ /api/profile
app.use('/api/profile', profileRouter);
// ใช้ /api/food-entry

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});