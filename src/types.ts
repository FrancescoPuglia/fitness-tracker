export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  notes?: string;
  completed: boolean;
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