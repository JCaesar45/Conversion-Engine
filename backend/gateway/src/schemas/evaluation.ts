import { z } from 'zod';

export const EvaluationSchema = z.object({
  capital: z.number().positive(),
  horizon: z.number().int().positive(),
  riskProfile: z.number().int().min(1).max(3)
});
