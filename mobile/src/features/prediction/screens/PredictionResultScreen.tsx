import React from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
} from '../../../types/navigation.types';

import AppButton from '../../../components/AppButton';

import {colors, spacing, typography} from '../../../theme';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'PredictionResult'
>;

export default function PredictionResultScreen({
  route,
  navigation,
}: Props) {
  const {vehicle, result} = route.params;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(result.predicted_price);

  const details: [string, string | null][] = [
    ['Provinsi', vehicle.provinsi],
    ['Merek', vehicle.merek],
    ['Model', vehicle.model],
    ['Varian', vehicle.varian],
    ['Tahun', String(vehicle.tahun)],
    [
      'Jarak Tempuh',
      `${vehicle.jarak_tempuh.toLocaleString('id-ID')} km`,
    ],
    ['Bahan Bakar', vehicle.tipe_bahan_bakar],
    ['Warna', vehicle.warna],
    ['Transmisi', vehicle.transmisi],
    ['Tipe Bodi', vehicle.tipe_bodi],
    ['Kapasitas Mesin', vehicle.kapasitas_mesin],
    ['Tipe Penjual', vehicle.tipe_penjual],
    ['Sistem Penggerak', vehicle.sistem_penggerak],
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}>

      <View style={styles.hero}>
        <Text style={styles.label}>
          Estimasi Harga Mobil Bekas
        </Text>

        <Text style={styles.price}>
          {formattedPrice}
        </Text>

        <Text style={styles.label}>
          {result.model_name}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Detail Kendaraan
      </Text>

      <View style={styles.detailCard}>
        {details.map(([label, value]) => (
          <View key={label} style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {label}
            </Text>

            <Text style={styles.detailValue}>
              {value || 'Tidak diketahui'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Hasil prediksi merupakan estimasi berdasarkan
          dataset harga penawaran kendaraan tahun 2019,
          bukan harga pasar terkini.
        </Text>
      </View>

      <AppButton
        title="Prediksi Ulang"
        onPress={() => navigation.goBack()}
      />

      <AppButton
        title="Kembali ke Home"
        variant="outline"
        onPress={() => navigation.popToTop()}
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
  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  label: {
    color: colors.primaryLight,
    fontSize: typography.fontSize.sm,
  },
  price: {
    color: colors.white,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    gap: spacing.md,
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