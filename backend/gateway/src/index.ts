import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { EvaluationSchema } from './schemas/evaluation';
import { evaluateRouter } from './routes/evaluate';

const app = express();
app.use(express.json());

app.use('/api', evaluateRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway operational on port ${PORT}`);
});
