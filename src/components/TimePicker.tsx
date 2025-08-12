import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/AppleDesignSystem';

const { width } = Dimensions.get('window');

interface TimePickerProps {
  value: string; // Format: "HH:MM"
  onTimeChange: (time: string) => void;
  placeholder?: string;
  style?: any;
}

const TimePicker: React.FC<TimePickerProps> = ({ 
  value, 
  onTimeChange, 
  placeholder = "Select time",
  style 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(value ? parseInt(value.split(':')[0]) : 9);
  const [selectedMinute, setSelectedMinute] = useState(value ? parseInt(value.split(':')[1]) : 0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const formatTime = (hour: number, minute: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${ampm}`;
  };

  const formatTimeValue = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    const timeValue = formatTimeValue(selectedHour, selectedMinute);
    onTimeChange(timeValue);
    setModalVisible(false);
  };

  const handleCancel = () => {
    if (value) {
      const [hour, minute] = value.split(':').map(Number);
      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.timePickerButton, style]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.timePickerContent}>
          <Ionicons name="time-outline" size={20} color={colors.secondaryLabel} />
          <Text style={styles.timePickerText}>
            {value ? formatTime(parseInt(value.split(':')[0]), parseInt(value.split(':')[1])) : placeholder}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.secondaryLabel} />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time</Text>
              <TouchableOpacity onPress={handleCancel}>
                <Ionicons name="close" size={24} color={colors.secondaryLabel} />
              </TouchableOpacity>
            </View>

            <View style={styles.timeContainer}>
              {/* Hour Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hour</Text>
                <ScrollView 
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={44}
                >
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.pickerOption,
                        selectedHour === hour && styles.pickerOptionActive
                      ]}
                      onPress={() => setSelectedHour(hour)}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        selectedHour === hour && styles.pickerOptionTextActive
                      ]}>
                        {hour % 12 || 12}
                      </Text>
                      <Text style={[
                        styles.pickerOptionAMPM,
                        selectedHour === hour && styles.pickerOptionTextActive
                      ]}>
                        {hour >= 12 ? 'PM' : 'AM'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.timeSeparator}>:</Text>

              {/* Minute Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minute</Text>
                <ScrollView 
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={44}
                >
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.pickerOption,
                        selectedMinute === minute && styles.pickerOptionActive
                      ]}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        selectedMinute === minute && styles.pickerOptionTextActive
                      ]}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  timePickerButton: {
    backgroundColor: colors.systemBackground,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    borderColor: colors.separator,
    paddingVertical: spacing.buttonPadding,
    paddingHorizontal: spacing.componentPadding,
    minHeight: 48,
    ...shadows.small,
  },
  timePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timePickerText: {
    ...typography.subheadline,
    color: colors.label,
    flex: 1,
    marginLeft: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.systemBackground,
    borderTopLeftRadius: borderRadius.modal,
    borderTopRightRadius: borderRadius.modal,
    paddingBottom: spacing.md,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.componentPadding,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  modalTitle: {
    ...typography.title3,
    color: colors.label,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.componentPadding,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    ...typography.subheadline,
    color: colors.secondaryLabel,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  pickerScroll: {
    height: 200,
    width: '100%',
  },
  pickerOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  pickerOptionActive: {
    backgroundColor: colors.systemBlue,
    borderRadius: borderRadius.medium,
  },
  pickerOptionText: {
    ...typography.title3,
    color: colors.label,
    fontWeight: '600',
  },
  pickerOptionTextActive: {
    color: colors.systemBackground,
  },
  pickerOptionAMPM: {
    ...typography.caption1,
    color: colors.secondaryLabel,
    marginTop: 2,
  },
  timeSeparator: {
    ...typography.largeTitle,
    color: colors.label,
    marginHorizontal: spacing.lg,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: spacing.componentPadding,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.separator,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.buttonPadding,
    marginRight: spacing.sm,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.separator,
    alignItems: 'center',
    backgroundColor: colors.systemBackground,
  },
  cancelButtonText: {
    color: colors.secondaryLabel,
    ...typography.headline,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.buttonPadding,
    marginLeft: spacing.sm,
    borderRadius: borderRadius.button,
    backgroundColor: colors.systemBlue,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.systemBackground,
    ...typography.headline,
    fontWeight: '600',
  },
});

export default TimePicker;
