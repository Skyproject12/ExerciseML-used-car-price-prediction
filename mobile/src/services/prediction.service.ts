import api from './api';

import type {
  HealthResponse,
  PredictionRequest,
  PredictionResponse,
} from '../types/prediction.types';

export const predictionService = {
  getHealth: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>('/health');

    return response.data;
  },

  predict: async (
    payload: PredictionRequest,
  ): Promise<PredictionResponse> => {
    const response = await api.post<PredictionResponse>(
      '/predict',
      payload,
    );

    return response.data;
  },
};