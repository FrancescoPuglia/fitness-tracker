// Interfaces for type safety
interface Exercise {
  completed: boolean;
}

interface WorkoutData {
  exercises?: Exercise[];
}

// Calcolo streak basato sui dati reali degli allenamenti
export function calculateWorkoutStreak(): number {
  const today = new Date();
  let streak = 0;

  // Controlla ogni giorno a ritroso partendo da oggi
  for (let i = 0; i <= 365; i++) {
    // massimo 1 anno di streak
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);

    const dateString = formatDateForStorage(checkDate);

    // Controlla se c'è un workout completato in questo giorno
    const workoutData = localStorage.getItem(`workout_${dateString}`);
    if (workoutData) {
      try {
        const workout = JSON.parse(workoutData);
        // Considera il workout completato se almeno un esercizio è stato fatto
        const workoutTyped = workout as WorkoutData;
        const hasCompletedExercises = Boolean(
          workoutTyped.exercises &&
            workoutTyped.exercises.some((ex: Exercise) => ex.completed)
        );

        if (hasCompletedExercises) {
          streak++;
        } else {
          // Se questo giorno non ha workout completato, interrompi il conteggio
          break;
        }
      } catch (error) {
        // Dati corrotti, interrompi
        console.warn('Corrupted workout data:', error);
        break;
      }
    } else {
      // Nessun dato per questo giorno, interrompi il conteggio
      break;
    }
  }

  return streak;
}

export function calculateDietStreak(): number {
  const today = new Date();
  let streak = 0;

  for (let i = 0; i <= 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);

    const dateString = formatDateForStorage(checkDate);

    const dietData = localStorage.getItem(`diet_${dateString}`);
    if (dietData) {
      try {
        const diet = JSON.parse(dietData);
        // Considera la dieta seguita se almeno 80% degli alimenti è stato consumato
        const totalItems = getTotalDietItemsForDay(checkDate.getDay());
        const completedItems = diet.completedItems
          ? diet.completedItems.length
          : 0;
        const compliance = totalItems > 0 ? completedItems / totalItems : 0;

        if (compliance >= 0.8) {
          // 80% compliance
          streak++;
        } else {
          break;
        }
      } catch (error) {
        console.warn('Corrupted diet data:', error);
        break;
      }
    } else {
      break;
    }
  }

  return streak;
}

export function calculateOverallStreak(): number {
  // Streak combinato: conta i giorni in cui hai fatto ALMENO workout O dieta con buona compliance
  const today = new Date();
  let streak = 0;

  for (let i = 0; i <= 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);

    const dateString = formatDateForStorage(checkDate);

    // Controlla workout
    const workoutData = localStorage.getItem(`workout_${dateString}`);
    let hasWorkout = false;
    if (workoutData) {
      try {
        const workout = JSON.parse(workoutData);
        const workoutTyped = workout as WorkoutData;
        hasWorkout = Boolean(
          workoutTyped.exercises &&
            workoutTyped.exercises.some((ex: Exercise) => ex.completed)
        );
      } catch (error) {
        console.warn('Error processing workout data:', error);
      }
    }

    // Controlla dieta
    const dietData = localStorage.getItem(`diet_${dateString}`);
    let hasDiet = false;
    if (dietData) {
      try {
        const diet = JSON.parse(dietData);
        const totalItems = getTotalDietItemsForDay(checkDate.getDay());
        const completedItems = diet.completedItems
          ? diet.completedItems.length
          : 0;
        const compliance = totalItems > 0 ? completedItems / totalItems : 0;
        hasDiet = compliance >= 0.8;
      } catch (error) {
        console.warn('Error processing diet data:', error);
      }
    }

    if (hasWorkout || hasDiet) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function formatDateForStorage(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

function getTotalDietItemsForDay(dayOfWeek: number): number {
  // Importiamo dinamicamente per evitare circular dependencies
  const WEEKLY_DIET_PLAN = {
    0: {
      meals: [
        { items: [{}, {}] },
        { items: [{}, {}, {}] },
        { items: [{}, {}, {}, {}, {}] },
        { items: [{}, {}] },
      ],
    },
    1: {
      meals: [
        { items: [{}, {}] },
        { items: [{}, {}, {}] },
        { items: [{}, {}, {}, {}, {}] },
        { items: [{}, {}] },
      ],
    },
    2: {
      meals: [
        { items: [{}, {}] },
        { items: [{}, {}, {}, {}, {}] },
        { items: [{}, {}, {}, {}, {}] },
        { items: [{}, {}] },
      ],
    },
    3: {
      meals: [
        { items: [{}, {}] },
        { items: [{}, {}] },
        { items: [{}, {}, {}, {}] },
        { items: [{}, {}] },
      ],
    },
    4: {
      meals: [
        { items: [{}, {}] },
        { items: [{}, {}, {}] },
        { items: [{}, {}, {}, {}] },
        { items: [{}] },
      ],
    },
    5: {
      meals: [
        { items: [{}, {}] },
        { items: [{}, {}, {}, {}] },
        { items: [{}, {}, {}, {}, {}] },
        { items: [{}, {}] },
      ],
    },
    6: {
      meals: [
        { items: [{}, {}] },
        { items: [{}, {}, {}, {}] },
        { items: [{}, {}, {}, {}, {}] },
        { items: [{}, {}] },
      ],
    },
  };

  const dayPlan = WEEKLY_DIET_PLAN[dayOfWeek as keyof typeof WEEKLY_DIET_PLAN];
  return dayPlan.meals.reduce((sum, meal) => sum + meal.items.length, 0);
}
