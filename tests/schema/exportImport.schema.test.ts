import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Schema validation for export/import data
const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  sets: z.number().optional(),
  reps: z.number().optional(),
  weight: z.number().optional(),
  completed: z.boolean(),
  notes: z.string().optional()
});

const WorkoutDaySchema = z.object({
  id: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  exercises: z.array(ExerciseSchema),
  duration: z.number().optional(),
  notes: z.string().optional()
});

const MealSchema = z.object({
  id: z.string(),
  name: z.string(),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  completed: z.boolean(),
  notes: z.string().optional()
});

const DietDaySchema = z.object({
  id: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  meals: z.array(MealSchema),
  notes: z.string().optional()
});

const PersonalRecordSchema = z.object({
  exerciseName: z.string(),
  weight: z.number(),
  reps: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

const ExportDataSchema = z.object({
  workouts: z.array(WorkoutDaySchema),
  diets: z.array(DietDaySchema),
  records: z.array(PersonalRecordSchema)
});

// Helper function to merge export data safely
function mergeExportData(older: z.infer<typeof ExportDataSchema>, newer: z.infer<typeof ExportDataSchema>) {
  // Merge personal records - keep highest weight for each exercise
  const mergedRecords = new Map<string, z.infer<typeof PersonalRecordSchema>>();
  
  [...older.records, ...newer.records].forEach(record => {
    const existing = mergedRecords.get(record.exerciseName);
    if (!existing || record.weight > existing.weight) {
      mergedRecords.set(record.exerciseName, record);
    }
  });

  // Merge workout days - keep latest for each date
  const mergedWorkouts = new Map<string, z.infer<typeof WorkoutDaySchema>>();
  
  [...older.workouts, ...newer.workouts].forEach(workout => {
    const existing = mergedWorkouts.get(workout.date);
    if (!existing || workout.date >= existing.date) {
      mergedWorkouts.set(workout.date, workout);
    }
  });

  // Merge diet days - keep latest for each date
  const mergedDiets = new Map<string, z.infer<typeof DietDaySchema>>();
  
  [...older.diets, ...newer.diets].forEach(diet => {
    const existing = mergedDiets.get(diet.date);
    if (!existing || diet.date >= existing.date) {
      mergedDiets.set(diet.date, diet);
    }
  });

  return {
    workouts: Array.from(mergedWorkouts.values()).sort((a, b) => a.date.localeCompare(b.date)),
    diets: Array.from(mergedDiets.values()).sort((a, b) => a.date.localeCompare(b.date)),
    records: Array.from(mergedRecords.values())
  };
}

describe('schema: Export/Import Data Validation', () => {
  it('validates valid export data structure', () => {
    const validData = {
      workouts: [{
        id: 'w1',
        date: '2025-09-11',
        exercises: [{
          id: 'ex1',
          name: 'Squat',
          sets: 3,
          reps: 12,
          weight: 100,
          completed: true
        }],
        duration: 3600
      }],
      diets: [{
        id: 'd1',
        date: '2025-09-11',
        meals: [{
          id: 'm1',
          name: 'Breakfast',
          calories: 400,
          completed: true
        }]
      }],
      records: [{
        exerciseName: 'Squat',
        weight: 120,
        reps: 5,
        date: '2025-09-11'
      }]
    };

    expect(() => ExportDataSchema.parse(validData)).not.toThrow();
  });

  it('rejects invalid date formats', () => {
    const invalidData = {
      workouts: [{
        id: 'w1',
        date: '11/09/2025', // Invalid format
        exercises: []
      }],
      diets: [],
      records: []
    };

    expect(() => ExportDataSchema.parse(invalidData)).toThrow();
  });

  it('merges export data correctly maintaining PRs and latest logs', () => {
    const older = {
      workouts: [{ id: 'w1', date: '2025-09-10', exercises: [] }],
      diets: [{ id: 'd1', date: '2025-09-10', meals: [] }],
      records: [{ exerciseName: 'Squat', weight: 120, reps: 5, date: '2025-09-01' }]
    };

    const newer = {
      workouts: [{ id: 'w2', date: '2025-09-11', exercises: [] }],
      diets: [{ id: 'd2', date: '2025-09-11', meals: [] }],
      records: [{ exerciseName: 'Squat', weight: 115, reps: 8, date: '2025-09-11' }]
    };

    const validOlder = ExportDataSchema.parse(older);
    const validNewer = ExportDataSchema.parse(newer);
    const merged = mergeExportData(validOlder, validNewer);

    // Should keep higher PR weight
    expect(merged.records[0].weight).toBe(120);
    expect(merged.records[0].date).toBe('2025-09-01');
    
    // Should have both workout days
    expect(merged.workouts).toHaveLength(2);
    expect(merged.workouts.map(w => w.date)).toEqual(['2025-09-10', '2025-09-11']);
  });

  it('handles same-date merging by keeping latest data', () => {
    const data1 = {
      workouts: [{ 
        id: 'w1', 
        date: '2025-09-11', 
        exercises: [{ id: 'ex1', name: 'Squat', completed: false }] 
      }],
      diets: [],
      records: []
    };

    const data2 = {
      workouts: [{ 
        id: 'w2', 
        date: '2025-09-11', 
        exercises: [{ id: 'ex1', name: 'Squat', completed: true }] 
      }],
      diets: [],
      records: []
    };

    const merged = mergeExportData(data1, data2);
    
    // Should keep the later/newer workout (data2)
    expect(merged.workouts).toHaveLength(1);
    expect(merged.workouts[0].exercises[0].completed).toBe(true);
  });

  it('validates required fields are present', () => {
    const missingRequiredFields = {
      workouts: [{
        // missing id
        date: '2025-09-11',
        exercises: []
      }],
      diets: [],
      records: []
    };

    expect(() => ExportDataSchema.parse(missingRequiredFields)).toThrow();
  });
});