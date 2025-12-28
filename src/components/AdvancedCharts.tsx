import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Line, Doughnut, Radar, Pie } from 'react-chartjs-2';
import { GamificationManager } from '../systems/gamification';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

interface ChartData {
  workoutProgress: any;
  strengthProgress: any;
  weeklyActivity: any;
  exerciseDistribution: any;
  streakAnalysis: any;
  levelProgress: any;
  prProgress: any;
  monthlyCompletion: any;
}

export default function AdvancedCharts() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedChart, setSelectedChart] = useState<string>('workout');

  useEffect(() => {
    generateChartData();
  }, []);

  const generateChartData = () => {
    const stats = GamificationManager.getPlayerStats();
    
    const data: ChartData = {
      // 1. Workout Progress Over Time (Line Chart)
      workoutProgress: {
        labels: getLast30Days(),
        datasets: [
          {
            label: 'Workout Completions',
            data: getWorkoutCompletionData(),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderWidth: 3,
            fill: true,
          },
        ],
      },

      // 2. Strength Progress (Multi-line Chart)
      strengthProgress: {
        labels: getLast12Weeks(),
        datasets: [
          {
            label: 'Panca Piana (kg)',
            data: getExerciseProgressData('Panca inclinata bilanciere'),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          },
          {
            label: 'Squat (kg)',
            data: getExerciseProgressData('Squat'),
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
          },
          {
            label: 'Stacco (kg)',
            data: getExerciseProgressData('Stacco rumeno (RDL)'),
            borderColor: 'rgb(245, 158, 11)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
          },
        ],
      },

      // 3. Weekly Activity Heatmap (Bar Chart)
      weeklyActivity: {
        labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
        datasets: [
          {
            label: 'Allenamenti Completati',
            data: getWeeklyActivityData(),
            backgroundColor: [
              'rgba(239, 68, 68, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(236, 72, 153, 0.8)',
              'rgba(34, 197, 94, 0.8)',
            ],
            borderColor: [
              'rgba(239, 68, 68, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(139, 92, 246, 1)',
              'rgba(236, 72, 153, 1)',
              'rgba(34, 197, 94, 1)',
            ],
            borderWidth: 2,
          },
        ],
      },

      // 4. Exercise Type Distribution (Doughnut Chart)
      exerciseDistribution: {
        labels: ['Petto', 'Dorso', 'Gambe', 'Spalle', 'Braccia'],
        datasets: [
          {
            label: 'Esercizi per gruppo muscolare',
            data: getExerciseDistributionData(),
            backgroundColor: [
              'rgba(239, 68, 68, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(139, 92, 246, 0.8)',
            ],
            borderColor: [
              'rgba(239, 68, 68, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(139, 92, 246, 1)',
            ],
            borderWidth: 2,
          },
        ],
      },

      // 5. Streak Analysis (Radar Chart)
      streakAnalysis: {
        labels: ['Consistenza', 'Intensità', 'Varietà', 'Progressione', 'Disciplina'],
        datasets: [
          {
            label: 'Performance Metrics',
            data: getRadarData(stats),
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 2,
          },
        ],
      },

      // 6. Level Progress (Bar Chart)
      levelProgress: {
        labels: ['XP Guadagnati', 'XP Rimanenti', 'Livelli Completati'],
        datasets: [
          {
            label: 'Progressi di Livello',
            data: [
              stats.totalXP,
              stats.xpToNextLevel,
              stats.currentLevel,
            ],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(107, 114, 128, 0.8)',
              'rgba(245, 158, 11, 0.8)',
            ],
          },
        ],
      },

      // 7. PR Progress (Line Chart)
      prProgress: {
        labels: getLast6Months(),
        datasets: [
          {
            label: 'Record Personali',
            data: getPRProgressData(),
            borderColor: 'rgb(245, 158, 11)',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            borderWidth: 3,
            fill: true,
          },
        ],
      },

      // 8. Monthly Completion Rate (Pie Chart)
      monthlyCompletion: {
        labels: ['Completati', 'Saltati', 'Parziali'],
        datasets: [
          {
            data: getMonthlyCompletionData(),
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(245, 158, 11, 0.8)',
            ],
            borderColor: [
              'rgba(34, 197, 94, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(245, 158, 11, 1)',
            ],
            borderWidth: 2,
          },
        ],
      },
    };

    setChartData(data);
  };

  // Data generation functions
  const getWorkoutDataFromStorage = () => {
    const workouts = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const workoutData = localStorage.getItem(`workout_${dateString}`);
      if (workoutData) {
        try {
          workouts.push({ date: dateString, ...JSON.parse(workoutData) });
        } catch (e) {
          // Skip corrupted data
        }
      }
    }
    return workouts;
  };

  const getPRDataFromStorage = () => {
    const prData = localStorage.getItem('personal_records');
    return prData ? JSON.parse(prData) : [];
  };

  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('it-IT', { month: 'short', day: 'numeric' }));
    }
    return days;
  };

  const getLast12Weeks = () => {
    const weeks = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      weeks.push(`Sett ${12 - i}`);
    }
    return weeks;
  };

  const getLast6Months = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toLocaleDateString('it-IT', { month: 'short' }));
    }
    return months;
  };

  const getWorkoutCompletionData = () => {
    const workouts = getWorkoutDataFromStorage();
    const completionData = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const workout = workouts.find(w => w.date === dateString);
      if (workout && workout.exercises) {
        const completedExercises = workout.exercises.filter((ex: any) => ex.completed).length;
        const totalExercises = workout.exercises.length;
        completionData.push(totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0);
      } else {
        completionData.push(0);
      }
    }
    
    return completionData;
  };

  const getExerciseProgressData = (exerciseName: string) => {
    const prData = getPRDataFromStorage();
    const exercisePRs = prData.filter((pr: any) => pr.exerciseName.includes(exerciseName.split(' ')[0]));
    
    // Generate sample progression data
    const progression = [];
    for (let i = 11; i >= 0; i--) {
      const baseWeight = exercisePRs.length > 0 ? exercisePRs[0].weight : 60;
      progression.push(baseWeight + Math.floor(Math.random() * 20) - 10);
    }
    return progression;
  };

  const getWeeklyActivityData = () => {
    const workouts = getWorkoutDataFromStorage();
    const weeklyData = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
    
    workouts.forEach(workout => {
      if (workout.exercises) {
        const date = new Date(workout.date);
        const dayOfWeek = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
        const completionRate = workout.exercises.filter((ex: any) => ex.completed).length / workout.exercises.length;
        weeklyData[dayOfWeek] += completionRate;
      }
    });
    
    return weeklyData.map(count => Math.round(count * 100) / 100);
  };

  const getExerciseDistributionData = () => {
    const workouts = getWorkoutDataFromStorage();
    const distribution = [0, 0, 0, 0, 0]; // Petto, Dorso, Gambe, Spalle, Braccia
    
    workouts.forEach(workout => {
      if (workout.exercises) {
        workout.exercises.forEach((ex: any) => {
          if (ex.name.toLowerCase().includes('panca') || ex.name.toLowerCase().includes('petto')) {
            distribution[0]++;
          } else if (ex.name.toLowerCase().includes('traz') || ex.name.toLowerCase().includes('dorso')) {
            distribution[1]++;
          } else if (ex.name.toLowerCase().includes('squat') || ex.name.toLowerCase().includes('gamb')) {
            distribution[2]++;
          } else if (ex.name.toLowerCase().includes('spall') || ex.name.toLowerCase().includes('lateral')) {
            distribution[3]++;
          } else if (ex.name.toLowerCase().includes('curl') || ex.name.toLowerCase().includes('tricip')) {
            distribution[4]++;
          }
        });
      }
    });
    
    return distribution;
  };

  const getRadarData = (stats: any) => {
    return [
      Math.min((stats.currentStreak / 30) * 100, 100), // Consistenza
      Math.min((stats.totalPRs / 20) * 100, 100), // Intensità
      Math.min((stats.totalWorkouts / 50) * 100, 100), // Varietà
      Math.min((stats.currentLevel / 10) * 100, 100), // Progressione
      Math.min((stats.longestStreak / 50) * 100, 100), // Disciplina
    ];
  };

  const getPRProgressData = () => {
    const prData = getPRDataFromStorage();
    const monthlyPRs = [0, 0, 0, 0, 0, 0];
    
    prData.forEach((pr: any) => {
      const prDate = new Date(pr.date);
      const monthsAgo = Math.floor((Date.now() - prDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
      if (monthsAgo >= 0 && monthsAgo < 6) {
        monthlyPRs[5 - monthsAgo]++;
      }
    });
    
    return monthlyPRs;
  };

  const getMonthlyCompletionData = () => {
    const workouts = getWorkoutDataFromStorage();
    const thisMonth = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const now = new Date();
      return workoutDate.getMonth() === now.getMonth() && workoutDate.getFullYear() === now.getFullYear();
    });
    
    let completed = 0, partial = 0, skipped = 0;
    
    thisMonth.forEach(workout => {
      if (workout.exercises && workout.exercises.length > 0) {
        const completionRate = workout.exercises.filter((ex: any) => ex.completed).length / workout.exercises.length;
        if (completionRate === 1) completed++;
        else if (completionRate > 0) partial++;
        else skipped++;
      }
    });
    
    return [completed, skipped, partial];
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(255, 255, 255)',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'rgb(255, 255, 255)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(255, 255, 255)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'rgb(255, 255, 255)',
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        pointLabels: {
          color: 'rgb(255, 255, 255)',
        },
        ticks: {
          color: 'rgb(255, 255, 255)',
          backdropColor: 'transparent',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'rgb(255, 255, 255)',
        },
      },
    },
  };

  const charts = [
    { id: 'workout', name: 'Progresso Workout', icon: '📈' },
    { id: 'strength', name: 'Forza & PR', icon: '💪' },
    { id: 'weekly', name: 'Attività Settimanale', icon: '📊' },
    { id: 'distribution', name: 'Distribuzione Esercizi', icon: '🎯' },
    { id: 'radar', name: 'Performance Radar', icon: '🎮' },
    { id: 'level', name: 'Progressi XP', icon: '🏆' },
    { id: 'pr', name: 'Record Mensili', icon: '🔥' },
    { id: 'completion', name: 'Tasso Completamento', icon: '✅' },
  ];

  if (!chartData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-xl">Caricamento grafici... 📊</div>
      </div>
    );
  }

  const renderChart = () => {
    switch (selectedChart) {
      case 'workout':
        return <Line data={chartData.workoutProgress} options={chartOptions} />;
      case 'strength':
        return <Line data={chartData.strengthProgress} options={chartOptions} />;
      case 'weekly':
        return <Bar data={chartData.weeklyActivity} options={chartOptions} />;
      case 'distribution':
        return <Doughnut data={chartData.exerciseDistribution} options={pieOptions} />;
      case 'radar':
        return <Radar data={chartData.streakAnalysis} options={radarOptions} />;
      case 'level':
        return <Bar data={chartData.levelProgress} options={chartOptions} />;
      case 'pr':
        return <Line data={chartData.prProgress} options={chartOptions} />;
      case 'completion':
        return <Pie data={chartData.monthlyCompletion} options={pieOptions} />;
      default:
        return <Line data={chartData.workoutProgress} options={chartOptions} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Selector */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
        <h3 className="text-white font-bold text-xl mb-4 flex items-center">
          <span className="mr-2">📊</span>
          ANALYTICS DASHBOARD
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {charts.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setSelectedChart(chart.id)}
              className={`p-3 rounded-lg border transition-all ${
                selectedChart === chart.id
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500 hover:text-white'
              }`}
            >
              <div className="text-2xl mb-1">{chart.icon}</div>
              <div className="text-sm font-medium">{chart.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
        <div className="h-96">
          {renderChart()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold">{GamificationManager.getPlayerStats().totalXP.toLocaleString()}</div>
          <div className="text-sm opacity-90">XP Totali</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-white">
          <div className="text-3xl mb-2">💪</div>
          <div className="text-2xl font-bold">{getWorkoutDataFromStorage().length}</div>
          <div className="text-sm opacity-90">Workout Tracciati</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-6 text-white">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-2xl font-bold">{getPRDataFromStorage().length}</div>
          <div className="text-sm opacity-90">Record Personali</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold">{GamificationManager.getPlayerStats().currentStreak}</div>
          <div className="text-sm opacity-90">Giorni Consecutivi</div>
        </div>
      </div>
    </div>
  );
}