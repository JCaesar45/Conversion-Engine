import asyncio
from pydantic import BaseModel
from sklearn.ensemble import GradientBoostingClassifier
import numpy as np

class EvaluationRequest(BaseModel):
    capital: float
    horizon: int
    riskProfile: int

class EvaluationResponse(BaseModel):
    probability: float
    yield: float
    finalAllocation: float

class LeadScoringEngine:
    def __init__(self):
        self.model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3)
        self._initialize_model()

    def _initialize_model(self):
        X_train = np.array([
            [50000, 12, 1], [150000, 24, 2], [300000, 36, 3],
            [75000, 18, 1], [200000, 48, 2], [500000, 60, 3],
            [100000, 6, 1], [250000, 30, 2], [400000, 42, 3]
        ])
        y_train = np.array([0, 1, 1, 0, 1, 1, 0, 1, 1])
        self.model.fit(X_train, y_train)

    async def predict(self, request: EvaluationRequest) -> float:
        features = np.array([[request.capital, request.horizon, request.riskProfile]])
        probabilities = self.model.predict_proba(features)
        return float(probabilities[0][1])

engine = LeadScoringEngine()

async def process_scoring(request: EvaluationRequest) -> float:
    await asyncio.sleep(0.05)
    return await engine.predict(request)
