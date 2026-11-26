import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {predictionService} from
  '../../../services/prediction.service';

import type {ModelMetrics} from
  '../../../types/prediction.types';

export function useModelInfo() {
  const [metrics, setMetrics] =
    useState<ModelMetrics | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadModelInfo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response =
        await predictionService.getModelMetrics();

      const validMetrics = [
        response.mae,
        response.rmse,
        response.mape,
        response.r2,
      ].every(value => Number.isFinite(value));

      if (!validMetrics) {
        throw new Error('Invalid model metrics');
      }

      setMetrics(response);

    } catch (err) {
      console.error('Model information error:', err);

      setMetrics(null);

      setError(
        'Gagal mengambil informasi model AI.',
      );

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModelInfo();
  }, [loadModelInfo]);

  return {
    metrics,
    loading,
    error,
    loadModelInfo,
  };
}