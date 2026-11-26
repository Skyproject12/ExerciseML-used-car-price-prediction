from pydantic import BaseModel, Field, ConfigDict


# ==========================================
# Prediction Request Schema
# ==========================================

class PredictionRequest(BaseModel):

    model_config = ConfigDict(extra="forbid")

    provinsi: str = Field(min_length=1)
    merek: str = Field(min_length=1)
    model: str = Field(min_length=1)
    varian: str | None = None

    tahun: int = Field(ge=1900, le=2100)
    jarak_tempuh: float = Field(ge=0)

    tipe_bahan_bakar: str | None = None
    warna: str | None = None
    transmisi: str | None = None
    tipe_bodi: str | None = None
    kapasitas_mesin: str | None = None
    tipe_penjual: str | None = None
    sistem_penggerak: str | None = None


# ==========================================
# Prediction Response Schema
# ==========================================

class PredictionResponse(BaseModel):

    status: str = "success"
    message: str = "Prediction completed successfully"
    predicted_price: float
    currency: str = "IDR"
    model_name: str = "Stacking Ensemble"


# ==========================================
# Health Response Schema
# ==========================================

class HealthResponse(BaseModel):

    status: str
    message: str
    model_loaded: bool