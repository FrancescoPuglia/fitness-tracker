import { Storage } from '../../../src/storage';
import { generateId } from '../../../src/utils';
import type { WorkoutDay, DietDay, PersonalRecord } from '../../../src/types';

export const seedWorkoutData = () => {
  const workoutDay: WorkoutDay = {
    id: generateId(),
    date: '2025-09-11',
    exercises: [
      {
        id: 'ex1',
        name: 'Squat',
        sets: 3,
        reps: 12,
        weight: 100,
        completed: false
      },
      {
        id: 'ex2', 
        name: 'Bench Press',
        sets: 3,
        reps: 10,
        weight: 80,
        completed: false
      }
    ],
    duration: 0
  };
  
  Storage.saveWorkoutDay(workoutDay);
  return workoutDay;
};

export const seedDietData = () => {
  const dietDay: DietDay = {
    id: generateId(),
    date: '2025-09-11',
    meals: [
      {
        id: 'm1',
        name: 'Breakfast',
        calories: 400,
        protein: 20,
        carbs: 40,
        fat: 15,
        completed: false
      },
      {
        id: 'm2',
        name: 'Lunch', 
        calories: 600,
        protein: 35,
        carbs: 60,
        fat: 20,
        completed: false
      }
    ]
  };
  
  Storage.saveDietDay(dietDay);
  return dietDay;
};

export const seedPersonalRecords = () => {
  const records: PersonalRecord[] = [
    {
      exerciseName: 'Squat',
      weight: 120,
      reps: 5,
      date: '2025-09-01'
    },
    {
      exerciseName: 'Bench Press',
      weight: 90,
      reps: 8,
      date: '2025-09-05'
    }
  ];
  
  records.forEach(record => Storage.savePersonalRecord(record));
  return records;
};

export const clearTestData = () => {
  if (typeof Storage.clearAllData === 'function') {
    Storage.clearAllData();
  }
  // Clear localStorage as fallback
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
};