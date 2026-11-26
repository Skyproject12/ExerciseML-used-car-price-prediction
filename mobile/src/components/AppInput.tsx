import React from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

import type {TextInputProps} from 'react-native';

import {colors, spacing, typography} from '../theme';

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export default function AppInput({
  label,
  error,
  required = false,
  ...props
}: AppInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && (
          <Text style={styles.required}> *</Text>
        )}
      </Text>

      <TextInput
        {...props}
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          error && styles.inputError,
          props.style,
        ]}
      />

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  required: {
    color: colors.error,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
  },
});