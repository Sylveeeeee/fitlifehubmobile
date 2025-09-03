import express from 'express';
import cors from 'cors';
import profileRouter from './routes/profile';
import foodEntryRouter from './routes/foodEntry';
import foodRouter from './routes/food';
import exerciseEntryRouter from './routes/exerciseEntry';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// ใช้ /api/profile
app.use('/api/profile', profileRouter);
// ใช้ /api/food-entry
app.use('/api/food-entry', foodEntryRouter);
// ใช้ /api/foods
app.use('/api/foods', foodRouter);

app.use('/api/exercise-entry',  exerciseEntryRouter);


const PORT = process.env.PORT || 8455;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});