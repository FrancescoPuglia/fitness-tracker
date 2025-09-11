import type { WorkoutDay, DietDay, PersonalRecord } from './types';

const STORAGE_KEYS = {
  WORKOUTS: 'fitness_workouts',
  DIET: 'fitness_diet',
  RECORDS: 'fitness_records',
  WORKOUT_TEMPLATES: 'fitness_workout_templates',
  MEAL_TEMPLATES: 'fitness_meal_templates'
};

export class Storage {
  static saveWorkoutDay(workoutDay: WorkoutDay): void {
    const workouts = this.getWorkoutDays();
    const existingIndex = workouts.findIndex(w => w.date === workoutDay.date);
    
    if (existingIndex >= 0) {
      workouts[existingIndex] = workoutDay;
    } else {
      workouts.push(workoutDay);
    }
    
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  }

  static getWorkoutDays(): WorkoutDay[] {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
  }

  static getWorkoutDay(date: string): WorkoutDay | null {
    const workouts = this.getWorkoutDays();
    return workouts.find(w => w.date === date) || null;
  }

  static saveDietDay(dietDay: DietDay): void {
    const diets = this.getDietDays();
    const existingIndex = diets.findIndex(d => d.date === dietDay.date);
    
    if (existingIndex >= 0) {
      diets[existingIndex] = dietDay;
    } else {
      diets.push(dietDay);
    }
    
    localStorage.setItem(STORAGE_KEYS.DIET, JSON.stringify(diets));
  }

  static getDietDays(): DietDay[] {
    const data = localStorage.getItem(STORAGE_KEYS.DIET);
    return data ? JSON.parse(data) : [];
  }

  static getDietDay(date: string): DietDay | null {
    const diets = this.getDietDays();
    return diets.find(d => d.date === date) || null;
  }

  static savePersonalRecord(record: PersonalRecord): void {
    const records = this.getPersonalRecords();
    const existingIndex = records.findIndex(r => r.exerciseName === record.exerciseName);
    
    if (existingIndex >= 0) {
      if (record.weight > records[existingIndex].weight) {
        records[existingIndex] = record;
      }
    } else {
      records.push(record);
    }
    
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }

  static getPersonalRecords(): PersonalRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  }

  static exportData(): string {
    return JSON.stringify({
      workouts: this.getWorkoutDays(),
      diets: this.getDietDays(),
      records: this.getPersonalRecords()
    }, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.workouts) {
        localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(data.workouts));
      }
      if (data.diets) {
        localStorage.setItem(STORAGE_KEYS.DIET, JSON.stringify(data.diets));
      }
      if (data.records) {
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(data.records));
      }
      
      return true;
    } catch {
      return false;
    }
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}