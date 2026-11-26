import React, {useEffect, useState} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
} from '../../../types/navigation.types';

import {colors, spacing, typography} from '../../../theme';

import AppButton from '../../../components/AppButton';

import {
  predictionService,
} from '../../../services/prediction.service';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

type ConnectionStatus =
  | 'loading'
  | 'connected'
  | 'disconnected';

export default function HomeScreen({
  navigation,
}: Props) {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('loading');

  const checkConnection = async () => {
    setConnectionStatus('loading');

    try {
      const response = await predictionService.getHealth();

      setConnectionStatus(
        response.model_loaded
          ? 'connected'
          : 'disconnected',
      );
    } catch {
      setConnectionStatus('disconnected');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const isConnected =
    connectionStatus === 'connected';

  const algorithms = [
    'Random Forest',
    'XGBoost',
    'Support Vector Regression',
    'Linear Regression',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <Text style={styles.appTitle}>
          CarPrice AI
        </Text>

        <View style={styles.statusContainer}>
          {connectionStatus === 'loading' ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />
          ) : (
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isConnected
                    ? colors.success
                    : colors.error,
                },
              ]}
            />
          )}

          <Text
            style={[
              styles.statusText,
              {
                color:
                  connectionStatus === 'loading'
                    ? colors.textSecondary
                    : isConnected
                      ? colors.success
                      : colors.error,
              },
            ]}
            onPress={checkConnection}>
            {connectionStatus === 'loading'
              ? 'Checking connection...'
              : isConnected
                ? 'Backend connected'
                : 'Backend disconnected — retry'}
          </Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>
            AI PREDICTION
          </Text>

          <Text style={styles.heroTitle}>
            Prediksi Harga Mobil Bekas
          </Text>

          <Text style={styles.heroDescription}>
            Estimasi harga kendaraan menggunakan
            Stacking Ensemble Learning.
          </Text>
        </View>

        <View style={styles.actions}>
          <AppButton
            title="Mulai Prediksi"
            onPress={() =>
              navigation.navigate('Prediction')
            }
          />

          <AppButton
            title="Informasi Model AI"
            variant="outline"
            onPress={() =>
              navigation.navigate('ModelInfo')
            }
          />
        </View>

        <View style={styles.modelSection}>
          <Text style={styles.sectionTitle}>
            Teknologi AI
          </Text>

          {algorithms.map(algorithm => (
            <View
              key={algorithm}
              style={styles.algorithmRow}>
              <View style={styles.algorithmDot} />

              <Text style={styles.algorithmText}>
                {algorithm}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Model berdasarkan dataset harga
          penawaran kendaraan tahun 2019.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },

  appTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },

  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.md,
  },

  heroLabel: {
    color: colors.primaryLight,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },

  heroTitle: {
    color: colors.white,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
  },

  heroDescription: {
    color: colors.primaryLight,
    fontSize: typography.fontSize.sm,
    lineHeight: 22,
  },

  actions: {
    gap: spacing.sm,
  },

  modelSection: {
    gap: spacing.md,
    marginTop: spacing.md,
  },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },

  algorithmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  algorithmDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },

  algorithmText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
  },

  footer: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});