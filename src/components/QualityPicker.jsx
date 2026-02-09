import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { QUALITY_PRESETS, SPEED_PRESETS } from '../constants/index';

export function QualityPicker({ morphSettings, setMorphSettings }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Quality</Text>
        <View style={styles.chips}>
          {QUALITY_PRESETS.map((preset) => (
            <Chip
              key={preset.label}
              selected={morphSettings.quality === preset.label}
              onPress={() =>
                setMorphSettings((prev) => ({ ...prev, quality: preset.label }))
              }
              style={styles.chip}
            >
              {preset.label}
            </Chip>
          ))}
        </View>
        <Text style={styles.helperText}>Smoother = longer processing</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Speed</Text>
        <View style={styles.chips}>
          {SPEED_PRESETS.map((preset) => (
            <Chip
              key={preset.label}
              selected={morphSettings.speed === preset.label}
              onPress={() =>
                setMorphSettings((prev) => ({ ...prev, speed: preset.label }))
              }
              style={styles.chip}
            >
              {preset.label}
            </Chip>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 20,
    width: '100%',
  },
  row: {
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    marginHorizontal: 2,
  },
  helperText: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
});
