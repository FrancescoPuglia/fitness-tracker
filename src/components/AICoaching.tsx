import { useState, useEffect } from 'react';
import { GamificationManager } from '../systems/gamification';

interface CoachingInsight {
  id: string;
  type: 'warning' | 'suggestion' | 'achievement' | 'motivation';
  category: 'workout' | 'diet' | 'recovery' | 'progression';
  title: string;
  message: string;
  actionable: boolean;
  action?: string;
  urgency: 'low' | 'medium' | 'high';
  timestamp: string;
}

interface UserAnalytics {
  workoutFrequency: number;
  averageWorkoutDuration: number;
  consistencyScore: number;
  progressionRate: number;
  recoveryDays: number;
  prCount: number;
  strongestMuscleGroup: string;
  weakestMuscleGroup: string;
  lastWorkoutDate: string;
  totalWorkouts: number;
}

export default function AICoaching() {
  const [insights, setInsights] = useState<CoachingInsight[]>([]);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    generateInsights();
    calculateAnalytics();
  }, []);

  const generateInsights = () => {
    const stats = GamificationManager.getPlayerStats();
    const workoutData = getWorkoutAnalytics();
    const newInsights: CoachingInsight[] = [];

    // 1. Consistency Analysis
    if (stats.currentStreak === 0) {
      newInsights.push({
        id: 'consistency_warning',
        type: 'warning',
        category: 'workout',
        title: 'Streak interrotto!',
        message: 'La tua serie di allenamenti si è interrotta. Ricorda che la consistenza è la chiave del successo. Anche 15 minuti di movimento fanno la differenza!',
        actionable: true,
        action: 'Inizia un quick workout oggi',
        urgency: 'high',
        timestamp: new Date().toISOString(),
      });
    } else if (stats.currentStreak >= 7) {
      newInsights.push({
        id: 'streak_achievement',
        type: 'achievement',
        category: 'workout',
        title: `Streak fantastico: ${stats.currentStreak} giorni!`,
        message: 'Stai mantenendo un ritmo eccellente! La consistenza che mostri è quella dei veri campioni. Continua così!',
        actionable: false,
        urgency: 'low',
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Progression Analysis
    if (stats.totalPRs === 0 && stats.totalWorkouts > 5) {
      newInsights.push({
        id: 'progression_warning',
        type: 'warning',
        category: 'progression',
        title: 'Nessun Record Personale',
        message: 'Hai completato diversi allenamenti ma non hai ancora registrato record personali. Prova ad aumentare gradualmente i carichi per stimolare la crescita.',
        actionable: true,
        action: 'Aumenta del 5% il peso nell\'esercizio più forte',
        urgency: 'medium',
        timestamp: new Date().toISOString(),
      });
    } else if (stats.totalPRs > 0) {
      const prRate = stats.totalPRs / Math.max(stats.totalWorkouts, 1);
      if (prRate > 0.3) {
        newInsights.push({
          id: 'progression_excellent',
          type: 'achievement',
          category: 'progression',
          title: 'Progressi straordinari!',
          message: `Con ${stats.totalPRs} record personali in ${stats.totalWorkouts} allenamenti, stai progredendo a un ritmo fantastico! I tuoi muscoli si stanno adattando perfettamente.`,
          actionable: false,
          urgency: 'low',
          timestamp: new Date().toISOString(),
        });
      }
    }

    // 3. Recovery Analysis
    const lastWorkoutDays = getLastWorkoutDays();
    if (lastWorkoutDays === 1) {
      newInsights.push({
        id: 'recovery_suggestion',
        type: 'suggestion',
        category: 'recovery',
        title: 'Considera un giorno di riposo',
        message: 'Ti alleni da ieri. Se senti affaticamento, considera stretching, yoga o una passeggiata leggera per il recovery attivo.',
        actionable: true,
        action: 'Fai 15 min di stretching',
        urgency: 'low',
        timestamp: new Date().toISOString(),
      });
    } else if (lastWorkoutDays > 3) {
      newInsights.push({
        id: 'comeback_motivation',
        type: 'motivation',
        category: 'workout',
        title: 'È ora di tornare in azione!',
        message: `Sono passati ${lastWorkoutDays} giorni dal tuo ultimo allenamento. I tuoi muscoli ti stanno aspettando! Anche un workout leggero può riaccendere la motivazione.`,
        actionable: true,
        action: 'Pianifica un workout per oggi',
        urgency: 'medium',
        timestamp: new Date().toISOString(),
      });
    }

    // 4. Workout Quality Analysis
    if (workoutData.averageCompletion < 0.7) {
      newInsights.push({
        id: 'completion_warning',
        type: 'warning',
        category: 'workout',
        title: 'Completamento workout basso',
        message: `In media completi solo il ${Math.round(workoutData.averageCompletion * 100)}% degli esercizi. Prova a ridurre il volume o l'intensità per completare tutti gli esercizi.`,
        actionable: true,
        action: 'Riduci di 1 serie ogni esercizio',
        urgency: 'medium',
        timestamp: new Date().toISOString(),
      });
    }

    // 5. Variety Analysis
    const exerciseVariety = analyzeExerciseVariety();
    if (exerciseVariety.dominantMuscleGroup && exerciseVariety.percentage > 0.6) {
      newInsights.push({
        id: 'variety_suggestion',
        type: 'suggestion',
        category: 'workout',
        title: 'Più varietà muscolare',
        message: `Il ${Math.round(exerciseVariety.percentage * 100)}% dei tuoi allenamenti si concentra su ${exerciseVariety.dominantMuscleGroup}. Bilancia con altri gruppi muscolari per uno sviluppo armonico.`,
        actionable: true,
        action: 'Aggiungi esercizi per gambe/dorso',
        urgency: 'low',
        timestamp: new Date().toISOString(),
      });
    }

    // 6. Level & XP Motivation
    if (stats.currentLevel < 5) {
      newInsights.push({
        id: 'level_motivation',
        type: 'motivation',
        category: 'progression',
        title: `Livello ${stats.currentLevel} - In crescita!`,
        message: `Ti servono solo ${stats.xpToNextLevel} XP per il prossimo livello! Completa un allenamento (+50 XP) o stabilisci un nuovo record (+100 XP).`,
        actionable: true,
        action: 'Guadagna XP con un nuovo PR',
        urgency: 'low',
        timestamp: new Date().toISOString(),
      });
    }

    // 7. Motivational Quotes Integration
    const motivationalInsight = getMotivationalInsight();
    if (motivationalInsight) {
      newInsights.push(motivationalInsight);
    }

    setInsights(newInsights.slice(0, 10)); // Limit to 10 most relevant insights
  };

  const getWorkoutAnalytics = () => {
    const workouts = [];
    let totalCompletion = 0;
    let completedWorkouts = 0;

    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const workoutData = localStorage.getItem(`workout_${dateString}`);
      
      if (workoutData) {
        try {
          const workout = JSON.parse(workoutData);
          if (workout.exercises && workout.exercises.length > 0) {
            const completion = workout.exercises.filter((ex: any) => ex.completed).length / workout.exercises.length;
            totalCompletion += completion;
            completedWorkouts++;
            workouts.push({ date: dateString, completion, ...workout });
          }
        } catch (e) {
          // Skip corrupted data
        }
      }
    }

    return {
      workouts,
      averageCompletion: completedWorkouts > 0 ? totalCompletion / completedWorkouts : 0,
      totalWorkouts: completedWorkouts,
    };
  };

  const getLastWorkoutDays = (): number => {
    for (let i = 0; i <= 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const workoutData = localStorage.getItem(`workout_${dateString}`);
      
      if (workoutData) {
        try {
          const workout = JSON.parse(workoutData);
          if (workout.exercises && workout.exercises.some((ex: any) => ex.completed)) {
            return i;
          }
        } catch (e) {
          continue;
        }
      }
    }
    return 31; // More than 30 days
  };

  const analyzeExerciseVariety = () => {
    const muscleGroups: Record<string, number> = {};
    let totalExercises = 0;

    for (let i = 14; i >= 0; i--) { // Last 2 weeks
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const workoutData = localStorage.getItem(`workout_${dateString}`);
      
      if (workoutData) {
        try {
          const workout = JSON.parse(workoutData);
          if (workout.exercises) {
            workout.exercises.forEach((ex: any) => {
              const muscle = categorizeExercise(ex.name);
              muscleGroups[muscle] = (muscleGroups[muscle] || 0) + 1;
              totalExercises++;
            });
          }
        } catch (e) {
          continue;
        }
      }
    }

    const dominantMuscle = Object.entries(muscleGroups).reduce((a, b) => 
      muscleGroups[a[0]] > muscleGroups[b[0]] ? a : b, ['', 0]
    );

    return {
      dominantMuscleGroup: dominantMuscle[0],
      percentage: totalExercises > 0 ? dominantMuscle[1] / totalExercises : 0,
      distribution: muscleGroups,
    };
  };

  const categorizeExercise = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('panca') || lowerName.includes('petto') || lowerName.includes('dip')) return 'Petto';
    if (lowerName.includes('traz') || lowerName.includes('rematore') || lowerName.includes('lat')) return 'Dorso';
    if (lowerName.includes('squat') || lowerName.includes('leg') || lowerName.includes('affondi')) return 'Gambe';
    if (lowerName.includes('spall') || lowerName.includes('lateral') || lowerName.includes('military')) return 'Spalle';
    if (lowerName.includes('curl') || lowerName.includes('tricip') || lowerName.includes('french')) return 'Braccia';
    return 'Altro';
  };

  const getMotivationalInsight = (): CoachingInsight | null => {
    const motivationalMessages = [
      {
        title: 'Mentalità da campione',
        message: 'I campioni non si costruiscono in palestra. Si costruiscono dal profondo: dalla volontà, dal sogno e dalla visione. - Muhammad Ali',
      },
      {
        title: 'La disciplina batte il talento',
        message: 'La disciplina è fare quello che odi di fare, ma farlo come se lo amassi. - Mike Tyson',
      },
      {
        title: 'Crescita continua',
        message: 'Non si tratta di essere perfetti, si tratta di essere migliori di ieri.',
      },
      {
        title: 'Forza mentale',
        message: 'Il corpo raggiunge quello che la mente crede. Visualizza il successo e rendilo realtà.',
      },
    ];

    const random = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    return {
      id: 'daily_motivation',
      type: 'motivation',
      category: 'workout',
      title: random.title,
      message: random.message,
      actionable: false,
      urgency: 'low',
      timestamp: new Date().toISOString(),
    };
  };

  const calculateAnalytics = () => {
    const workoutAnalytics = getWorkoutAnalytics();
    const stats = GamificationManager.getPlayerStats();
    
    const analytics: UserAnalytics = {
      workoutFrequency: workoutAnalytics.totalWorkouts / 4, // Per week over last month
      averageWorkoutDuration: 45, // Placeholder - could be calculated from actual data
      consistencyScore: Math.min((stats.currentStreak / 30) * 100, 100),
      progressionRate: stats.totalPRs / Math.max(stats.totalWorkouts, 1),
      recoveryDays: getLastWorkoutDays(),
      prCount: stats.totalPRs,
      strongestMuscleGroup: 'Petto', // Placeholder
      weakestMuscleGroup: 'Gambe', // Placeholder  
      lastWorkoutDate: new Date().toISOString(),
      totalWorkouts: stats.totalWorkouts,
    };

    setAnalytics(analytics);
  };

  const getInsightIcon = (type: CoachingInsight['type']) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'suggestion': return '💡';
      case 'achievement': return '🏆';
      case 'motivation': return '🔥';
    }
  };

  const getInsightColor = (type: CoachingInsight['type'], urgency: CoachingInsight['urgency']) => {
    if (urgency === 'high') return 'border-red-500 bg-red-500/10';
    if (urgency === 'medium') return 'border-yellow-500 bg-yellow-500/10';
    
    switch (type) {
      case 'warning': return 'border-red-500/50 bg-red-500/5';
      case 'suggestion': return 'border-blue-500/50 bg-blue-500/5';
      case 'achievement': return 'border-green-500/50 bg-green-500/5';
      case 'motivation': return 'border-purple-500/50 bg-purple-500/5';
    }
  };

  const getUrgencyLabel = (urgency: CoachingInsight['urgency']) => {
    switch (urgency) {
      case 'high': return { label: 'URGENTE', color: 'text-red-400' };
      case 'medium': return { label: 'IMPORTANTE', color: 'text-yellow-400' };
      case 'low': return { label: 'INFO', color: 'text-gray-400' };
    }
  };

  const categories = [
    { id: 'all', name: 'Tutti', icon: '🎯' },
    { id: 'workout', name: 'Allenamento', icon: '💪' },
    { id: 'diet', name: 'Dieta', icon: '🥗' },
    { id: 'recovery', name: 'Recupero', icon: '😴' },
    { id: 'progression', name: 'Progressi', icon: '📈' },
  ];

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-6 text-white shadow-2xl">
        <h2 className="text-3xl font-black mb-2">🤖 AI COACH</h2>
        <p className="text-purple-100 text-lg font-medium">
          Analisi intelligente e consigli personalizzati
        </p>
      </div>

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-white">{analytics.workoutFrequency.toFixed(1)}</div>
            <div className="text-gray-400 text-sm">Workout/Settimana</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-blue-400">{Math.round(analytics.consistencyScore)}%</div>
            <div className="text-gray-400 text-sm">Consistenza</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-green-400">{(analytics.progressionRate * 100).toFixed(1)}%</div>
            <div className="text-gray-400 text-sm">Rate Progressione</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
            <div className="text-3xl mb-2">💤</div>
            <div className="text-2xl font-bold text-purple-400">{analytics.recoveryDays}</div>
            <div className="text-gray-400 text-sm">Giorni da Ultimo</div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500 hover:text-white'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-4">
        <h3 className="text-white font-bold text-xl flex items-center">
          <span className="mr-2">🧠</span>
          INSIGHTS PERSONALIZZATI ({filteredInsights.length})
        </h3>
        
        {filteredInsights.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-600 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2">Tutto sotto controllo!</h3>
            <p className="text-gray-400">
              Il tuo Coach AI non ha trovato aree critiche da migliorare. Continua così!
            </p>
          </div>
        ) : (
          filteredInsights.map((insight) => {
            const urgencyInfo = getUrgencyLabel(insight.urgency);
            
            return (
              <div
                key={insight.id}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border-2 transition-all hover:scale-[1.01] ${getInsightColor(insight.type, insight.urgency)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getInsightIcon(insight.type)}</span>
                    <div>
                      <h4 className="text-white font-bold text-lg">{insight.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs font-bold ${urgencyInfo.color}`}>
                          {urgencyInfo.label}
                        </span>
                        <span className="text-gray-500 text-xs">•</span>
                        <span className="text-gray-400 text-xs capitalize">{insight.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-gray-500 text-xs">
                    {new Date(insight.timestamp).toLocaleDateString('it-IT')}
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed mb-4">{insight.message}</p>

                {insight.actionable && insight.action && (
                  <div className="bg-black/20 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white font-medium mb-1">💡 Azione Consigliata</h5>
                        <p className="text-blue-300 text-sm">{insight.action}</p>
                      </div>
                      <button 
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
                        onClick={() => {
                          // Here you could trigger specific actions based on the insight
                          console.log('Action triggered:', insight.action);
                        }}
                      >
                        Applica
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
        <h3 className="text-white font-bold text-xl mb-4 flex items-center">
          <span className="mr-2">⚡</span>
          AZIONI RAPIDE COACH AI
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={generateInsights}
            className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold transition-all transform hover:scale-105"
          >
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-sm">RIGENERA INSIGHTS</div>
          </button>
          
          <button 
            onClick={calculateAnalytics}
            className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all transform hover:scale-105"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm">ANALIZZA PROGRESSI</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all transform hover:scale-105">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-sm">CHAT CON AI</div>
          </button>
        </div>
      </div>
    </div>
  );
}