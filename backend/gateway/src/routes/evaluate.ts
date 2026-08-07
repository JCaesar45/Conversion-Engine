import { Router, Request, Response, NextFunction } from 'express';
import { EvaluationSchema } from '../schemas/evaluation';

export const evaluateRouter = Router();

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

evaluateRouter.post('/evaluate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = EvaluationSchema.parse(req.body);
    const result = await calculatePricing(validatedData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
