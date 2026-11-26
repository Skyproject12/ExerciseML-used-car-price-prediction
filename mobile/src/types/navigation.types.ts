import type {
  PredictionRequest,
  PredictionResponse,
} from './prediction.types';

export type RootStackParamList = {
  Home: undefined;

  Prediction: undefined;

  PredictionResult: {
    vehicle: PredictionRequest;
    result: PredictionResponse;
  };

  ModelInfo: undefined;
};