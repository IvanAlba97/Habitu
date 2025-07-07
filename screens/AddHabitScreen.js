
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { loadHabits, saveHabits } from '../storage/habitStorage';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../constants/ThemeContext';


const daysOfWeek = [
  { label: 'Lunes', value: 'monday' },
  { label: 'Martes', value: 'tuesday' },
  { label: 'Miércoles', value: 'wednesday' },
  { label: 'Jueves', value: 'thursday' },
  { label: 'Viernes', value: 'friday' },
  { label: 'Sábado', value: 'saturday' },
  { label: 'Domingo', value: 'sunday' },
];

const categories = [
  { label: 'General', value: 'general' },
  { label: 'Salud', value: 'health' },
  { label: 'Productividad', value: 'productivity' },
  { label: 'Finanzas', value: 'finance' },
  { label: 'Personal', value: 'personal' },
];

export default function AddHabitScreen({ navigation }) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [selectedDays, setSelectedDays] = useState([]);
  const [category, setCategory] = useState('general');
  

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const addHabit = async () => {
    if (!name.trim()) return;

    

    const current = await loadHabits();
    const newHabit = {
      id: uuidv4(),
      name: name.trim(),
      completed: false,
      frequency,
      selectedDays: frequency === 'specific' ? selectedDays : [],
      category,
      
    };
    await saveHabits([...current, newHabit]);
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 15,
      padding: 20,
      fontSize: 18,
      marginBottom: 30,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    button: {
      backgroundColor: colors.accent,
      padding: 20,
      borderRadius: 15,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: colors.card,
      fontSize: 18,
      fontWeight: 'bold',
    },
    label: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 10,
      marginTop: 20,
    },
    pickerContainer: {
      backgroundColor: colors.card,
      borderRadius: 15,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    picker: {
      height: 50,
      width: '100%',
      color: colors.text,
    },
    pickerItem: {
      fontSize: 16,
      color: colors.text,
    },
    daysContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    dayButton: {
      backgroundColor: colors.card,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      margin: 5,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedDayButton: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    dayButtonText: {
      color: colors.text,
      fontWeight: 'bold',
    },
    selectedDayButtonText: {
      color: colors.card,
    },
    
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TextInput
        placeholder="Nombre del hábito (ej. Leer 10 páginas)"
        placeholderTextColor={colors.subtleText}
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Frecuencia:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={frequency}
          onValueChange={(itemValue) => setFrequency(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Diario" value="daily" />
          <Picker.Item label="Semanal" value="weekly" />
          <Picker.Item label="Días específicos" value="specific" />
        </Picker>
      </View>

      {frequency === 'specific' && (
        <View style={styles.daysContainer}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day.value}
              style={[
                styles.dayButton,
                selectedDays.includes(day.value) && styles.selectedDayButton,
              ]}
              onPress={() => toggleDay(day.value)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDays.includes(day.value) && styles.selectedDayButtonText,
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Categoría:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
          ))}
        </Picker>
      </View>

      

      <TouchableOpacity style={styles.button} onPress={addHabit}>
        <Text style={styles.buttonText}>Guardar Hábito</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
