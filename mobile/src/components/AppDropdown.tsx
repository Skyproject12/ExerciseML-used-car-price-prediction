import React, {useState} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';

import {colors, spacing, typography} from '../theme';

interface AppDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function AppDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = 'Pilih opsi',
  error,
  required = false,
  disabled = false,
}: AppDropdownProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase()),
  );

  const closeModal = () => {
    setVisible(false);
    setSearch('');
  };

  const selectOption = (option: string) => {
    onChange(option);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && (
          <Text style={styles.required}> *</Text>
        )}
      </Text>

      <TouchableOpacity
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={[
          styles.dropdown,
          disabled && styles.disabled,
          error && styles.inputError,
        ]}>
        <Text
          numberOfLines={1}
          style={[
            styles.value,
            !value && styles.placeholder,
          ]}>
          {value || placeholder}
        </Text>

        <Text style={styles.arrow}>⌄</Text>
      </TouchableOpacity>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>
                Pilih {label}
              </Text>

              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.arrow}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Cari..."
              placeholderTextColor={colors.textSecondary}
              style={styles.searchInput}
            />

            {!required && (
              <TouchableOpacity
                style={styles.option}
                onPress={() => selectOption('')}>
                <Text style={styles.placeholder}>
                  Tidak diketahui
                </Text>
              </TouchableOpacity>
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item, index) =>
                `${item}-${index}`
              }
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.empty}>
                  Data tidak ditemukan
                </Text>
              }
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    value === item && styles.selected,
                  ]}
                  onPress={() => selectOption(item)}>
                  <Text style={styles.optionText}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  dropdown: {
    minHeight: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  value: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
  },
  placeholder: {
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: 22,
    color: colors.textSecondary,
  },
  disabled: {
    opacity: 0.5,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modal: {
    height: '65%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  searchInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
  },
  option: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
  },
  selected: {
    backgroundColor: colors.primaryLight,
  },
  empty: {
    textAlign: 'center',
    padding: spacing.lg,
    color: colors.textSecondary,
  },
});