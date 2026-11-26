import api from './api';

import type {
  HealthResponse,
  PredictionRequest,
  PredictionResponse,
  FeatureOptions,
  VehicleMapping,
  ModelMetrics,
} from '../types/prediction.types';

export const predictionService = {
  getHealth: async (): Promise<HealthResponse> => {
    const response =
      await api.get<HealthResponse>('/health');

    return response.data;
  },

  getFeatureOptions: async (): Promise<FeatureOptions> => {
    const response =
      await api.get<FeatureOptions>('/features');

    return response.data;
  },

  getVehicleMapping: async (): Promise<VehicleMapping> => {
    const response =
      await api.get<VehicleMapping>('/vehicles');

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

  getModelMetrics: async (): Promise<ModelMetrics> => {
    const response =
      await api.get<ModelMetrics>('/model/metrics');

    return response.data;
  },

  getModelInfo: async (): Promise<Record<string, unknown>> => {
    const response = await api.get('/model/info');

    return response.data;
  },
};