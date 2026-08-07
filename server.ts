import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json());

const EvaluationSchema = z.object({
  capital: z.number().positive(),
  horizon: z.number().int().positive(),
  riskProfile: z.number().int().min(1).max(3)
});

interface EvaluationPayload {
  capital: number;
  horizon: number;
  riskProfile: number;
}

interface PricingResult {
  probability: number;
  yield: number;
  finalAllocation: number;
}

const calculatePricing = async (payload: EvaluationPayload): Promise<PricingResult> => {
  const baseYield = payload.capital * 0.0001 * payload.horizon;
  const riskMultiplier = 1 + (payload.riskProfile * 0.15);
  const optimizedYield = baseYield * riskMultiplier;
  const probability = Math.min(0.95, 0.5 + (payload.horizon / 100) + (payload.riskProfile * 0.1));
  const finalAllocation = payload.capital * (1 + optimizedYield);

  return {
    probability,
    yield: optimizedYield,
    finalAllocation: Math.round(finalAllocation)
  };
};

app.post('/api/evaluate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = EvaluationSchema.parse(req.body);
    const result = await calculatePricing(validatedData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

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
