import { useState, useEffect } from 'react';
import { GamificationManager } from '../systems/gamification';

interface MealOption {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
}

interface DayProgress {
  date: string;
  selectedMeals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    postWorkout: boolean;
  };
  completedMeals: string[];
  cheats: Array<{
    id: string;
    meal: string;
    description: string;
    timestamp: string;
  }>;
  weight?: number;
  notes?: string;
}

interface LeanGainPhase {
  startDate: string;
  totalWeeks: 20;
  currentWeek: number;
  currentDay: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
  weeklyWeights: number[];
}

const BREAKFAST_OPTIONS: MealOption[] = [
  {
    id: 'breakfast_a',
    name: 'Anabolica Pulita',
    description: 'Il boost perfetto per iniziare da BESTIA',
    calories: 700,
    protein: 40,
    carbs: 85,
    fats: 20,
    ingredients: ['80g fiocchi d\'avena', '30g proteine vegetali/whey', '1 banana', '15g burro arachidi']
  },
  {
    id: 'breakfast_b',
    name: 'Uova & Carbo Intelligenti',
    description: 'Classico ma devastante',
    calories: 650,
    protein: 35,
    carbs: 60,
    fats: 30,
    ingredients: ['3 uova intere', '100g pane integrale', '1 frutto', '10g olio EVO']
  },
  {
    id: 'breakfast_c',
    name: 'Veloce ma Seria',
    description: 'Per quando hai fretta ma non scendi a compromessi',
    calories: 650,
    protein: 35,
    carbs: 90,
    fats: 20,
    ingredients: ['100g riso soffiato', '30g proteine vegetali', '20g frutta secca']
  }
];

const LUNCH_OPTIONS: MealOption[] = [
  {
    id: 'lunch_a',
    name: 'Classico da Crescita',
    description: 'Il pranzo che costruisce mostri',
    calories: 750,
    protein: 40,
    carbs: 95,
    fats: 20,
    ingredients: ['120g riso basmati (crudo)', '150g pollo/tacchino', 'Verdure libere', '15g olio EVO']
  },
  {
    id: 'lunch_b',
    name: 'Mediterraneo Intelligente',
    description: 'Italia meets gains',
    calories: 700,
    protein: 40,
    carbs: 80,
    fats: 20,
    ingredients: ['100g pasta integrale', '150g tonno/salmone', 'Verdure', '10g olio EVO']
  },
  {
    id: 'lunch_c',
    name: 'Plant-Based Solido',
    description: 'Vegetale ma devastante',
    calories: 700,
    protein: 30,
    carbs: 100,
    fats: 15,
    ingredients: ['120g riso jasmine', '200g legumi', '10g olio EVO']
  }
];

const DINNER_OPTIONS: MealOption[] = [
  {
    id: 'dinner_a',
    name: 'Costruzione Notturna',
    description: 'Cresci mentre dormi',
    calories: 650,
    protein: 40,
    carbs: 60,
    fats: 20,
    ingredients: ['200g pesce bianco/salmone', '300g patate', 'Verdure', '10g olio EVO']
  },
  {
    id: 'dinner_b',
    name: 'Carne Rossa Strategica',
    description: 'Power move serale',
    calories: 650,
    protein: 40,
    carbs: 65,
    fats: 20,
    ingredients: ['180g manzo magro', '80g riso', 'Verdure']
  },
  {
    id: 'dinner_c',
    name: 'Leggera ma Anabolica',
    description: 'Light ma efficace',
    calories: 600,
    protein: 45,
    carbs: 45,
    fats: 20,
    ingredients: ['3 uova + 150g albume', 'Verdure', '60g pane']
  }
];

const POST_WORKOUT = {
  id: 'post_workout',
  name: 'Post-Workout Power',
  description: 'Il carburante della vittoria',
  calories: 300,
  protein: 40,
  carbs: 50,
  fats: 2,
  ingredients: ['40g proteine whey/vegetali', '1 banana o 50g maltodestrine']
};

const MOTIVATIONAL_QUOTES = [
  "🔥 Ogni pasto è un mattone nella costruzione del TUO IMPERO!",
  "💪 La disciplina nella dieta separa i GUERRIERI dai sognatori!",
  "⚡ Stai alimentando la BESTIA che è dentro di te!",
  "🚀 Ogni caloria conta nel tuo viaggio verso la GRANDEZZA!",
  "👑 I RE non saltano mai i pasti - TU SEI UN RE!",
  "🎯 Precisione nella dieta = PRECISIONE nei risultati!",
  "🔥 La massa magra si costruisce un pasto alla volta!",
  "💎 La consistenza è il tuo SUPERPOTERE segreto!",
  "⚡ Ogni giorno perfetto ti avvicina alla LEGGENDA!",
  "🚀 Non stai solo mangiando - stai EVOLVENDO!"
];

export default function BeastModeDiet() {
  const [phase, setPhase] = useState<LeanGainPhase | null>(null);
  const [todayProgress, setTodayProgress] = useState<DayProgress | null>(null);
  const [showMealSelector, setShowMealSelector] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [showCheatForm, setShowCheatForm] = useState(false);
  const [cheatForm, setCheatForm] = useState({ meal: '', description: '' });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [todayQuote] = useState(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  useEffect(() => {
    initializePhase();
    loadTodayProgress();
    calculateStreak();
  }, []);

  const initializePhase = () => {
    const savedPhase = localStorage.getItem('lean_gain_phase');
    if (savedPhase) {
      setPhase(JSON.parse(savedPhase));
    } else {
      const newPhase: LeanGainPhase = {
        startDate: new Date().toISOString().split('T')[0],
        totalWeeks: 20,
        currentWeek: 1,
        currentDay: 1,
        targetCalories: 2850,
        targetProtein: 175,
        targetCarbs: 325,
        targetFats: 75,
        weeklyWeights: []
      };
      localStorage.setItem('lean_gain_phase', JSON.stringify(newPhase));
      setPhase(newPhase);
    }
  };

  const loadTodayProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    const savedProgress = localStorage.getItem(`diet_progress_${today}`);
    if (savedProgress) {
      setTodayProgress(JSON.parse(savedProgress));
    } else {
      const newProgress: DayProgress = {
        date: today,
        selectedMeals: {
          breakfast: '',
          lunch: '',
          dinner: '',
          postWorkout: false
        },
        completedMeals: [],
        cheats: []
      };
      setTodayProgress(newProgress);
    }
  };

  const saveProgress = (progress: DayProgress) => {
    localStorage.setItem(`diet_progress_${progress.date}`, JSON.stringify(progress));
    setTodayProgress(progress);
  };

  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 100; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];
      
      const dayProgress = localStorage.getItem(`diet_progress_${dateString}`);
      if (dayProgress) {
        const progress: DayProgress = JSON.parse(dayProgress);
        const totalMeals = Object.values(progress.selectedMeals).filter(meal => meal !== '').length;
        const completedMeals = progress.completedMeals.length;
        
        if (completedMeals >= totalMeals * 0.8 && totalMeals >= 3) {
          streak++;
        } else {
          break;
        }
      } else if (i === 0) {
        break;
      }
    }
    
    setCurrentStreak(streak);
  };

  const selectMeal = (mealType: 'breakfast' | 'lunch' | 'dinner', mealId: string) => {
    if (!todayProgress) return;
    
    const updatedProgress = {
      ...todayProgress,
      selectedMeals: {
        ...todayProgress.selectedMeals,
        [mealType]: mealId
      }
    };
    
    saveProgress(updatedProgress);
    setShowMealSelector(null);
    
    // Award XP for meal planning
    GamificationManager.awardXP('exercise_complete', 10);
  };

  const completeMeal = (mealType: string) => {
    if (!todayProgress) return;
    
    const updatedProgress = {
      ...todayProgress,
      completedMeals: [...todayProgress.completedMeals, mealType]
    };
    
    saveProgress(updatedProgress);
    calculateStreak();
    
    // Award XP for completing meal
    GamificationManager.awardXP('exercise_complete', 25);
    
    // Check for perfect day
    if (updatedProgress.completedMeals.length >= 4) {
      GamificationManager.awardXP('diet_perfect');
    }
  };

  const addCheat = () => {
    if (!todayProgress) return;
    
    const cheat = {
      id: Date.now().toString(),
      meal: cheatForm.meal,
      description: cheatForm.description,
      timestamp: new Date().toLocaleTimeString('it-IT')
    };
    
    const updatedProgress = {
      ...todayProgress,
      cheats: [...todayProgress.cheats, cheat]
    };
    
    saveProgress(updatedProgress);
    setCheatForm({ meal: '', description: '' });
    setShowCheatForm(false);
  };

  const getMealOptions = (type: 'breakfast' | 'lunch' | 'dinner') => {
    switch (type) {
      case 'breakfast': return BREAKFAST_OPTIONS;
      case 'lunch': return LUNCH_OPTIONS;
      case 'dinner': return DINNER_OPTIONS;
    }
  };

  const getSelectedMeal = (type: 'breakfast' | 'lunch' | 'dinner') => {
    if (!todayProgress) return null;
    const mealId = todayProgress.selectedMeals[type];
    return getMealOptions(type).find(meal => meal.id === mealId);
  };

  const getTotalMacros = () => {
    if (!todayProgress) return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    
    let total = { calories: 0, protein: 0, carbs: 0, fats: 0 };
    
    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
      const meal = getSelectedMeal(mealType as any);
      if (meal) {
        total.calories += meal.calories;
        total.protein += meal.protein;
        total.carbs += meal.carbs;
        total.fats += meal.fats;
      }
    });
    
    if (todayProgress.selectedMeals.postWorkout) {
      total.calories += POST_WORKOUT.calories;
      total.protein += POST_WORKOUT.protein;
      total.carbs += POST_WORKOUT.carbs;
      total.fats += POST_WORKOUT.fats;
    }
    
    return total;
  };

  const getCompletionPercentage = () => {
    if (!todayProgress) return 0;
    const plannedMeals = Object.values(todayProgress.selectedMeals).filter(meal => meal !== '').length;
    const completedMeals = todayProgress.completedMeals.length;
    return plannedMeals > 0 ? (completedMeals / plannedMeals) * 100 : 0;
  };

  const getDaysRemaining = () => {
    if (!phase) return 0;
    const startDate = new Date(phase.startDate);
    const today = new Date();
    const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, (phase.totalWeeks * 7) - daysPassed);
  };

  if (!phase || !todayProgress) return <div className="text-white">Caricamento...</div>;

  const totalMacros = getTotalMacros();
  const completionPercentage = getCompletionPercentage();
  const daysRemaining = getDaysRemaining();

  return (
    <div className="space-y-6">
      {/* Epic Header with Phase Info */}
      <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black mb-2">🔵 LEAN MASS GAIN PROTOCOL</h1>
              <p className="text-orange-100 text-lg font-bold">
                FASE 1 - Costruzione Pulita Dominante
              </p>
              <p className="text-sm opacity-90 mt-1">
                {new Date().toLocaleDateString('it-IT', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-5xl font-black text-yellow-300 mb-1">
                {daysRemaining}
              </div>
              <div className="text-lg font-bold">GIORNI RIMASTI</div>
              <div className="text-sm opacity-75">
                Settimana {phase.currentWeek}/20
              </div>
            </div>
          </div>

          {/* Strike Counter */}
          <div className="bg-black/30 rounded-xl p-4 mb-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🔥</div>
                <div>
                  <div className="text-2xl font-black text-yellow-400">
                    {currentStreak} GIORNI STRIKE
                  </div>
                  <div className="text-sm opacity-90">
                    Consecutivi di disciplina totale
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-4xl font-black text-green-400">
                  {Math.round(completionPercentage)}%
                </div>
                <div className="text-sm font-bold">OGGI</div>
              </div>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-3 border border-yellow-400/30">
            <p className="font-bold text-center text-yellow-100">
              {todayQuote}
            </p>
          </div>
        </div>
      </div>

      {/* Macros Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-xl font-bold text-white">{totalMacros.calories}</div>
          <div className="text-xs text-gray-400">CALORIE</div>
          <div className="text-xs text-green-400">Target: {phase.targetCalories}</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
          <div className="text-2xl mb-1">💪</div>
          <div className="text-xl font-bold text-blue-400">{totalMacros.protein}g</div>
          <div className="text-xs text-gray-400">PROTEINE</div>
          <div className="text-xs text-green-400">Target: {phase.targetProtein}g</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-xl font-bold text-yellow-400">{totalMacros.carbs}g</div>
          <div className="text-xs text-gray-400">CARBO</div>
          <div className="text-xs text-green-400">Target: {phase.targetCarbs}g</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
          <div className="text-2xl mb-1">🥑</div>
          <div className="text-xl font-bold text-purple-400">{totalMacros.fats}g</div>
          <div className="text-xs text-gray-400">GRASSI</div>
          <div className="text-xs text-green-400">Target: {phase.targetFats}g</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-xl font-bold text-red-400">{todayProgress.cheats.length}</div>
          <div className="text-xs text-gray-400">SGARRI</div>
          <div className="text-xs text-red-400">Oggi</div>
        </div>
      </div>

      {/* Meal Selection */}
      {['breakfast', 'lunch', 'dinner'].map((mealType) => (
        <div key={mealType} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="text-2xl mr-3">
                {mealType === 'breakfast' ? '🌅' : mealType === 'lunch' ? '🍽️' : '🌙'}
              </span>
              {mealType === 'breakfast' ? 'COLAZIONE' : mealType === 'lunch' ? 'PRANZO' : 'CENA'}
            </h3>
            
            <div className="flex space-x-2">
              {!getSelectedMeal(mealType as any) ? (
                <button
                  onClick={() => setShowMealSelector(mealType as any)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all"
                >
                  SCEGLI OPZIONE
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowMealSelector(mealType as any)}
                    className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold transition-all text-sm"
                  >
                    CAMBIA
                  </button>
                  {!todayProgress.completedMeals.includes(mealType) ? (
                    <button
                      onClick={() => completeMeal(mealType)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all"
                    >
                      ✅ COMPLETATO
                    </button>
                  ) : (
                    <div className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold">
                      ✅ FATTO!
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {getSelectedMeal(mealType as any) ? (
            <div className={`p-4 rounded-lg border-2 ${
              todayProgress.completedMeals.includes(mealType) 
                ? 'bg-green-500/20 border-green-500' 
                : 'bg-blue-500/20 border-blue-500'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-1">
                    {getSelectedMeal(mealType as any)!.name}
                  </h4>
                  <p className="text-gray-300 text-sm mb-3">
                    {getSelectedMeal(mealType as any)!.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-400">
                        {getSelectedMeal(mealType as any)!.calories}
                      </div>
                      <div className="text-xs text-gray-400">kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">
                        {getSelectedMeal(mealType as any)!.protein}g
                      </div>
                      <div className="text-xs text-gray-400">Prot</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">
                        {getSelectedMeal(mealType as any)!.carbs}g
                      </div>
                      <div className="text-xs text-gray-400">Carbo</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">
                        {getSelectedMeal(mealType as any)!.fats}g
                      </div>
                      <div className="text-xs text-gray-400">Grassi</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {getSelectedMeal(mealType as any)!.ingredients.map((ingredient, i) => (
                      <div key={i} className="text-sm text-gray-300 flex items-center">
                        <span className="text-green-400 mr-2">•</span>
                        {ingredient}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🍽️</div>
              <div className="font-semibold">Seleziona la tua opzione per {mealType}</div>
            </div>
          )}
        </div>
      ))}

      {/* Post-Workout */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="text-2xl mr-3">🥤</span>
            POST-WORKOUT
          </h3>
          
          <button
            onClick={() => {
              const updatedProgress = {
                ...todayProgress,
                selectedMeals: {
                  ...todayProgress.selectedMeals,
                  postWorkout: !todayProgress.selectedMeals.postWorkout
                }
              };
              saveProgress(updatedProgress);
            }}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              todayProgress.selectedMeals.postWorkout
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {todayProgress.selectedMeals.postWorkout ? '✅ INCLUSO' : '+ AGGIUNGI'}
          </button>
        </div>

        {todayProgress.selectedMeals.postWorkout && (
          <div className="p-4 bg-purple-500/20 border-2 border-purple-500 rounded-lg">
            <h4 className="text-lg font-bold text-white mb-1">{POST_WORKOUT.name}</h4>
            <p className="text-gray-300 text-sm mb-3">{POST_WORKOUT.description}</p>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-400">{POST_WORKOUT.calories}</div>
                <div className="text-xs text-gray-400">kcal</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">{POST_WORKOUT.protein}g</div>
                <div className="text-xs text-gray-400">Prot</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">{POST_WORKOUT.carbs}g</div>
                <div className="text-xs text-gray-400">Carbo</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">{POST_WORKOUT.fats}g</div>
                <div className="text-xs text-gray-400">Grassi</div>
              </div>
            </div>
            <div className="space-y-1">
              {POST_WORKOUT.ingredients.map((ingredient, i) => (
                <div key={i} className="text-sm text-gray-300 flex items-center">
                  <span className="text-purple-400 mr-2">•</span>
                  {ingredient}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Meal Selector Modal */}
      {showMealSelector && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                SCEGLI {showMealSelector.toUpperCase()}
              </h3>
              <button
                onClick={() => setShowMealSelector(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4">
              {getMealOptions(showMealSelector).map((meal) => (
                <div
                  key={meal.id}
                  className="p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:border-blue-500 transition-all cursor-pointer"
                  onClick={() => selectMeal(showMealSelector, meal.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-white">{meal.name}</h4>
                      <p className="text-gray-300 text-sm">{meal.description}</p>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-sm">
                      SCEGLI
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-400">{meal.calories}</div>
                      <div className="text-xs text-gray-400">kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{meal.protein}g</div>
                      <div className="text-xs text-gray-400">Prot</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">{meal.carbs}g</div>
                      <div className="text-xs text-gray-400">Carbo</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{meal.fats}g</div>
                      <div className="text-xs text-gray-400">Grassi</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {meal.ingredients.map((ingredient, i) => (
                      <div key={i} className="text-sm text-gray-300 flex items-center">
                        <span className="text-green-400 mr-2">•</span>
                        {ingredient}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cheats Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="text-2xl mr-3">🚨</span>
            SGARRI
          </h3>
          <button
            onClick={() => setShowCheatForm(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
          >
            + REGISTRA SGARRO
          </button>
        </div>

        {todayProgress.cheats.length > 0 ? (
          <div className="space-y-3">
            {todayProgress.cheats.map((cheat) => (
              <div key={cheat.id} className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-red-300">{cheat.meal}</div>
                    <div className="text-sm text-gray-400">{cheat.description}</div>
                    <div className="text-xs text-gray-500">{cheat.timestamp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <div className="text-4xl mb-2">💪</div>
            <div className="font-semibold">DISCIPLINA TOTALE OGGI!</div>
            <div className="text-sm">Continua così, sei una BESTIA!</div>
          </div>
        )}
      </div>

      {/* Cheat Form Modal */}
      {showCheatForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Registra Sgarro</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Tipo di sgarro</label>
                <input
                  type="text"
                  value={cheatForm.meal}
                  onChange={(e) => setCheatForm({ ...cheatForm, meal: e.target.value })}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
                  placeholder="es. Pizza, Gelato, Dolci..."
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Descrizione</label>
                <textarea
                  value={cheatForm.description}
                  onChange={(e) => setCheatForm({ ...cheatForm, description: e.target.value })}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
                  rows={3}
                  placeholder="Quanto e perché hai sgarrato?"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={addCheat}
                  disabled={!cheatForm.meal}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg font-bold"
                >
                  REGISTRA
                </button>
                <button
                  onClick={() => setShowCheatForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold"
                >
                  ANNULLA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}