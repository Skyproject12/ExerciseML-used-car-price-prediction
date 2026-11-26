import React from 'react';

import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import AppButton from '../../../components/AppButton';

import {
  colors,
  spacing,
  typography,
} from '../../../theme';

import {useModelInfo} from '../hooks/useModelInfo';

export default function ModelInfoScreen() {
  const {
    metrics,
    loading,
    error,
    loadModelInfo,
  } = useModelInfo();

  const formatMillion = (value: number) => {
    return `Rp${(value / 1000000).toLocaleString(
      'id-ID',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )} juta`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.description}>
          Memuat informasi model AI...
        </Text>
      </View>
    );
  }

  if (error || !metrics) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error || 'Informasi model tidak tersedia'}
        </Text>

        <AppButton
          title="Coba Lagi"
          onPress={loadModelInfo}
        />
      </View>
    );
  }

  const evaluationMetrics = [
    {
      name: 'MAE',
      value: formatMillion(metrics.mae),
      description: 'Mean Absolute Error',
    },
    {
      name: 'RMSE',
      value: formatMillion(metrics.rmse),
      description: 'Root Mean Squared Error',
    },
    {
      name: 'MAPE',
      value: `${metrics.mape.toFixed(2)}%`,
      description: 'Mean Absolute Percentage Error',
    },
    {
      name: 'Features',
      value: '13',
      description: 'Vehicle Input Features',
    },
  ];

  const datasetDetails = [
    ['Dataset', 'OLX Indonesia'],
    ['Data Period', '2019'],
    ['Total Prepared Data', '14.620'],
    ['Training Data', '11.701'],
    ['Testing Data', '2.919'],
    ['Data Splitting', '80:20'],
    ['Cross Validation', '5-Fold GroupKFold'],
    ['Learning Type', 'Supervised Learning'],
    ['Task', 'Regression'],
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      <Text style={styles.title}>
        Stacking Ensemble Learning
      </Text>

      <Text style={styles.description}>
        Model prediksi harga mobil bekas
        menggunakan kombinasi beberapa algoritma
        Machine Learning.
      </Text>

      {/* R2 Score */}

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>
          R² SCORE
        </Text>

        <Text style={styles.heroValue}>
          {metrics.r2.toFixed(4)}
        </Text>

        <Text style={styles.heroDescription}>
          Coefficient of Determination
        </Text>
      </View>

      {/* Evaluation Metrics */}

      <Text style={styles.sectionTitle}>
        Model Evaluation
      </Text>

      <View style={styles.metricGrid}>
        {evaluationMetrics.map(metric => (
          <View
            key={metric.name}
            style={styles.metricCard}>

            <Text style={styles.metricLabel}>
              {metric.name}
            </Text>

            <Text style={styles.metricValue}>
              {metric.value}
            </Text>

            <Text style={styles.metricDescription}>
              {metric.description}
            </Text>

          </View>
        ))}
      </View>

      {/* Model Architecture */}

      <Text style={styles.sectionTitle}>
        Model Architecture
      </Text>

      <View style={styles.architectureCard}>

        <Text style={styles.layerLabel}>
          INPUT LAYER
        </Text>

        <View style={styles.architectureNode}>
          <Text style={styles.nodeText}>
            13 Vehicle Features
          </Text>
        </View>

        <Text style={styles.arrow}>↓</Text>

        <Text style={styles.layerLabel}>
          LEVEL 0 — BASE LEARNERS
        </Text>

        <View style={styles.baseLearners}>
          {['Random Forest', 'XGBoost', 'SVR'].map(
            algorithm => (
              <View
                key={algorithm}
                style={styles.baseLearner}>
                <Text style={styles.nodeText}>
                  {algorithm}
                </Text>
              </View>
            ),
          )}
        </View>

        <Text style={styles.arrow}>↓</Text>

        <View style={styles.architectureNode}>
          <Text style={styles.nodeText}>
            Stacked Predictions
          </Text>
        </View>

        <Text style={styles.arrow}>↓</Text>

        <Text style={styles.layerLabel}>
          LEVEL 1 — META LEARNER
        </Text>

        <View style={styles.metaLearner}>
          <Text style={styles.metaText}>
            Linear Regression
          </Text>
        </View>

        <Text style={styles.arrow}>↓</Text>

        <View style={styles.architectureNode}>
          <Text style={styles.nodeText}>
            Inverse Transformation (expm1)
          </Text>
        </View>

        <Text style={styles.arrow}>↓</Text>

        <View style={styles.outputNode}>
          <Text style={styles.metaText}>
            Predicted Car Price
          </Text>
        </View>

      </View>

      {/* Dataset Information */}

      <Text style={styles.sectionTitle}>
        Dataset Information
      </Text>

      <View style={styles.detailCard}>
        {datasetDetails.map(([label, value]) => (
          <View
            key={label}
            style={styles.detailRow}>

            <Text style={styles.detailLabel}>
              {label}
            </Text>

            <Text style={styles.detailValue}>
              {value}
            </Text>

          </View>
        ))}
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Model dikembangkan berdasarkan dataset
          harga penawaran mobil bekas tahun 2019.
          Hasil prediksi bukan representasi harga
          pasar kendaraan terkini.
        </Text>
      </View>

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
  },

  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },

  heroLabel: {
    color: colors.primaryLight,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },

  heroValue: {
    color: colors.white,
    fontSize: 48,
    fontWeight: typography.fontWeight.bold,
  },

  heroDescription: {
    color: colors.primaryLight,
    fontSize: typography.fontSize.sm,
  },

  sectionTitle: {
    marginTop: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },

  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  metricCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },

  metricLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },

  metricValue: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },

  metricDescription: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
  },

  architectureCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },

  layerLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },

  architectureNode: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    width: '100%',
  },

  nodeText: {
    color: colors.primaryDark,
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },

  arrow: {
    color: colors.textSecondary,
    fontSize: 24,
  },

  baseLearners: {
    flexDirection: 'row',
    gap: spacing.xs,
    width: '100%',
  },

  baseLearner: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: spacing.sm,
    justifyContent: 'center',
  },

  metaLearner: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },

  metaText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },

  outputNode: {
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },

  detailCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  detailLabel: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },

  detailValue: {
    flex: 1,
    color: colors.textPrimary,
    textAlign: 'right',
    fontWeight: typography.fontWeight.medium,
  },

  notice: {
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: 12,
  },

  noticeText: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xs,
    lineHeight: 20,
  },
});