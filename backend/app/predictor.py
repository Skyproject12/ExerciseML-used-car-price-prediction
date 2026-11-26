import json
import joblib
import numpy as np
import pandas as pd

from pathlib import Path
from xgboost import XGBRegressor


class CarPricePredictor:

    def __init__(self):

        # Artifact directory
        self.artifact_dir = (
            Path(__file__).resolve().parent.parent
            / "artifacts"
        )

        # Load configuration
        with open(
            self.artifact_dir / "stacking_config.json",
            encoding="utf-8"
        ) as file:
            self.config = json.load(file)

        # Load Random Forest
        self.rf_pipeline = joblib.load(
            self.artifact_dir / "random_forest.pkl"
        )

        # Load SVR
        self.svr_pipeline = joblib.load(
            self.artifact_dir / "svr.pkl"
        )

        # Load XGBoost preprocessor
        self.xgb_preprocessor = joblib.load(
            self.artifact_dir / "xgboost_preprocessor.pkl"
        )

        # Load XGBoost model
        self.xgb_model = XGBRegressor()

        self.xgb_model.load_model(
            self.artifact_dir / "xgboost.json"
        )

        # Load meta learner
        self.meta_learner = joblib.load(
            self.artifact_dir / "meta_learner.pkl"
        )

        # Load target transformer
        self.target_transformer = joblib.load(
            self.artifact_dir / "target_transformer.pkl"
        )

        print("All model components loaded successfully!")


    def predict(self, input_data: dict) -> float:

        # Convert input to DataFrame
        input_df = pd.DataFrame(
            [input_data],
            columns=self.config["features"]
        )

        # Convert null values to NaN
        input_df = input_df.replace({None: np.nan})

        # Random Forest prediction
        rf_prediction = self.rf_pipeline.predict(
            input_df
        )

        # XGBoost preprocessing
        xgb_input = self.xgb_preprocessor.transform(
            input_df
        )

        # XGBoost prediction
        xgb_prediction = self.xgb_model.predict(
            xgb_input
        )

        # SVR prediction
        svr_prediction = self.svr_pipeline.predict(
            input_df
        )

        # Combine base learner predictions
        base_predictions = {
            "rf": rf_prediction,
            "xgb": xgb_prediction,
            "svr": svr_prediction
        }

        meta_features = np.column_stack([
            base_predictions[name]
            for name in self.config["base_learners"]
        ])

        # Meta learner prediction
        stacking_prediction = self.meta_learner.predict(
            meta_features
        )

        # Inverse target transformation
        final_prediction = (
            self.target_transformer.inverse_transform(
                stacking_prediction.reshape(-1, 1)
            ).ravel()
        )

        predicted_price = float(final_prediction[0])

        if not np.isfinite(predicted_price):
            raise ValueError("Prediction is not finite")

        return predicted_price