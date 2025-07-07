import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = 'HABITS_DATA';

export const saveHabits = async (habits) => {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits', error);
  }
};

export const loadHabits = async () => {
  try {
    const data = await AsyncStorage.getItem(HABITS_KEY);
    const habits = data != null ? JSON.parse(data) : [];
    return habits.map(habit => ({
      ...habit,
      completedDates: habit.completedDates || [],
    }));
  } catch (error) {
    console.error('Error loading habits', error);
    return [];
  }
};
