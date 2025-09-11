import { describe, it, expect, beforeEach } from 'vitest';
import { Storage } from '../../src/storage';
import { generateId } from '../../src/utils';
import type { WorkoutDay, DietDay, PersonalRecord } from '../../src/types';

describe('int: Storage Integration Tests', () => {
  beforeEach(() => {
    Storage.clearAllData();
  });

  it('saves and retrieves workout day from localStorage', () => {
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
          completed: true
        }
      ],
      duration: 3600
    };

    Storage.saveWorkoutDay(workoutDay);
    const retrieved = Storage.getWorkoutDay('2025-09-11');
    
    expect(retrieved).toEqual(workoutDay);
    expect(retrieved?.exercises[0].completed).toBe(true);
  });

  it('saves and retrieves diet day from localStorage', () => {
    const dietDay: DietDay = {
      id: generateId(),
      date: '2025-09-11',
      meals: [
        {
          id: 'm1',
          name: 'Breakfast',
          calories: 400,
          protein: 20,
          completed: true
        }
      ]
    };

    Storage.saveDietDay(dietDay);
    const retrieved = Storage.getDietDay('2025-09-11');
    
    expect(retrieved).toEqual(dietDay);
    expect(retrieved?.meals[0].completed).toBe(true);
  });

  it('maintains personal records correctly', () => {
    // Add initial record
    const record1: PersonalRecord = {
      exerciseName: 'Squat',
      weight: 100,
      reps: 10,
      date: '2025-09-01'
    };
    Storage.savePersonalRecord(record1);
    
    // Add higher weight - should update
    const record2: PersonalRecord = {
      exerciseName: 'Squat', 
      weight: 120,
      reps: 8,
      date: '2025-09-11'
    };
    Storage.savePersonalRecord(record2);
    
    // Add lower weight - should not update
    const record3: PersonalRecord = {
      exerciseName: 'Squat',
      weight: 90,
      reps: 12,
      date: '2025-09-12'
    };
    Storage.savePersonalRecord(record3);
    
    const records = Storage.getPersonalRecords();
    const squatRecord = records.find(r => r.exerciseName === 'Squat');
    
    expect(squatRecord?.weight).toBe(120); // Should keep the highest weight
    expect(squatRecord?.date).toBe('2025-09-11');
  });

  it('exports and imports data correctly', () => {
    // Create test data
    const workoutDay: WorkoutDay = {
      id: generateId(),
      date: '2025-09-11',
      exercises: [{ id: 'ex1', name: 'Squat', completed: true }]
    };
    
    const record: PersonalRecord = {
      exerciseName: 'Squat',
      weight: 120,
      reps: 5,
      date: '2025-09-11'
    };

    Storage.saveWorkoutDay(workoutDay);
    Storage.savePersonalRecord(record);

    // Export data
    const exportedData = Storage.exportData();
    expect(exportedData).toContain('Squat');
    
    // Clear and import
    Storage.clearAllData();
    expect(Storage.getWorkoutDays()).toHaveLength(0);
    
    const importSuccess = Storage.importData(exportedData);
    expect(importSuccess).toBe(true);
    
    // Verify imported data
    const importedWorkout = Storage.getWorkoutDay('2025-09-11');
    const importedRecords = Storage.getPersonalRecords();
    
    expect(importedWorkout?.exercises[0].name).toBe('Squat');
    expect(importedRecords[0].weight).toBe(120);
  });

  it('handles invalid import data gracefully', () => {
    const invalidJson = '{ invalid json }';
    const success = Storage.importData(invalidJson);
    expect(success).toBe(false);
    
    const emptyData = '{}';
    const emptySuccess = Storage.importData(emptyData);
    expect(emptySuccess).toBe(true); // Should not fail on empty but valid JSON
  });
});