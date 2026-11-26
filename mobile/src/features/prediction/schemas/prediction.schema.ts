import {z} from 'zod';

export const predictionSchema = z.object({
  provinsi: z.string().min(1, 'Provinsi wajib dipilih'),

  merek: z.string().min(1, 'Merek wajib dipilih'),

  model: z.string().min(1, 'Model wajib dipilih'),

  varian: z.string(),

  tahun: z.string()
    .min(1, 'Tahun wajib diisi')
    .regex(/^\d{4}$/, 'Tahun harus terdiri dari 4 digit')
    .refine(
      value =>
        Number(value) >= 1900 &&
        Number(value) <= 2100,
      'Tahun kendaraan tidak valid',
    ),

  jarak_tempuh: z.string()
    .min(1, 'Jarak tempuh wajib diisi')
    .regex(/^\d+$/, 'Jarak tempuh harus berupa angka')
    .refine(
      value =>
        Number.isFinite(Number(value)) &&
        Number(value) >= 0,
      'Jarak tempuh tidak valid',
    ),

  tipe_bahan_bakar: z.string(),
  warna: z.string(),
  transmisi: z.string(),
  tipe_bodi: z.string(),
  kapasitas_mesin: z.string(),
  tipe_penjual: z.string(),
  sistem_penggerak: z.string(),
});

export type PredictionFormValues =
  z.infer<typeof predictionSchema>;

export const predictionDefaultValues: PredictionFormValues = {
  provinsi: '',
  merek: '',
  model: '',
  varian: '',
  tahun: '',
  jarak_tempuh: '',
  tipe_bahan_bakar: '',
  warna: '',
  transmisi: '',
  tipe_bodi: '',
  kapasitas_mesin: '',
  tipe_penjual: '',
  sistem_penggerak: '',
};