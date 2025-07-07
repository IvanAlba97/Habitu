
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { loadHabits, saveHabits } from '../storage/habitStorage';
import HabitCard from '../components/HabitCard';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../constants/ThemeContext';


const categoryLabels = {
    'general': 'General',
    'health': 'Salud',
    'productivity': 'Productividad',
    'finance': 'Finanzas',
    'personal': 'Personal',
};

export default function HomeScreen({ navigation }) {
    const { colors } = useTheme();
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        const fetchHabits = async () => {
            const stored = await loadHabits();
            setHabits(stored);
        };
        const unsubscribe = navigation.addListener('focus', fetchHabits);
        return unsubscribe;
    }, [navigation]);

    const toggleHabit = async (id) => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const updated = habits.map(h => {
            if (h.id === id) {
                const newCompletedDates = h.completedDates ? [...h.completedDates] : [];
                if (newCompletedDates.includes(today)) {
                    // Unmark as completed for today
                    return { ...h, completedDates: newCompletedDates.filter(date => date !== today) };
                } else {
                    // Mark as completed for today
                    return { ...h, completedDates: [...newCompletedDates, today] };
                }
            }
            return h;
        });
        setHabits(updated);
        await saveHabits(updated);
    };

    const getDayName = (date) => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
    };

    const today = new Date();
    const todayName = getDayName(today);
    const todayISO = today.toISOString().split('T')[0];

    // Filter habits based on frequency and selected days
    const habitsForToday = habits.filter(h => {
        if (h.frequency === 'daily') {
            return true;
        }
        if (h.frequency === 'specific') {
            return h.selectedDays && h.selectedDays.includes(todayName);
        }
        // For 'weekly' habits, always show them, completion is tracked by completedDates
        return true;
    });

    // Update habit.completed based on today's date for rendering
    const habitsWithTodayStatus = habitsForToday.map(h => ({
        ...h,
        completed: h.completedDates && h.completedDates.includes(todayISO),
    }));

    // Group habits by category
    const groupedHabits = habitsWithTodayStatus.reduce((acc, habit) => {
        const category = habit.category || 'general'; // Default to 'general' if no category is set
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(habit);
        return acc;
    }, {});

    const handleDeleteHabit = (id) => {
        Alert.alert(
            "Eliminar Hábito",
            "¿Estás seguro de que quieres eliminar este hábito?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        
                        const updated = habits.filter(h => h.id !== id);
                        setHabits(updated);
                        await saveHabits(updated);
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 20,
            paddingTop: 20,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 20,
            textAlign: 'center',
        },
        categoryTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            marginTop: 15,
            marginBottom: 10,
        },
        fab: {
            position: 'absolute',
            right: 30,
            bottom: 30,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.accent,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 8,
        },
        calendarFab: {
            position: 'absolute',
            left: 30,
            bottom: 30,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.accent,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 8,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Hábitos</Text>
            <FlatList
                data={Object.keys(groupedHabits)}
                keyExtractor={(item) => item}
                renderItem={({ item: category }) => (
                    <View>
                        <Text style={styles.categoryTitle}>{categoryLabels[category] || category}</Text>
                        <FlatList
                            data={groupedHabits[category]}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <HabitCard 
                                    habit={item} 
                                    onToggle={toggleHabit} 
                                    onDelete={handleDeleteHabit}
                                />
                            )}
                        />
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddHabit')}
            >
                <Feather name="plus" size={28} color={colors.card} />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.calendarFab}
                onPress={() => navigation.navigate('Calendar')}
            >
                <Feather name="calendar" size={28} color={colors.card} />
            </TouchableOpacity>
        </View>
    );
}
