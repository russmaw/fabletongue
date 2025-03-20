import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Switch } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import Text from '../../../components/Text';
import { useBedtimeStore } from '../store';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ParentControls as ParentControlsType } from '../types';

interface ParentControlsProps {
  onClose: () => void;
}

export const ParentControls: React.FC<ParentControlsProps> = ({ onClose }) => {
  const theme = useTheme<Theme>();
  const { parentControls, updateParentControls } = useBedtimeStore();
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [pin, setPin] = useState(parentControls.pinCode || '');

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    isStartTime: boolean
  ) => {
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;

      if (isStartTime) {
        updateParentControls({
          allowedTimeRange: {
            ...parentControls.allowedTimeRange,
            start: timeString,
          },
        });
        setShowStartTime(false);
      } else {
        updateParentControls({
          allowedTimeRange: {
            ...parentControls.allowedTimeRange,
            end: timeString,
          },
        });
        setShowEndTime(false);
      }
    }
  };

  const handleMaxDurationChange = (value: string) => {
    const duration = parseInt(value);
    if (!isNaN(duration) && duration > 0) {
      updateParentControls({ maxDuration: duration });
    }
  };

  const handlePinChange = (value: string) => {
    setPin(value);
    if (value.length === 4) {
      updateParentControls({ pinCode: value });
    }
  };

  const toggleParentUnlock = () => {
    updateParentControls({
      requireParentUnlock: !parentControls.requireParentUnlock,
    });
  };

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.m,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadii.m,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    section: {
      marginBottom: theme.spacing.m,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.s,
    },
    label: {
      fontSize: 16,
      color: theme.colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadii.s,
      padding: theme.spacing.s,
      width: 80,
      textAlign: 'center',
    },
    pinInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadii.s,
      padding: theme.spacing.s,
      width: 120,
      textAlign: 'center',
    },
    timeButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.s,
      borderRadius: theme.borderRadii.s,
    },
    timeButtonText: {
      color: theme.colors.white,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parent Controls</Text>
        <TouchableOpacity onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Require Parent Unlock</Text>
          <Switch
            value={parentControls.requireParentUnlock}
            onValueChange={toggleParentUnlock}
          />
        </View>
        {parentControls.requireParentUnlock && (
          <View style={styles.row}>
            <Text style={styles.label}>PIN Code</Text>
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={handlePinChange}
              placeholder="Enter 4-digit PIN"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Max Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={parentControls.maxDuration.toString()}
            onChangeText={handleMaxDurationChange}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Allowed Time Range</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowStartTime(true)}
          >
            <Text style={styles.timeButtonText}>
              Start: {parentControls.allowedTimeRange.start}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowEndTime(true)}
          >
            <Text style={styles.timeButtonText}>
              End: {parentControls.allowedTimeRange.end}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showStartTime && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, date) => handleTimeChange(event, date, true)}
        />
      )}

      {showEndTime && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, date) => handleTimeChange(event, date, false)}
        />
      )}
    </View>
  );
}; 