import express from 'express';
import cors from 'cors';
import profileRouter from './routes/profile';
import foodEntryRouter from './routes/food-entry'; 
import foodRouter from './routes/food';
import nutrientsSummaryRouter from './routes/nutrients-summary';
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
// ใช้ /api/nutrients
app.use('/api/nutrients', nutrientsSummaryRouter);

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});