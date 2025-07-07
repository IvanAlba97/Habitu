import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../constants/ThemeContext';
import { loadHabits } from '../storage/habitStorage';

const CalendarScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [markedDates, setMarkedDates] = useState({});
  const [allHabits, setAllHabits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [habitsForSelectedDate, setHabitsForSelectedDate] = useState([]);

  useEffect(() => {
    const fetchAndMarkDates = async () => {
      const habits = await loadHabits();
      setAllHabits(habits); // Store all habits

      const datesData = {}; // To store total and completed habits per day

      const getDayName = (date) => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
      };

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for comparison

      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();

      // Iterate through a range of dates (e.g., current year and surrounding months)
      // For simplicity, let's consider a fixed range, e.g., last 6 months and next 6 months
      // A more robust solution might dynamically load dates as the user scrolls
      for (let i = -6; i <= 6; i++) { // -6 to +6 months from current
        const date = new Date(currentYear, currentMonth + i, 1);
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(year, month, day);
          currentDate.setHours(0, 0, 0, 0); // Set to start of day for comparison

          if (currentDate <= today) { // Only process past and current dates
            const dateString = currentDate.toISOString().split('T')[0];
            const dayName = getDayName(currentDate);

            let totalHabitsDue = 0;
            let completedHabits = 0;

            habits.forEach(habit => {
              const isDueToday =
                habit.frequency === 'daily' ||
                (habit.frequency === 'specific' && habit.selectedDays && habit.selectedDays.includes(dayName));

              if (isDueToday) {
                totalHabitsDue++;
                if (habit.completedDates && habit.completedDates.includes(dateString)) {
                  completedHabits++;
                }
              }
            });

            if (totalHabitsDue > 0) {
              const completionPercentage = (completedHabits / totalHabitsDue) * 100;
              let backgroundColor;

              if (completionPercentage === 100) {
                backgroundColor = '#4CAF50'; // Green
              } else if (completionPercentage > 0) {
                backgroundColor = '#FFEB3B'; // Yellow
              } else {
                backgroundColor = '#F44336'; // Red
              }

              datesData[dateString] = {
                customStyles: {
                  container: {
                    backgroundColor: backgroundColor,
                    borderRadius: 999,
                  },
                  text: {
                    color: colors.card,
                  },
                },
                baseCustomStyles: {
                  container: {
                    backgroundColor: backgroundColor,
                    borderRadius: 999,
                  },
                  text: {
                    color: colors.card,
                  },
                },
                today: true, // Mark as today
              };
            }
          }
        }
      }
      setMarkedDates(datesData);
    };
    const unsubscribe = navigation.addListener('focus', fetchAndMarkDates);
    return unsubscribe;
  }, [navigation, colors]);

  useEffect(() => {
    if (selectedDate && allHabits.length > 0) {
      const filteredHabits = allHabits.filter(habit => 
        habit.completedDates && habit.completedDates.includes(selectedDate)
      );
      setHabitsForSelectedDate(filteredHabits);
    } else {
      setHabitsForSelectedDate([]);
    }
  }, [selectedDate, allHabits]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    const newMarkedDates = { ...markedDates };

    // Clear previous selection and restore base custom styles
    for (const date in newMarkedDates) {
      if (newMarkedDates[date].selected) {
        newMarkedDates[date] = {
          ...newMarkedDates[date],
          selected: false,
          selectedColor: undefined,
          selectedTextColor: undefined,
          customStyles: newMarkedDates[date].baseCustomStyles || {},
        };
      }
    }

    // Mark new selection, applying selection styles on top of base custom styles
    newMarkedDates[day.dateString] = {
      ...(newMarkedDates[day.dateString] || {}),
      selected: true,
      selectedColor: colors.accent,
      selectedTextColor: colors.card,
      customStyles: {
        ...(newMarkedDates[day.dateString]?.baseCustomStyles || {}),
        container: {
          ...(newMarkedDates[day.dateString]?.baseCustomStyles?.container || {}),
          borderWidth: 2,
          borderColor: colors.card,
          borderRadius: 999,
        },
        text: {
          ...(newMarkedDates[day.dateString]?.baseCustomStyles?.text || {}),
          color: colors.card,
        },
      },
    };
    setMarkedDates(newMarkedDates);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 20,
    },
    calendar: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      marginHorizontal: 10,
    },
    selectedDateContainer: {
      marginTop: 20,
      paddingHorizontal: 10,
    },
    selectedDateText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    habitList: {
      maxHeight: 200, // Limit height for scrollability
    },
    habitItem: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    habitText: {
      color: colors.text,
      fontSize: 16,
    },
    noHabitsText: {
      color: colors.subtleText,
      fontSize: 16,
      fontStyle: 'italic',
    },
  });

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        markedDates={markedDates}
        onDayPress={onDayPress}
        markingType={'custom'}
        theme={{
          backgroundColor: colors.background,
          calendarBackground: colors.background,
          textSectionTitleColor: colors.text,
          selectedDayBackgroundColor: colors.accent,
          selectedDayTextColor: colors.card,
          dayTextColor: colors.text,
          textDisabledColor: colors.subtleText,
          dotColor: colors.accent,
          selectedDotColor: colors.card,
          arrowColor: colors.text,
          monthTextColor: colors.text,
          indicatorColor: colors.text,
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />
      {selectedDate && (
        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateText}>Hábitos completados el {selectedDate}:</Text>
          {habitsForSelectedDate.length > 0 ? (
            <FlatList
              data={habitsForSelectedDate}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.habitItem}>
                  <Text style={styles.habitText}>{item.name}</Text>
                </View>
              )}
              style={styles.habitList}
            />
          ) : (
            <Text style={styles.noHabitsText}>No hay hábitos completados en esta fecha.</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default CalendarScreen;