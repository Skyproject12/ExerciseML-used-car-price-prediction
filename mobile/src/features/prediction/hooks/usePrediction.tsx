import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {predictionService} from
  '../../../services/prediction.service';

import type {
  FeatureOptions,
  VehicleMapping,
  PredictionRequest,
} from '../../../types/prediction.types';

import type {
  PredictionFormValues,
} from '../schemas/prediction.schema';

export function usePrediction() {
  const [features, setFeatures] =
    useState<FeatureOptions | null>(null);

  const [vehicles, setVehicles] =
    useState<VehicleMapping>({});

  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadOptions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [featureResponse, vehicleResponse] =
        await Promise.all([
          predictionService.getFeatureOptions(),
          predictionService.getVehicleMapping(),
        ]);

      setFeatures(featureResponse);
      setVehicles(vehicleResponse);

    } catch (err) {
      console.error('Load options error:', err);

      setError(
        'Gagal mengambil data kendaraan. ' +
        'Pastikan backend sedang berjalan.',
      );

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const submitPrediction = async (
    values: PredictionFormValues,
  ) => {
    setPredicting(true);
    setError(null);

    const payload: PredictionRequest = {
      provinsi: values.provinsi,
      merek: values.merek,
      model: values.model,
      varian: values.varian || null,
      tahun: Number(values.tahun),
      jarak_tempuh: Number(values.jarak_tempuh),
      tipe_bahan_bakar: values.tipe_bahan_bakar || null,
      warna: values.warna || null,
      transmisi: values.transmisi || null,
      tipe_bodi: values.tipe_bodi || null,
      kapasitas_mesin: values.kapasitas_mesin || null,
      tipe_penjual: values.tipe_penjual || null,
      sistem_penggerak: values.sistem_penggerak || null,
    };

    try {
      const result =
        await predictionService.predict(payload);

      return {
        vehicle: payload,
        result,
      };

    } catch (err) {
      console.error('Prediction error:', err);

      setError(
        'Prediksi gagal. Periksa koneksi dan data kendaraan.',
      );

      return null;

    } finally {
      setPredicting(false);
    }
  };

  return {
    features,
    vehicles,
    loading,
    predicting,
    error,
    loadOptions,
    submitPrediction,
  };
}