from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import uvicorn

app = FastAPI(
    title="Hungry Bird AI Service",
    description="AI/ML microservices for Hungry Bird Cloud Kitchen",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("AI_SERVICE_API_KEY", "dev-ai-key")

def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key

# ── Health Check ──────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "Hungry Bird AI", "version": "1.0.0"}

# ── Recommendations ───────────────────────────────────────
class RecommendationRequest(BaseModel):
    userId: str
    limit: Optional[int] = 10
    context: Optional[str] = None  # "breakfast", "lunch", "dinner"

class MenuItemRecommendation(BaseModel):
    menuItemId: str
    name: str
    score: float
    reason: str

@app.post("/ai/recommendations")
def get_recommendations(req: RecommendationRequest, api_key: str = Depends(verify_api_key)):
    """
    Collaborative + Content-Based Filtering recommendations.
    TODO: Load trained model and generate real recommendations.
    """
    # Placeholder response – will be replaced with real ML inference
    mock_recommendations = [
        MenuItemRecommendation(menuItemId=f"item_{i}", name=f"Recommended Item {i}", score=0.95 - i * 0.05, reason="Based on your order history")
        for i in range(1, req.limit + 1)
    ]
    return {"recommendations": mock_recommendations, "userId": req.userId, "model": "collaborative_filtering_v1"}

# ── ETA Prediction ────────────────────────────────────────
class ETARequest(BaseModel):
    orderId: str
    kitchenLat: float
    kitchenLng: float
    deliveryLat: float
    deliveryLng: float
    currentOrderCount: Optional[int] = 5
    timeOfDay: Optional[str] = None

@app.post("/ai/eta")
def predict_eta(req: ETARequest, api_key: str = Depends(verify_api_key)):
    """
    Random Forest ETA prediction.
    TODO: Train and load RF model with real delivery data.
    """
    import math
    # Simple haversine distance calculation as placeholder
    dlat = math.radians(req.deliveryLat - req.kitchenLat)
    dlng = math.radians(req.deliveryLng - req.kitchenLng)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(req.kitchenLat)) * math.cos(math.radians(req.deliveryLat)) * math.sin(dlng/2)**2
    distance_km = 6371 * 2 * math.asin(math.sqrt(a))
    eta_minutes = int(15 + distance_km * 3 + req.currentOrderCount * 2)
    return {"eta_minutes": eta_minutes, "distance_km": round(distance_km, 2), "model": "random_forest_eta_v1"}

# ── Demand Forecasting ────────────────────────────────────
@app.get("/ai/demand-forecast")
def demand_forecast(date: Optional[str] = None, api_key: str = Depends(verify_api_key)):
    """
    Prophet/LSTM demand forecasting.
    TODO: Train and load time series model.
    """
    slots = [
        {"time": "07:00-09:00", "meal": "breakfast", "expected_orders": 120, "confidence": 0.85},
        {"time": "12:00-14:00", "meal": "lunch",     "expected_orders": 280, "confidence": 0.92},
        {"time": "19:00-21:00", "meal": "dinner",    "expected_orders": 200, "confidence": 0.88},
    ]
    return {"date": date or "today", "forecast": slots, "model": "prophet_v1"}

# ── Sentiment Analysis ────────────────────────────────────
class SentimentRequest(BaseModel):
    text: str
    reviewId: Optional[str] = None

@app.post("/ai/sentiment")
def analyze_sentiment(req: SentimentRequest, api_key: str = Depends(verify_api_key)):
    """
    BERT-based sentiment analysis.
    TODO: Load distilbert-base-uncased fine-tuned model.
    """
    # Simple rule-based placeholder
    positive_words = ['great', 'excellent', 'amazing', 'love', 'delicious', 'fresh', 'perfect', 'wonderful']
    negative_words = ['bad', 'terrible', 'awful', 'disgusting', 'cold', 'late', 'wrong', 'poor']
    text_lower = req.text.lower()
    pos_count = sum(1 for w in positive_words if w in text_lower)
    neg_count = sum(1 for w in negative_words if w in text_lower)
    score = (pos_count - neg_count) / max(pos_count + neg_count, 1)
    label = "positive" if score > 0.1 else "negative" if score < -0.1 else "neutral"
    return {"score": round(score, 3), "label": label, "topics": [], "model": "bert_sentiment_v1"}

# ── Inventory Prediction ──────────────────────────────────
@app.get("/ai/inventory-prediction")
def inventory_prediction(itemId: str, api_key: str = Depends(verify_api_key)):
    """
    LSTM/Prophet inventory prediction.
    TODO: Train demand model per inventory item.
    """
    return {
        "itemId": itemId,
        "reorder_qty": 500,
        "predicted_runout_days": 7,
        "safety_stock": 100,
        "model": "lstm_inventory_v1",
    }

# ── Dynamic Pricing ───────────────────────────────────────
class PricingRequest(BaseModel):
    itemId: str
    basePrice: float
    demandLevel: Optional[str] = "normal"  # low, normal, high
    timeOfDay: Optional[str] = None

@app.post("/ai/pricing")
def dynamic_pricing(req: PricingRequest, api_key: str = Depends(verify_api_key)):
    """
    Gradient Boosting dynamic pricing.
    TODO: Train pricing model with demand + competition data.
    """
    multipliers = {"low": 0.9, "normal": 1.0, "high": 1.15}
    multiplier = multipliers.get(req.demandLevel, 1.0)
    return {
        "itemId": req.itemId,
        "basePrice": req.basePrice,
        "multiplier": multiplier,
        "effectivePrice": round(req.basePrice * multiplier, 2),
        "model": "gradient_boost_pricing_v1",
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
