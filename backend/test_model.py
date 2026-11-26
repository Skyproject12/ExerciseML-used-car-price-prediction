import json
import joblib
import numpy as np
import pandas as pd

from pathlib import Path
from xgboost import XGBRegressor


# ==========================================
# 1. Artifact Directory
# ==========================================

ARTIFACT_DIR = (
    Path(__file__).resolve().parent / "artifacts"
)


# ==========================================
# 2. Load Model Configuration
# ==========================================

with open(
    ARTIFACT_DIR / "stacking_config.json",
    encoding="utf-8"
) as file:
    config = json.load(file)


# ==========================================
# 3. Load Base Learners
# ==========================================

rf_pipeline = joblib.load(
    ARTIFACT_DIR / "random_forest.pkl"
)

print("Random Forest loaded successfully!")


svr_pipeline = joblib.load(
    ARTIFACT_DIR / "svr.pkl"
)

print("SVR loaded successfully!")


xgb_preprocessor = joblib.load(
    ARTIFACT_DIR / "xgboost_preprocessor.pkl"
)

xgb_model = XGBRegressor()

xgb_model.load_model(
    ARTIFACT_DIR / "xgboost.json"
)

print("XGBoost loaded successfully!")


# ==========================================
# 4. Load Meta Learner
# ==========================================

meta_learner = joblib.load(
    ARTIFACT_DIR / "meta_learner.pkl"
)

print("Meta learner loaded successfully!")


# ==========================================
# 5. Load Target Transformer
# ==========================================

target_transformer = joblib.load(
    ARTIFACT_DIR / "target_transformer.pkl"
)

print("Target transformer loaded successfully!")


# ==========================================
# 6. Prepare Sample Input
# ==========================================

input_data = {
    "provinsi": "Jawa Tengah",
    "merek": "BMW",
    "model": "Serie 3",
    "varian": "320i Business Edition",
    "tahun": 2006,
    "jarak_tempuh": 87500,
    "tipe_bahan_bakar": "Bensin",
    "warna": "Hitam",
    "transmisi": "Automatic",
    "tipe_bodi": "Sedan",
    "kapasitas_mesin": ">1.500 - 2.000 cc",
    "tipe_penjual": "Individu",
    "sistem_penggerak": np.nan
}

input_df = pd.DataFrame(
    [input_data],
    columns=config["features"]
)


# ==========================================
# 7. Base Learner Predictions
# ==========================================

rf_prediction = rf_pipeline.predict(input_df)

xgb_input = xgb_preprocessor.transform(input_df)

xgb_prediction = xgb_model.predict(xgb_input)

svr_prediction = svr_pipeline.predict(input_df)


# ==========================================
# 8. Stacking Meta Features
# ==========================================

base_predictions = {
    "rf": rf_prediction,
    "xgb": xgb_prediction,
    "svr": svr_prediction
}

meta_features = np.column_stack([
    base_predictions[name]
    for name in config["base_learners"]
])


# ==========================================
# 9. Meta Learner Prediction
# ==========================================

stacking_prediction = meta_learner.predict(
    meta_features
)


# ==========================================
# 10. Inverse Target Transformation
# ==========================================

final_prediction = (
    target_transformer.inverse_transform(
        stacking_prediction.reshape(-1, 1)
    ).ravel()
)


# ==========================================
# 11. Display Prediction Result
# ==========================================

print("\n=== PREDICTION RESULT ===")

print("Vehicle:", input_data["merek"], input_data["model"])
print("Year:", input_data["tahun"])

print(f"Predicted Price: Rp {final_prediction[0]:,.0f}")


# ==========================================
# 12. Cross-Platform Validation
# ==========================================

expected_price = 143234139

difference = abs(
    final_prediction[0] - expected_price
)

is_consistent = np.isclose(
    final_prediction[0],
    expected_price,
    rtol=0,
    atol=1.0
)

print("\n=== CROSS-PLATFORM VALIDATION ===")

print(f"Colab Prediction: Rp {expected_price:,.0f}")
print(f"Windows Prediction: Rp {final_prediction[0]:,.0f}")
print(f"Difference: Rp {difference:.6f}")
print("Prediction Consistency:", is_consistent)