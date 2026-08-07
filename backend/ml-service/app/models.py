from pydantic import BaseModel

class EvaluationRequest(BaseModel):
    capital: float
    horizon: int
    riskProfile: int

class EvaluationResponse(BaseModel):
    probability: float
