import { useState, useEffect, useCallback } from 'react';
import type { Exercise, WorkoutDay } from '../types';
import { Storage } from '../storage';
import { formatDate, formatDisplayDate, generateId } from '../utils';

const defaultExercises: Omit<Exercise, 'id' | 'completed'>[] = [
  { name: 'Panca Piana', sets: 3, reps: 12 },
  { name: 'Squat', sets: 3, reps: 15 },
  { name: 'Stacchi', sets: 3, reps: 10 },
  { name: 'Trazioni', sets: 3, reps: 8 },
  { name: 'Push-up', sets: 3, reps: 20 },
  { name: 'Plank', sets: 3, reps: 30 }
];

export default function WorkoutTracker() {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutDay | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const today = formatDate();

  const loadTodayWorkout = useCallback(() => {
    let workout = Storage.getWorkoutDay(today);
    
    if (!workout) {
      workout = {
        id: generateId(),
        date: today,
        exercises: defaultExercises.map(ex => ({
          id: generateId(),
          ...ex,
          completed: false
        })),
        duration: 0
      };
    }
    
    setCurrentWorkout(workout);
  }, [today]);

  useEffect(() => {
    loadTodayWorkout();
  }, [loadTodayWorkout]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning]);

  const saveWorkout = (workout: WorkoutDay) => {
    Storage.saveWorkoutDay(workout);
    setCurrentWorkout(workout);
  };

  const toggleExercise = (exerciseId: string) => {
    if (!currentWorkout) return;

    const updatedWorkout = {
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      )
    };

    saveWorkout(updatedWorkout);
  };

  const updateExercise = (exerciseId: string, field: keyof Exercise, value: string | number | boolean) => {
    if (!currentWorkout) return;

    const updatedWorkout = {
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      )
    };

    saveWorkout(updatedWorkout);

    if (field === 'weight' && typeof value === 'number' && value > 0) {
      const exercise = updatedWorkout.exercises.find(ex => ex.id === exerciseId);
      if (exercise && exercise.reps) {
        Storage.savePersonalRecord({
          exerciseName: exercise.name,
          weight: value,
          reps: exercise.reps,
          date: today
        });
      }
    }
  };

  const addExercise = () => {
    if (!currentWorkout) return;

    const newExercise: Exercise = {
      id: generateId(),
      name: 'Nuovo Esercizio',
      sets: 3,
      reps: 10,
      completed: false
    };

    const updatedWorkout = {
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, newExercise]
    };

    saveWorkout(updatedWorkout);
  };

  const removeExercise = (exerciseId: string) => {
    if (!currentWorkout) return;

    const updatedWorkout = {
      ...currentWorkout,
      exercises: currentWorkout.exercises.filter(ex => ex.id !== exerciseId)
    };

    saveWorkout(updatedWorkout);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    if (currentWorkout) {
      const updatedWorkout = {
        ...currentWorkout,
        duration: timer
      };
      saveWorkout(updatedWorkout);
    }
  };

  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const completedCount = currentWorkout?.exercises.filter(ex => ex.completed).length || 0;
  const totalCount = currentWorkout?.exercises.length || 0;

  if (!currentWorkout) {
    return <div className="text-center py-8">Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {formatDisplayDate(today)}
            </h2>
            <p className="text-sm text-gray-600">
              {completedCount} / {totalCount} esercizi completati
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-gray-900">
              {formatTime(timer)}
            </div>
            <div className="flex space-x-2 mt-2">
              {!isTimerRunning ? (
                <button
                  onClick={startTimer}
                  className="px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600"
                >
                  Avvia
                </button>
              ) : (
                <button
                  onClick={stopTimer}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Stop
                </button>
              )}
              <button
                onClick={resetTimer}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Esercizi</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {isEditing ? 'Fine' : 'Modifica'}
          </button>
        </div>

        <div className="divide-y">
          {currentWorkout.exercises.map((exercise) => (
            <div key={exercise.id} className="p-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleExercise(exercise.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    exercise.completed
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : 'border-gray-300 hover:border-primary-500'
                  }`}
                >
                  {exercise.completed && '✓'}
                </button>

                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                      className="font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:border-primary-500 outline-none"
                    />
                  ) : (
                    <div className={`font-medium ${exercise.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {exercise.name}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Serie:</span>
                      <input
                        type="number"
                        value={exercise.sets || ''}
                        onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Rip:</span>
                      <input
                        type="number"
                        value={exercise.reps || ''}
                        onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Peso (kg):</span>
                      <input
                        type="number"
                        value={exercise.weight || ''}
                        onChange={(e) => updateExercise(exercise.id, 'weight', parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary-500"
                        step="0.5"
                      />
                    </div>

                    {isEditing && (
                      <button
                        onClick={() => removeExercise(exercise.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Rimuovi
                      </button>
                    )}
                  </div>

                  {exercise.notes && (
                    <div className="mt-2">
                      <textarea
                        value={exercise.notes}
                        onChange={(e) => updateExercise(exercise.id, 'notes', e.target.value)}
                        placeholder="Note per l'esercizio..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary-500"
                        rows={2}
                      />
                    </div>
                  )}

                  {!exercise.notes && (
                    <button
                      onClick={() => updateExercise(exercise.id, 'notes', '')}
                      className="text-sm text-gray-500 hover:text-primary-600 mt-1"
                    >
                      + Aggiungi note
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="p-4 border-t">
            <button
              onClick={addExercise}
              className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded hover:border-primary-500 hover:text-primary-600"
            >
              + Aggiungi Esercizio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}