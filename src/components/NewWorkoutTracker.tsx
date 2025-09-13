import { useState, useEffect, useCallback } from 'react';
import { formatDate, formatDisplayDate } from '../utils';

// Scheda settimanale specifica
const WEEKLY_WORKOUT_PLAN: Record<
  number,
  {
    name: string;
    description: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      weight: number;
      rir: string;
      rest: string;
    }>;
  }
> = {
  0: {
    // Domenica
    name: 'RIPOSO',
    description: 'Recovery Day - Stretching e relax',
    exercises: [],
  },
  1: {
    // Lunedì - Petto + Bicipiti
    name: 'PETTO + BICIPITI',
    description: 'Focus: Petto (fascio alto + globale), Bicipiti',
    exercises: [
      {
        name: 'Panca inclinata bilanciere',
        sets: 4,
        reps: '6-8',
        weight: 0,
        rir: '1-2',
        rest: '2min',
      },
      {
        name: 'Spinte manubri inclinata',
        sets: 3,
        reps: '8-10',
        weight: 0,
        rir: '2-3',
        rest: '90s',
      },
      {
        name: 'Croci ai cavi alti/inclinata',
        sets: 3,
        reps: '12-15',
        weight: 0,
        rir: '2-3',
        rest: '75s',
      },
      {
        name: 'Dip alle parallele (petto)',
        sets: 3,
        reps: '8-10',
        weight: 0,
        rir: '2-3',
        rest: '90s',
      },
      {
        name: 'Curl bilanciere',
        sets: 4,
        reps: '8-10',
        weight: 0,
        rir: '2-3',
        rest: '90s',
      },
      {
        name: 'Curl manubri inclinati',
        sets: 3,
        reps: '10-12',
        weight: 0,
        rir: '2-3',
        rest: '75s',
      },
      {
        name: 'Hammer curl manubri/cavi',
        sets: 3,
        reps: '12-15',
        weight: 0,
        rir: '2-3',
        rest: '60s',
      },
    ],
  },
  2: {
    // Martedì - Dorso + Tricipiti + Collo (A)
    name: 'DORSO + TRICIPITI + COLLO (A)',
    description:
      'Focus: Larghezza dorsale, spessore scapolare, tricipiti, collo',
    exercises: [
      {
        name: 'Trazioni presa ampia',
        sets: 4,
        reps: '6-8',
        weight: 0,
        rir: '1-2',
        rest: '2min',
      },
      {
        name: 'Rematore bilanciere/manubrio',
        sets: 4,
        reps: '8-10',
        weight: 0,
        rir: '1-2',
        rest: '2min',
      },
      {
        name: 'Lat machine inversa/stretta',
        sets: 3,
        reps: '10-12',
        weight: 0,
        rir: '2-3',
        rest: '90s',
      },
      {
        name: 'Pullover ai cavi',
        sets: 3,
        reps: '12-15',
        weight: 0,
        rir: '2-3',
        rest: '75s',
      },
      {
        name: 'Panca stretta bilanciere',
        sets: 4,
        reps: '6-8',
        weight: 0,
        rir: '1-2',
        rest: '2min',
      },
      {
        name: 'French press EZ',
        sets: 3,
        reps: '8-10',
        weight: 0,
        rir: '2-3',
        rest: '90s',
      },
      {
        name: 'Pushdown cavo',
        sets: 3,
        reps: '12-15',
        weight: 0,
        rir: '2-3',
        rest: '60s',
      },
      {
        name: 'Flessione collo',
        sets: 2,
        reps: '15-20',
        weight: 0,
        rir: '3-4',
        rest: '60s',
      },
      {
        name: 'Estensione collo',
        sets: 2,
        reps: '15-20',
        weight: 0,
        rir: '3-4',
        rest: '60s',
      },
      {
        name: 'Laterale collo dx/sx',
        sets: 2,
        reps: '12-15',
        weight: 0,
        rir: '3-4',
        rest: '60s',
      },
    ],
  },
  3: {
    // Mercoledì - Gambe Complete
    name: 'GAMBE COMPLETE',
    description: 'Focus: Quadricipiti, glutei, femorali, polpacci',
    exercises: [
      {
        name: 'Squat',
        sets: 4,
        reps: '6-8',
        weight: 0,
        rir: '1-2',
        rest: '3min',
      },
      {
        name: 'Hip thrust',
        sets: 4,
        reps: '8-10',
        weight: 0,
        rir: '2-3',
        rest: '2min',
      },
      {
        name: 'Affondi camminata',
        sets: 3,
        reps: '10 passi/gamba',
        weight: 0,
        rir: '2-3',
        rest: '90s',
      },
      {
        name: 'Leg press 45°',
        sets: 3,
        reps: '10-12',
        weight: 0,
        rir: '2-3',
        rest: '90s',
      },
      {
        name: 'Leg curl sdraiato',
        sets: 3,
        reps: '10-12',
        weight: 0,
        rir: '2-3',
        rest: '90s',
      },
      {
        name: 'Calf raise in piedi',
        sets: 4,
        reps: '10-12',
        weight: 0,
        rir: '2-3',
        rest: '60s',
      },
      {
        name: 'Calf raise seduto',
        sets: 3,
        reps: '15-20',
        weight: 0,
        rir: '2-3',
        rest: '60s',
      },
    ],
  },
  4: {
    // Giovedì - Recupero Attivo
    name: 'RECUPERO ATTIVO',
    description: "30-40' LISS + Stretching + Sauna",
    exercises: [
      {
        name: 'LISS (camminata/cyclette)',
        sets: 1,
        reps: '30-40min',
        weight: 0,
        rir: 'N/A',
        rest: 'N/A',
      },
      {
        name: 'Stretching/mobilità',
        sets: 1,
        reps: '15-20min',
        weight: 0,
        rir: 'N/A',
        rest: 'N/A',
      },
      {
        name: 'Sauna/bagno turco',
        sets: 1,
        reps: '10-15min',
        weight: 0,
        rir: 'N/A',
        rest: 'N/A',
      },
    ],
  },
  5: {
    // Venerdì - Spalle Complete + Collo (B)
    name: 'SPALLE COMPLETE + COLLO (B)',
    description:
      'Focus: Deltoidi laterali/posteriori, trapezio, richiamo braccia, collo',
    exercises: [
      {
        name: 'Military press manubri',
        sets: 4,
        reps: '6-8',
        weight: 0,
        rir: '1-2',
        rest: '2min',
      },
      {
        name: 'Alzate laterali cavi/manubri',
        sets: 4,
        reps: '12-15',
        weight: 0,
        rir: '2-3',
        rest: '75s',
      },
      {
        name: 'Rear delt fly (pec deck)',
        sets: 3,
        reps: '12-15',
        weight: 0,
        rir: '2-3',
        rest: '75s',
      },
      {
        name: 'Face pull',
        sets: 3,
        reps: '12-15',
        weight: 0,
        rir: '2-3',
        rest: '60s',
      },
      {
        name: 'Scrollate manubri/bilanciere',
        sets: 3,
        reps: '10-12',
        weight: 0,
        rir: '2-3',
        rest: '90s',
      },
      {
        name: 'Curl manubri (richiamo)',
        sets: 2,
        reps: '12-15',
        weight: 0,
        rir: '3-4',
        rest: '60s',
      },
      {
        name: 'Pushdown corda (richiamo)',
        sets: 2,
        reps: '12-15',
        weight: 0,
        rir: '3-4',
        rest: '60s',
      },
      {
        name: 'Flessione collo',
        sets: 2,
        reps: '15-20',
        weight: 0,
        rir: '3-4',
        rest: '60s',
      },
      {
        name: 'Estensione collo',
        sets: 2,
        reps: '15-20',
        weight: 0,
        rir: '3-4',
        rest: '60s',
      },
      {
        name: 'Laterale collo dx/sx',
        sets: 2,
        reps: '12-15',
        weight: 0,
        rir: '3-4',
        rest: '60s',
      },
      {
        name: 'Isometrie multidirezionali',
        sets: 3,
        reps: '20s',
        weight: 0,
        rir: 'N/A',
        rest: '60s',
      },
      {
        name: 'Stomach vacuum',
        sets: 3,
        reps: '20s',
        weight: 0,
        rir: 'N/A',
        rest: '60s',
      },
      {
        name: 'Plank',
        sets: 3,
        reps: '45s',
        weight: 0,
        rir: 'N/A',
        rest: '60s',
      },
    ],
  },
  6: {
    // Sabato - Posteriori + Conditioning
    name: 'POSTERIORI + CONDITIONING',
    description: 'Focus: Femorali, glutei, polpacci + condizionamento',
    exercises: [
      {
        name: 'Stacco rumeno (RDL)',
        sets: 4,
        reps: '6-8',
        weight: 0,
        rir: '1-2',
        rest: '2min',
      },
      {
        name: 'Hip thrust (variante mono)',
        sets: 3,
        reps: '10-12',
        weight: 0,
        rir: '2-3',
        rest: '2min',
      },
      {
        name: 'Nordic curl/glute ham raise',
        sets: 3,
        reps: '8-10',
        weight: 0,
        rir: '2-3',
        rest: '90s',
      },
      {
        name: 'Leg curl seduto',
        sets: 3,
        reps: '12-15',
        weight: 0,
        rir: '2-3',
        rest: '75s',
      },
      {
        name: 'Calf raise multipla',
        sets: 3,
        reps: '15-20',
        weight: 0,
        rir: '2-3',
        rest: '60s',
      },
      {
        name: "Farmer's walk",
        sets: 3,
        reps: '40m',
        weight: 0,
        rir: '2-3',
        rest: '90s',
      },
      {
        name: 'HIIT Sprint',
        sets: 8,
        reps: '30s sprint / 60s walk',
        weight: 0,
        rir: 'Max',
        rest: '60s',
      },
    ],
  },
};

interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rir: string;
  restTime: string;
  targetReps: string;
  completed: boolean;
  notes?: string;
}

interface WorkoutData {
  date: string;
  exercises: WorkoutExercise[];
  duration: number;
}

export default function NewWorkoutTracker() {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutData | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);

  const today = formatDate();
  const currentDay = new Date().getDay();
  const todayPlan = WEEKLY_WORKOUT_PLAN[currentDay];

  const loadTodayWorkout = useCallback(() => {
    // Carica dal localStorage (compatibile con streakCalculator)
    const saved = localStorage.getItem(`workout_${today}`);
    let workout;
    
    if (saved) {
      workout = JSON.parse(saved);
    } else {
      // Crea nuovo workout usando la scheda del giorno
      workout = {
        date: today,
        exercises: todayPlan.exercises.map((ex, index) => ({
          id: `${today}_${index}`,
          name: ex.name,
          sets: ex.sets,
          reps: typeof ex.reps === 'string' ? 0 : ex.reps,
          weight: ex.weight,
          rir: ex.rir,
          restTime: ex.rest,
          targetReps: ex.reps,
          completed: false,
        })),
        duration: 0,
      };
    }

    setCurrentWorkout(workout);
  }, [today, todayPlan]);

  useEffect(() => {
    loadTodayWorkout();
  }, [loadTodayWorkout]);

  // Timer principale
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

  // Timer di riposo
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRestTimerRunning && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsRestTimerRunning(false);
            // Notifica sonora o vibrazione
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRestTimerRunning, restTimer]);

  const saveWorkout = (workout: any) => {
    // Salva nel localStorage (compatibile con streakCalculator)
    localStorage.setItem(`workout_${today}`, JSON.stringify(workout));
    setCurrentWorkout(workout);
  };

  const savePotentialPR = (exerciseName: string, weight: number, reps: number) => {
    const prKey = 'personal_records';
    const existingPRs = JSON.parse(localStorage.getItem(prKey) || '[]');
    
    // Trova record esistente per questo esercizio
    const existingPR = existingPRs.find((pr: any) => pr.exerciseName === exerciseName);
    
    if (!existingPR || weight > existingPR.weight) {
      // Nuovo PR!
      const newPR = {
        exerciseName,
        weight,
        reps: typeof reps === 'number' ? reps : parseInt(String(reps)) || 0,
        date: today,
        timestamp: new Date().toISOString()
      };
      
      // Rimuovi vecchio record e aggiungi nuovo
      const updatedPRs = existingPRs.filter((pr: any) => pr.exerciseName !== exerciseName);
      updatedPRs.push(newPR);
      
      localStorage.setItem(prKey, JSON.stringify(updatedPRs));
      
      // Notifica visiva del PR (optional)
      console.log(`🔥 NUOVO PR! ${exerciseName}: ${weight}kg`);
    }
  };

  const toggleExercise = (exerciseId: string) => {
    if (!currentWorkout) return;

    const updatedWorkout = {
      ...currentWorkout,
      exercises: currentWorkout.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      ),
    };

    saveWorkout(updatedWorkout);
  };

  const updateExercise = (
    exerciseId: string,
    field: keyof WorkoutExercise,
    value: string | number | boolean
  ) => {
    if (!currentWorkout) return;

    const updatedWorkout = {
      ...currentWorkout,
      exercises: currentWorkout.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      ),
    };

    saveWorkout(updatedWorkout);

    // Salva PR se peso migliorato
    if (field === 'weight' && typeof value === 'number' && value > 0) {
      const exercise = updatedWorkout.exercises.find(
        (ex) => ex.id === exerciseId
      );
      if (exercise && exercise.reps) {
        savePotentialPR(exercise.name, value, exercise.reps);
      }
    }
  };

  const startRestTimer = (exerciseId: string, restTimeStr: string) => {
    setActiveExercise(exerciseId);
    // Parse rest time (es. "2min" -> 120, "90s" -> 90)
    let seconds = 0;
    if (restTimeStr.includes('min')) {
      seconds = parseInt(restTimeStr) * 60;
    } else if (restTimeStr.includes('s')) {
      seconds = parseInt(restTimeStr);
    }

    setRestTimer(seconds);
    setIsRestTimerRunning(true);
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

  const formatRestTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const completedCount =
    currentWorkout?.exercises.filter((ex) => ex.completed).length || 0;
  const totalCount = currentWorkout?.exercises.length || 0;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!currentWorkout) {
    return <div className="text-center py-8 text-white">Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header con Piano del Giorno */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-black">{todayPlan.name}</h2>
            <p className="text-blue-100 text-lg font-medium">
              {todayPlan.description}
            </p>
            <p className="text-sm opacity-90 mt-1">
              {formatDisplayDate(today)}
            </p>
          </div>

          <div className="text-right">
            <div className="text-4xl font-mono font-black mb-2">
              {formatTime(timer)}
            </div>
            <div className="flex space-x-2">
              {!isTimerRunning ? (
                <button
                  onClick={() => setIsTimerRunning(true)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all backdrop-blur-sm"
                >
                  ▶️ START
                </button>
              ) : (
                <button
                  onClick={() => setIsTimerRunning(false)}
                  className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg font-bold transition-all"
                >
                  ⏸️ PAUSE
                </button>
              )}
              <button
                onClick={() => {
                  setTimer(0);
                  setIsTimerRunning(false);
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all backdrop-blur-sm"
              >
                🔄 RESET
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm mt-2 opacity-90">
          <span>
            {completedCount} / {totalCount} esercizi
          </span>
          <span>{Math.round(progressPercentage)}% completato</span>
        </div>
      </div>

      {/* Rest Timer */}
      {isRestTimerRunning && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-2xl animate-pulse">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">⏳ REST TIME</h3>
            <div className="text-6xl font-mono font-black mb-2">
              {formatRestTime(restTimer)}
            </div>
            <button
              onClick={() => {
                setIsRestTimerRunning(false);
                setRestTimer(0);
              }}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all"
            >
              ⏭️ SKIP REST
            </button>
          </div>
        </div>
      )}

      {/* Exercises */}
      {todayPlan.exercises.length > 0 ? (
        <div className="space-y-4">
          {currentWorkout.exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
                exercise.completed
                  ? 'border-green-500/50 bg-green-500/10'
                  : activeExercise === exercise.id
                    ? 'border-orange-500/50 bg-orange-500/10 scale-[1.02]'
                    : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <button
                    onClick={() => toggleExercise(exercise.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all ${
                      exercise.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-400 text-gray-400 hover:border-green-400 hover:text-green-400'
                    }`}
                  >
                    {exercise.completed ? '✓' : index + 1}
                  </button>
                </div>

                <div className="flex-1">
                  <h4
                    className={`text-xl font-bold mb-2 ${
                      exercise.completed
                        ? 'line-through text-gray-500'
                        : 'text-white'
                    }`}
                  >
                    {exercise.name}
                  </h4>

                  {/* Exercise Details */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    {/* Sets */}
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <label className="text-xs text-gray-400 block mb-1">
                        SERIE
                      </label>
                      <input
                        type="number"
                        value={exercise.sets || ''}
                        onChange={(e) =>
                          updateExercise(
                            exercise.id,
                            'sets',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full bg-transparent text-white text-lg font-bold border-none outline-none"
                      />
                    </div>

                    {/* Reps */}
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <label className="text-xs text-gray-400 block mb-1">
                        REPS
                      </label>
                      <div className="text-white text-lg font-bold">
                        {exercise.targetReps || exercise.reps}
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <label className="text-xs text-gray-400 block mb-1">
                        PESO (KG)
                      </label>
                      <input
                        type="number"
                        value={exercise.weight || ''}
                        onChange={(e) =>
                          updateExercise(
                            exercise.id,
                            'weight',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full bg-transparent text-white text-lg font-bold border-none outline-none"
                        step="0.5"
                        placeholder="0"
                      />
                    </div>

                    {/* RIR */}
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <label className="text-xs text-gray-400 block mb-1">
                        RIR
                      </label>
                      <div className="text-white text-lg font-bold">
                        {exercise.rir || 'N/A'}
                      </div>
                    </div>

                    {/* Rest */}
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <label className="text-xs text-gray-400 block mb-1">
                        RIPOSO
                      </label>
                      <div className="flex items-center">
                        <span className="text-white text-sm font-bold mr-2">
                          {exercise.restTime || 'N/A'}
                        </span>
                        {exercise.restTime && exercise.restTime !== 'N/A' && (
                          <button
                            onClick={() =>
                              startRestTimer(exercise.id, exercise.restTime!)
                            }
                            className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded transition-all"
                          >
                            ⏱️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <label className="text-xs text-gray-400 block mb-1">
                      NOTE
                    </label>
                    <textarea
                      value={exercise.notes || ''}
                      onChange={(e) =>
                        updateExercise(exercise.id, 'notes', e.target.value)
                      }
                      placeholder="Aggiungi note sull'esecuzione, sensazioni, etc..."
                      className="w-full bg-transparent text-white placeholder-gray-500 border-none outline-none resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600 text-center">
          <div className="text-6xl mb-4">🛌</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            GIORNO DI RIPOSO
          </h3>
          <p className="text-gray-400">
            Oggi è il momento di recuperare. Fai stretching, rilassati o goditi
            una passeggiata!
          </p>
        </div>
      )}

      {/* Completion Message */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-2xl text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-3xl font-black mb-2">WORKOUT COMPLETATO!</h3>
          <p className="text-lg font-medium opacity-90">
            Hai dominato il tuo allenamento! Tempo totale: {formatTime(timer)}
          </p>
          <div className="mt-4">
            <button
              onClick={() => {
                setIsTimerRunning(false);
                if (currentWorkout) {
                  saveWorkout({
                    ...currentWorkout,
                    duration: timer,
                  });
                }
              }}
              className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all backdrop-blur-sm"
            >
              🎯 SALVA WORKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
