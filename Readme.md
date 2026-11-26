# Used Car Price Prediction Using Stacking Ensemble Learning

## 1. Project Overview

This project implements a machine learning-based used car price prediction system using Stacking Ensemble Learning, integrated with an Android mobile application through a REST API.

The system estimates used car prices based on 13 vehicle features, including vehicle brand, model, variant, production year, mileage, and other vehicle characteristics.

## 2. Technology Stack

| Component | Technology |
|---|---|
| Programming Language | Python, TypeScript |
| Machine Learning | Scikit-learn, XGBoost |
| Data Processing | Pandas, NumPy |
| Model Serialization | Joblib, XGBoost JSON |
| Backend | FastAPI |
| API Server | Uvicorn |
| Mobile Application | React Native |
| Form Management | React Hook Form |
| Form Validation | Zod |
| API Integration | Axios |
| Automated Testing | Pytest |
| Model Development | Google Colab |
| Development Environment | Visual Studio Code, Android Studio |

## 3. Dataset

The dataset is obtained from the OLX Indonesia used car dataset available on Kaggle.

- Data period: 2019
- Original records: 14,657
- Prepared records: 14,620
- Input features: 13
- Target variable: Car Price
- Training data: 11,701 records
- Testing data: 2,919 records
- Cross-validation: 5-Fold GroupKFold

Dataset source:
https://www.kaggle.com/datasets/fadhrigabestari/olxmobilbekas

## 4. AI Development Pipeline

1. Data Acquisition
2. Exploratory Data Analysis
3. Data Preparation
4. Data Splitting
5. Model Development
6. Model Evaluation
7. Model Serialization
8. Model Deployment
9. Android Integration
10. System Testing and Validation

## 5. Machine Learning Architecture

The prediction model uses Stacking Ensemble Learning with three base learners and one meta-learner.

### Base Learners

- Random Forest Regressor
- XGBoost Regressor
- Support Vector Regression (SVR)

### Meta-Learner

- Linear Regression

Out-of-fold predictions are used to train the meta-learner. The target variable is transformed using log1p during training, and the final prediction is converted back to its original scale using expm1.

## 6. Model Evaluation

| Model | MAE (IDR Million) | RMSE (IDR Million) | MAPE (%) | R² |
|---|---:|---:|---:|---:|
| Linear Regression | 56.77 | 320.21 | 19.48 | 0.7026 |
| Random Forest | 65.84 | 296.60 | 21.99 | 0.7449 |
| XGBoost | 67.32 | 330.07 | 22.65 | 0.6840 |
| SVR | 51.81 | 257.82 | 17.97 | 0.8072 |
| Stacking Ensemble | 52.62 | 250.67 | 17.90 | 0.8178 |

Stacking Ensemble Learning achieves the highest R² and the lowest RMSE and MAPE among the evaluated models. SVR achieves the lowest MAE.

## 7. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | / | API root |
| GET | /health | Backend health check |
| GET | /features | Vehicle feature options |
| GET | /vehicles | Vehicle mapping |
| GET | /model/info | Model metadata |
| GET | /model/metrics | Model evaluation metrics |
| POST | /predict | Used car price prediction |

## 8. Mobile Application Features

- Backend connectivity status
- Vehicle prediction form
- Dynamic searchable dropdown
- Cascading vehicle dropdown
- Input validation
- Real-time prediction through REST API
- Prediction result screen
- Vehicle detail information
- Model architecture and evaluation information
- Loading and error handling

## 9. Running the Backend

Navigate to the backend directory:

    cd backend

Create and activate the Python virtual environment if necessary:

    python -m venv .venv
    .\.venv\Scripts\activate

Install dependencies:

    python -m pip install -r requirements.txt

Run the FastAPI server:

    python -m uvicorn app.main:app

Swagger API documentation:

http://127.0.0.1:8000/docs

## 10. Running the Android Application

Navigate to the mobile directory:

    cd mobile

Install dependencies:

    npm ci

Start Metro Bundler:

    npm start

Run the Android application from another terminal:

    npm run android

The Android emulator connects to the backend using:

    http://10.0.2.2:8000

## 11. System Testing

The system testing process includes:

- API integration testing
- Request validation testing
- Prediction consistency testing
- Inference performance benchmarking
- Cross-platform prediction validation
- Android functional testing
- End-to-end system testing

Run automated backend testing:

    python -m pytest tests/ -v -s

## 12. Limitations

The model is trained using historical used car listing prices from 2019. Therefore, its predictions do not necessarily represent current vehicle market prices.

The system also requires an active backend connection because machine learning inference is performed on the server.

## 13. Future Development

- Integration with more recent vehicle market data
- Automated model retraining
- Cloud-based backend deployment
- Prediction history
- Model performance monitoring
- Continuous integration and deployment