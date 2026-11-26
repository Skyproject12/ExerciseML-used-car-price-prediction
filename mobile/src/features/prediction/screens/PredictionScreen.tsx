import React from 'react';

import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
} from '../../../types/navigation.types';

import AppButton from '../../../components/AppButton';
import PredictionForm from '../components/PredictionForm';
import {usePrediction} from '../hooks/usePrediction';

import type {
  PredictionFormValues,
} from '../schemas/prediction.schema';

import {colors, spacing, typography} from '../../../theme';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Prediction'
>;

export default function PredictionScreen({
  navigation,
}: Props) {
  const {
    features,
    vehicles,
    loading,
    predicting,
    error,
    loadOptions,
    submitPrediction,
  } = usePrediction();

  const handlePrediction = async (
    values: PredictionFormValues,
  ) => {
    const response =
      await submitPrediction(values);

    if (response) {
      navigation.navigate(
        'PredictionResult',
        response,
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.description}>
          Memuat informasi kendaraan...
        </Text>
      </View>
    );
  }

  if (!features) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error || 'Data kendaraan tidak tersedia'}
        </Text>

        <AppButton
          title="Coba Lagi"
          onPress={loadOptions}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">

      <Text style={styles.title}>
        Prediksi Harga Mobil
      </Text>

      <Text style={styles.description}>
        Lengkapi informasi kendaraan untuk mendapatkan
        estimasi harga menggunakan Machine Learning.
      </Text>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <PredictionForm
        features={features}
        vehicles={vehicles}
        predicting={predicting}
        onSubmit={handlePrediction}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: 22,
  },
  error: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
  },
});