from fastapi import FastAPI
from app.models import EvaluationRequest, EvaluationResponse
from app.scoring_engine import LeadScoringEngine

app = FastAPI(title="Labyrinth ML Service")
engine = LeadScoringEngine()

@app.post("/api/score", response_model=EvaluationResponse)
async def score_lead(request: EvaluationRequest):
    probability = await engine.predict(request)
    return EvaluationResponse(probability=probability)
