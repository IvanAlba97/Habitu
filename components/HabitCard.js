
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../constants/ThemeContext';

export default function HabitCard({ habit, onToggle, onDelete }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 15,
      padding: 20,
      marginVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.border,
    },
    completedCard: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
    },
    text: {
      fontSize: 18,
      color: colors.text,
      flexShrink: 1,
    },
    textCompleted: {
      textDecorationLine: 'line-through',
      color: colors.card,
    },
    checkbox: {
      width: 28,
      height: 28,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    completedCheckbox: {
      backgroundColor: 'transparent',
      borderColor: colors.card,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.card, habit.completed && styles.completedCard]}
      onPress={() => onToggle(habit.id)}
      onLongPress={() => onDelete(habit.id)}
      activeOpacity={0.8}
    >
      <View style={styles.row}>
        <Text style={[styles.text, habit.completed && styles.textCompleted]}>
          {habit.name}
        </Text>
        <View style={[styles.checkbox, habit.completed && styles.completedCheckbox]}>
          {habit.completed && (
            <Feather name="check" size={20} color={colors.card} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
