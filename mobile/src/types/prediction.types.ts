export interface PredictionRequest {
  provinsi: string;
  merek: string;
  model: string;
  varian: string | null;
  tahun: number;
  jarak_tempuh: number;
  tipe_bahan_bakar: string | null;
  warna: string | null;
  transmisi: string | null;
  tipe_bodi: string | null;
  kapasitas_mesin: string | null;
  tipe_penjual: string | null;
  sistem_penggerak: string | null;
}

export interface PredictionResponse {
  status: string;
  message: string;
  predicted_price: number;
  currency: string;
  model_name: string;
}

export interface HealthResponse {
  status: string;
  message: string;
  model_loaded: boolean;
}

export interface FeatureOptions {
  provinsi: string[];
  merek: string[];
  model: string[];
  varian: string[];
  tipe_bahan_bakar: string[];
  warna: string[];
  transmisi: string[];
  tipe_bodi: string[];
  kapasitas_mesin: string[];
  tipe_penjual: string[];
  sistem_penggerak: string[];
}

export type VehicleMapping = Record<
  string,
  Record<string, string[]>
>;

export interface ModelMetrics {
  mae: number;
  rmse: number;
  mape: number;
  r2: number;
}