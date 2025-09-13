import { useState, useEffect } from 'react';

interface DashboardProps {
  currentQuote: {
    quote: string;
    author: string;
    image: string;
  };
}

export default function Dashboard({ currentQuote }: DashboardProps) {
  const [streak] = useState(7); // Mock data - will be real later
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Timer per workout
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Aggiorna ora ogni secondo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDayName = (): string => {
    const days: Record<number, string> = {
      0: 'Domenica', 1: 'Lunedì', 2: 'Martedì', 3: 'Mercoledì', 
      4: 'Giovedì', 5: 'Venerdì', 6: 'Sabato'
    };
    return days[currentTime.getDay()];
  };

  const getWorkoutPlan = (): string => {
    const plans: Record<number, string> = {
      0: '🛌 RIPOSO - Recovery Day',
      1: '🔥 PETTO + BICIPITI - Chest & Biceps Power',
      2: '💪 DORSO + TRICIPITI + COLLO - Back & Triceps Beast',
      3: '🦵 GAMBE COMPLETE - Leg Destruction Day',
      4: '🚶 RECUPERO ATTIVO - Active Recovery',
      5: '👑 SPALLE + COLLO - Shoulder Domination',
      6: '🔥 POSTERIORI + CONDITIONING - Posterior Chain'
    };
    return plans[currentTime.getDay()];
  };

  return (
    <div className="space-y-6">
      {/* Hero Section con Quote Motivazionale */}
      <div 
        className="relative h-96 rounded-3xl overflow-hidden shadow-2xl"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url(${currentQuote.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
          <div className="mb-6">
            <h2 className="text-white text-sm font-medium opacity-80 mb-2">
              {getDayName().toUpperCase()}
            </h2>
            <div className="text-white text-6xl font-bold">
              {currentTime.toLocaleTimeString('it-IT', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
          
          <blockquote className="text-white text-2xl md:text-3xl font-bold mb-4 max-w-4xl leading-tight">
            "{currentQuote.quote}"
          </blockquote>
          <cite className="text-yellow-400 text-xl font-semibold">
            — {currentQuote.author}
          </cite>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak Counter */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">STREAK</h3>
            <span className="text-3xl">🔥</span>
          </div>
          <div className="text-center">
            <div className="text-6xl font-black mb-2">{streak}</div>
            <div className="text-lg font-medium opacity-90">
              Giorni Consecutivi
            </div>
            <div className="text-sm opacity-75 mt-1">
              Keep the fire burning! 🚀
            </div>
          </div>
        </div>

        {/* Workout Timer */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">TIMER</h3>
            <span className="text-3xl">⏱️</span>
          </div>
          <div className="text-center">
            <div className="text-4xl font-mono font-black mb-4">
              {formatTime(workoutTime)}
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  isTimerRunning
                    ? 'bg-white/20 hover:bg-white/30'
                    : 'bg-white text-orange-600 hover:bg-gray-100'
                }`}
              >
                {isTimerRunning ? '⏸️ PAUSE' : '▶️ START'}
              </button>
              <button
                onClick={() => {
                  setWorkoutTime(0);
                  setIsTimerRunning(false);
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all"
              >
                🔄 RESET
              </button>
            </div>
          </div>
        </div>

        {/* Today's Plan */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">TODAY</h3>
            <span className="text-3xl">💪</span>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold mb-2">
              {getWorkoutPlan()}
            </div>
            <div className="text-sm opacity-90">
              Ready to dominate? 💯
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <h3 className="text-white text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">⚡</span>
          QUICK ACTIONS
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl p-4 font-bold transition-all transform hover:scale-105 shadow-lg">
            <div className="text-2xl mb-2">🏋️</div>
            <div className="text-sm">START WORKOUT</div>
          </button>
          <button className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl p-4 font-bold transition-all transform hover:scale-105 shadow-lg">
            <div className="text-2xl mb-2">🍽️</div>
            <div className="text-sm">LOG MEAL</div>
          </button>
          <button className="bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl p-4 font-bold transition-all transform hover:scale-105 shadow-lg">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm">VIEW STATS</div>
          </button>
          <button className="bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl p-4 font-bold transition-all transform hover:scale-105 shadow-lg">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm">SET GOALS</div>
          </button>
        </div>
      </div>

      {/* Progress Rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 text-center">
          <h4 className="text-white font-bold mb-4">WEEKLY PROGRESS</h4>
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
              />
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="75, 100"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">75%</span>
            </div>
          </div>
          <div className="text-gray-300 text-sm mt-2">5/7 workouts</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 text-center">
          <h4 className="text-white font-bold mb-4">DIET COMPLIANCE</h4>
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
              />
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray="88, 100"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">88%</span>
            </div>
          </div>
          <div className="text-gray-300 text-sm mt-2">Great discipline!</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 text-center">
          <h4 className="text-white font-bold mb-4">MONTHLY GOAL</h4>
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
              />
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="65, 100"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">65%</span>
            </div>
          </div>
          <div className="text-gray-300 text-sm mt-2">13/20 workouts</div>
        </div>
      </div>
    </div>
  );
}