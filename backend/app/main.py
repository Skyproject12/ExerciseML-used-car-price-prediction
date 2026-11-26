import json
import logging

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request

from app.schemas import (
    PredictionRequest,
    PredictionResponse,
    HealthResponse
)

from app.predictor import CarPricePredictor


logger = logging.getLogger(__name__)


# ==========================================
# Artifact Directory
# ==========================================

ARTIFACT_DIR = (
    Path(__file__).resolve().parent.parent
    / "artifacts"
)


# ==========================================
# Application Lifecycle
# ==========================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    app.state.predictor = CarPricePredictor()

    yield

    app.state.predictor = None


# ==========================================
# FastAPI Configuration
# ==========================================

app = FastAPI(
    title="Used Car Price Prediction API",
    description=(
        "Used Car Price Prediction using "
        "Stacking Ensemble Learning"
    ),
    version="1.0.0",
    lifespan=lifespan
)


# ==========================================
# JSON Helper
# ==========================================

def load_json(filename: str):

    with open(
        ARTIFACT_DIR / filename,
        encoding="utf-8"
    ) as file:

        return json.load(file)


# ==========================================
# Root Endpoint
# ==========================================

@app.get("/")
def root():

    return {
        "message": "Used Car Price Prediction API",
        "version": "1.0.0"
    }


# ==========================================
# Health Endpoint
# ==========================================

@app.get("/health", response_model=HealthResponse)
def health(request: Request):

    return HealthResponse(
        status="success",
        message="Server is running",
        model_loaded=request.app.state.predictor is not None
    )


# ==========================================
# Model Information Endpoint
# ==========================================

@app.get("/model/info")
def model_info():

    return load_json("model_metadata.json")


# ==========================================
# Model Evaluation Endpoint
# ==========================================

@app.get("/model/metrics")
def model_metrics():

    metadata = load_json("model_metadata.json")

    if "metrics" not in metadata:
        raise HTTPException(
            status_code=500,
            detail="Model metrics are unavailable"
        )

    return metadata["metrics"]


# ==========================================
# Feature Options Endpoint
# ==========================================

@app.get("/features")
def feature_options():

    return load_json("feature_options.json")


# ==========================================
# Vehicle Mapping Endpoint
# ==========================================

@app.get("/vehicles")
def vehicle_mapping():

    return load_json("vehicle_mapping.json")


# ==========================================
# Prediction Endpoint
# ==========================================

@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(
    payload: PredictionRequest,
    request: Request
):

    try:

        input_data = payload.model_dump()

        predicted_price = (
            request.app.state.predictor.predict(input_data)
        )

        return PredictionResponse(
            predicted_price=round(predicted_price, 2)
        )

    except Exception:

        logger.exception("Prediction failed")

        raise HTTPException(
            status_code=500,
            detail="Prediction failed"
        )