export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number | string;
  weight?: number;
  notes?: string;
  completed: boolean;
  rir?: string; // Reps in Reserve (es. "1-2", "3-4")
  restTime?: string; // Tempo di riposo (es. "2min", "90s")
  targetReps?: string | number; // Target reps originale (es. "6-8", "12-15")
}

export interface WorkoutDay {
  id: string;
  date: string;
  exercises: Exercise[];
  notes?: string;
  duration?: number;
}

export interface Meal {
  id: string;
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  completed: boolean;
  notes?: string;
}

export interface DietDay {
  id: string;
  date: string;
  meals: Meal[];
  notes?: string;
}

export interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}