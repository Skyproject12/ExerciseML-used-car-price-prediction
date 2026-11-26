import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {
  Controller,
  useForm,
} from 'react-hook-form';

import {zodResolver} from '@hookform/resolvers/zod';

import AppInput from '../../../components/AppInput';
import AppDropdown from '../../../components/AppDropdown';
import AppButton from '../../../components/AppButton';

import {colors, spacing, typography} from '../../../theme';

import type {
  FeatureOptions,
  VehicleMapping,
} from '../../../types/prediction.types';

import {
  predictionSchema,
  predictionDefaultValues,
} from '../schemas/prediction.schema';

import type {
  PredictionFormValues,
} from '../schemas/prediction.schema';

interface Props {
  features: FeatureOptions;
  vehicles: VehicleMapping;
  predicting: boolean;
  onSubmit: (
    values: PredictionFormValues,
  ) => Promise<void>;
}

export default function PredictionForm({
  features,
  vehicles,
  predicting,
  onSubmit,
}: Props) {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
  } = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionSchema),
    defaultValues: predictionDefaultValues,
  });

  const selectedBrand = watch('merek');
  const selectedModel = watch('model');

  const brandOptions = Object.keys(vehicles).sort();

  const modelOptions = Object.keys(
    vehicles[selectedBrand] ?? {},
  ).sort();

  const variantOptions =
    vehicles[selectedBrand]?.[selectedModel] ?? [];

  const renderDropdown = (
    name: keyof PredictionFormValues,
    label: string,
    options: string[],
    required = false,
    disabled = false,
  ) => (
    <Controller
      key={name}
      control={control}
      name={name}
      render={({field, fieldState}) => (
        <AppDropdown
          label={label}
          value={field.value}
          options={options}
          required={required}
          disabled={disabled || predicting}
          error={fieldState.error?.message}
          onChange={value => {
            if (value === field.value) {
              return;
            }

            field.onChange(value);

            if (name === 'merek') {
              setValue('model', '');
              setValue('varian', '');
            }

            if (name === 'model') {
              setValue('varian', '');
            }
          }}
        />
      )}
    />
  );

  const renderNumericInput = (
    name: 'tahun' | 'jarak_tempuh',
    label: string,
    placeholder: string,
  ) => (
    <Controller
      key={name}
      control={control}
      name={name}
      render={({field, fieldState}) => (
        <AppInput
          label={label}
          required
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          keyboardType="number-pad"
          placeholder={placeholder}
          editable={!predicting}
          error={fieldState.error?.message}
        />
      )}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Informasi Kendaraan
      </Text>

      {renderDropdown(
        'provinsi',
        'Provinsi',
        features.provinsi ?? [],
        true,
      )}

      {renderDropdown(
        'merek',
        'Merek',
        brandOptions,
        true,
      )}

      {renderDropdown(
        'model',
        'Model',
        modelOptions,
        true,
        !selectedBrand,
      )}

      {renderDropdown(
        'varian',
        'Varian',
        variantOptions,
        false,
        !selectedModel || variantOptions.length === 0,
      )}

      {renderNumericInput(
        'tahun',
        'Tahun Produksi',
        'Contoh: 2018',
      )}

      {renderNumericInput(
        'jarak_tempuh',
        'Jarak Tempuh (km)',
        'Contoh: 87500',
      )}

      <Text style={styles.sectionTitle}>
        Spesifikasi Kendaraan
      </Text>

      {renderDropdown(
        'tipe_bahan_bakar',
        'Tipe Bahan Bakar',
        features.tipe_bahan_bakar ?? [],
      )}

      {renderDropdown(
        'warna',
        'Warna',
        features.warna ?? [],
      )}

      {renderDropdown(
        'transmisi',
        'Transmisi',
        features.transmisi ?? [],
      )}

      {renderDropdown(
        'tipe_bodi',
        'Tipe Bodi',
        features.tipe_bodi ?? [],
      )}

      {renderDropdown(
        'kapasitas_mesin',
        'Kapasitas Mesin',
        features.kapasitas_mesin ?? [],
      )}

      {renderDropdown(
        'tipe_penjual',
        'Tipe Penjual',
        features.tipe_penjual ?? [],
      )}

      {renderDropdown(
        'sistem_penggerak',
        'Sistem Penggerak',
        features.sistem_penggerak ?? [],
      )}

      <Text style={styles.note}>
        * Wajib diisi. Lengkapi informasi kendaraan
        sebanyak mungkin.
      </Text>

      <AppButton
        title="Prediksi Harga"
        loading={predicting}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.sm,
  },
  note: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
  },
});