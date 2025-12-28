import { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { GamificationManager } from '../systems/gamification';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface RecoverySession {
  id: string;
  type: 'sauna' | 'steam' | 'ice';
  duration: number;
  temperature?: number;
  notes: string;
  date: string;
  completed: boolean;
}

interface RecoveryAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: string;
}

interface TimerState {
  minutes: number;
  seconds: number;
  isActive: boolean;
  totalSeconds: number;
  progress: number;
}

export default function RecoveryWellness() {
  const [activeTimer, setActiveTimer] = useState<'sauna' | 'steam' | 'ice' | null>(null);
  const [timers, setTimers] = useState<Record<'sauna' | 'steam' | 'ice', TimerState>>({
    sauna: { minutes: 15, seconds: 0, isActive: false, totalSeconds: 900, progress: 0 },
    steam: { minutes: 12, seconds: 0, isActive: false, totalSeconds: 720, progress: 0 },
    ice: { minutes: 3, seconds: 0, isActive: false, totalSeconds: 180, progress: 0 }
  });
  
  const [sessions, setSessions] = useState<RecoverySession[]>([]);
  const [achievements, setAchievements] = useState<RecoveryAchievement[]>([]);
  const [notes, setNotes] = useState('');
  const [temperature, setTemperature] = useState<number>(0);
  const [showParticles, setShowParticles] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadRecoveryData();
    initializeAchievements();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showParticles) {
      createParticleAnimation();
    }
  }, [showParticles]);

  const loadRecoveryData = () => {
    const savedSessions = localStorage.getItem('recovery_sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }

    const savedAchievements = localStorage.getItem('recovery_achievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  };

  const saveRecoveryData = (newSessions: RecoverySession[]) => {
    localStorage.setItem('recovery_sessions', JSON.stringify(newSessions));
    setSessions(newSessions);
  };

  const initializeAchievements = () => {
    const defaultAchievements: RecoveryAchievement[] = [
      { id: 'first_sauna', title: 'Prima Sauna', description: 'Completa la tua prima sessione di sauna', icon: '🔥', unlocked: false, requirement: '1 sessione sauna' },
      { id: 'sauna_master', title: 'Maestro Sauna', description: 'Completa 10 sessioni di sauna', icon: '👑', unlocked: false, requirement: '10 sessioni sauna' },
      { id: 'ice_warrior', title: 'Guerriero del Ghiaccio', description: 'Completa 5 sessioni di bagno ghiacciato', icon: '🧊', unlocked: false, requirement: '5 sessioni ghiaccio' },
      { id: 'steam_lover', title: 'Amante del Vapore', description: 'Completa 7 sessioni di bagno turco', icon: '💨', unlocked: false, requirement: '7 sessioni vapore' },
      { id: 'consistency_week', title: 'Settimana Perfetta', description: 'Fai recovery per 7 giorni consecutivi', icon: '⭐', unlocked: false, requirement: '7 giorni consecutivi' },
      { id: 'temperature_extreme', title: 'Estremista', description: 'Sopravvivi a temperature estreme', icon: '🌡️', unlocked: false, requirement: 'Sauna >90°C o Ghiaccio <5°C' },
      { id: 'marathon_recovery', title: 'Maratoneta Recovery', description: 'Accumula 5 ore totali di recovery', icon: '⏰', unlocked: false, requirement: '5 ore totali' },
      { id: 'triple_threat', title: 'Tripla Minaccia', description: 'Completa sauna, vapore e ghiaccio nello stesso giorno', icon: '🎯', unlocked: false, requirement: 'Tutti e 3 in un giorno' },
      { id: 'dedication', title: 'Dedizione', description: 'Completa 30 sessioni totali', icon: '💪', unlocked: false, requirement: '30 sessioni totali' },
      { id: 'mental_fortitude', title: 'Forza Mentale', description: 'Completa sessione di 20+ minuti', icon: '🧠', unlocked: false, requirement: 'Sessione >20 minuti' },
      { id: 'polar_bear', title: 'Orso Polare', description: 'Completa 10 bagni ghiacciati', icon: '🐻‍❄️', unlocked: false, requirement: '10 sessioni ghiaccio' },
      { id: 'heat_master', title: 'Maestro del Calore', description: 'Completa sessione sauna di 25+ minuti', icon: '🔥', unlocked: false, requirement: 'Sauna >25 minuti' },
      { id: 'steam_champion', title: 'Campione Vapore', description: 'Completa 15 sessioni bagno turco', icon: '🏆', unlocked: false, requirement: '15 sessioni vapore' },
      { id: 'recovery_legend', title: 'Leggenda Recovery', description: 'Sblocca tutti gli altri achievement', icon: '👑', unlocked: false, requirement: 'Tutti gli achievement' },
      { id: 'quick_session', title: 'Sessione Veloce', description: 'Completa una sessione sotto i 2 minuti', icon: '⚡', unlocked: false, requirement: 'Sessione <2 minuti' },
      { id: 'endurance_king', title: 'Re della Resistenza', description: 'Completa 3 sessioni in un giorno', icon: '👑', unlocked: false, requirement: '3 sessioni/giorno' }
    ];

    const savedAchievements = localStorage.getItem('recovery_achievements');
    if (!savedAchievements) {
      setAchievements(defaultAchievements);
      localStorage.setItem('recovery_achievements', JSON.stringify(defaultAchievements));
    }
  };

  const startTimer = (type: 'sauna' | 'steam' | 'ice') => {
    if (activeTimer && activeTimer !== type) {
      stopTimer();
    }
    
    setActiveTimer(type);
    setTimers(prev => ({
      ...prev,
      [type]: { ...prev[type], isActive: true }
    }));

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimers(prev => {
        const currentTimer = prev[type];
        if (currentTimer.minutes === 0 && currentTimer.seconds === 0) {
          completeSession(type);
          return prev;
        }

        let newSeconds = currentTimer.seconds - 1;
        let newMinutes = currentTimer.minutes;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }

        const elapsed = currentTimer.totalSeconds - (newMinutes * 60 + newSeconds);
        const progress = (elapsed / currentTimer.totalSeconds) * 100;

        return {
          ...prev,
          [type]: {
            ...currentTimer,
            minutes: newMinutes,
            seconds: newSeconds,
            progress
          }
        };
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setTimers(prev => {
      const newTimers = { ...prev };
      Object.keys(newTimers).forEach(key => {
        newTimers[key as keyof typeof newTimers].isActive = false;
      });
      return newTimers;
    });
    
    setActiveTimer(null);
  };

  const resetTimer = (type: 'sauna' | 'steam' | 'ice') => {
    const defaultTimes = {
      sauna: { minutes: 15, totalSeconds: 900 },
      steam: { minutes: 12, totalSeconds: 720 },
      ice: { minutes: 3, totalSeconds: 180 }
    };

    setTimers(prev => ({
      ...prev,
      [type]: {
        ...defaultTimes[type],
        seconds: 0,
        isActive: false,
        progress: 0
      }
    }));

    if (activeTimer === type) {
      stopTimer();
    }
  };

  const completeSession = (type: 'sauna' | 'steam' | 'ice') => {
    stopTimer();
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 3000);

    const newSession: RecoverySession = {
      id: Date.now().toString(),
      type,
      duration: timers[type].totalSeconds / 60,
      temperature: temperature > 0 ? temperature : undefined,
      notes,
      date: new Date().toISOString(),
      completed: true
    };

    const updatedSessions = [...sessions, newSession];
    saveRecoveryData(updatedSessions);
    
    checkAchievements(updatedSessions);
    
    GamificationManager.completeWorkout();
    GamificationManager.addXP(30, `Recovery ${type} completato!`);
    
    setNotes('');
    setTemperature(0);
    resetTimer(type);
  };

  const checkAchievements = (currentSessions: RecoverySession[]) => {
    const updatedAchievements = [...achievements];
    let newUnlocks = false;

    const saunaSessions = currentSessions.filter(s => s.type === 'sauna').length;
    const steamSessions = currentSessions.filter(s => s.type === 'steam').length;
    const iceSessions = currentSessions.filter(s => s.type === 'ice').length;
    const totalSessions = currentSessions.length;

    const achievementChecks = [
      { id: 'first_sauna', condition: saunaSessions >= 1 },
      { id: 'sauna_master', condition: saunaSessions >= 10 },
      { id: 'ice_warrior', condition: iceSessions >= 5 },
      { id: 'steam_lover', condition: steamSessions >= 7 },
      { id: 'polar_bear', condition: iceSessions >= 10 },
      { id: 'steam_champion', condition: steamSessions >= 15 },
      { id: 'dedication', condition: totalSessions >= 30 },
    ];

    achievementChecks.forEach(check => {
      const achievement = updatedAchievements.find(a => a.id === check.id);
      if (achievement && !achievement.unlocked && check.condition) {
        achievement.unlocked = true;
        newUnlocks = true;
        GamificationManager.addXP(50, `Achievement sbloccato: ${achievement.title}!`);
      }
    });

    if (newUnlocks) {
      setAchievements(updatedAchievements);
      localStorage.setItem('recovery_achievements', JSON.stringify(updatedAchievements));
    }
  };

  const createParticleAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;

        if (particle.life <= 0) {
          particles.splice(index, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const getSessionsData = () => {
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const daySessions = sessions.filter(s => s.date.split('T')[0] === dateString);
      last30Days.push(daySessions.length);
    }
    
    return {
      labels: last30Days.map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toLocaleDateString('it-IT', { month: 'short', day: 'numeric' });
      }),
      datasets: [{
        label: 'Sessioni Recovery',
        data: last30Days,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 2,
        fill: true
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'rgb(255, 255, 255)'
        }
      }
    },
    scales: {
      y: {
        ticks: { color: 'rgb(255, 255, 255)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: 'rgb(255, 255, 255)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  const getTimerIcon = (type: 'sauna' | 'steam' | 'ice') => {
    switch (type) {
      case 'sauna': return '🔥';
      case 'steam': return '💨';
      case 'ice': return '🧊';
    }
  };

  const getTimerColor = (type: 'sauna' | 'steam' | 'ice') => {
    switch (type) {
      case 'sauna': return 'from-red-500 to-orange-600';
      case 'steam': return 'from-blue-500 to-cyan-600';
      case 'ice': return 'from-cyan-400 to-blue-600';
    }
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 relative">
      {showParticles && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-50"
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-2xl">
        <h2 className="text-3xl font-black mb-2">💆‍♂️ RECOVERY & WELLNESS</h2>
        <p className="text-emerald-100 text-lg font-medium">
          Ottimizza il recupero con sauna, vapore e crioterapia
        </p>
      </div>

      {/* Timer Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['sauna', 'steam', 'ice'] as const).map((type) => (
          <div key={type} className={`bg-gradient-to-br ${getTimerColor(type)} rounded-2xl p-6 text-white shadow-xl`}>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{getTimerIcon(type)}</div>
              <h3 className="text-xl font-bold uppercase">
                {type === 'sauna' ? 'SAUNA' : type === 'steam' ? 'BAGNO TURCO' : 'BAGNO GHIACCIATO'}
              </h3>
            </div>

            {/* Progress Ring */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="white"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${timers[type].progress * 3.51} 351`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {formatTime(timers[type].minutes, timers[type].seconds)}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center space-x-3">
              {!timers[type].isActive ? (
                <button
                  onClick={() => startTimer(type)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all"
                >
                  ▶️ START
                </button>
              ) : (
                <button
                  onClick={stopTimer}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all"
                >
                  ⏸️ PAUSE
                </button>
              )}
              <button
                onClick={() => resetTimer(type)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-all"
              >
                🔄 RESET
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Session Settings */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
        <h3 className="text-white font-bold text-xl mb-4">⚙️ IMPOSTAZIONI SESSIONE</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Temperatura (°C)</label>
            <input
              type="number"
              value={temperature || ''}
              onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
              placeholder="es. 80°C per sauna"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Note sessione</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
              placeholder="Come ti senti, obiettivi..."
            />
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-white">
            {sessions.filter(s => s.type === 'sauna').length}
          </div>
          <div className="text-gray-400 text-sm">Sessioni Sauna</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
          <div className="text-3xl mb-2">💨</div>
          <div className="text-2xl font-bold text-white">
            {sessions.filter(s => s.type === 'steam').length}
          </div>
          <div className="text-gray-400 text-sm">Bagni Turco</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
          <div className="text-3xl mb-2">🧊</div>
          <div className="text-2xl font-bold text-white">
            {sessions.filter(s => s.type === 'ice').length}
          </div>
          <div className="text-gray-400 text-sm">Bagni Ghiacciati</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
          <div className="text-3xl mb-2">⏰</div>
          <div className="text-2xl font-bold text-white">
            {Math.round(sessions.reduce((sum, s) => sum + s.duration, 0))}
          </div>
          <div className="text-gray-400 text-sm">Minuti Totali</div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
        <h3 className="text-white font-bold text-xl mb-4">📊 ANALYTICS RECOVERY</h3>
        <div className="h-64">
          <Line data={getSessionsData()} options={chartOptions} />
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
        <h3 className="text-white font-bold text-xl mb-4">🏆 ACHIEVEMENTS ({achievements.filter(a => a.unlocked).length}/{achievements.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.slice(0, 12).map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                achievement.unlocked
                  ? 'border-yellow-500 bg-yellow-500/20'
                  : 'border-gray-600 bg-gray-700/30'
              }`}
            >
              <div className={`text-3xl mb-2 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              <div className={`font-bold text-sm ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                {achievement.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {achievement.requirement}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
        <h3 className="text-white font-bold text-xl mb-4">📝 SESSIONI RECENTI</h3>
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🧘‍♂️</div>
            <p className="text-gray-400">Nessuna sessione di recovery ancora</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.slice(-5).reverse().map((session) => (
              <div key={session.id} className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTimerIcon(session.type)}</span>
                  <div>
                    <div className="text-white font-medium">
                      {session.type === 'sauna' ? 'Sauna' : session.type === 'steam' ? 'Bagno Turco' : 'Bagno Ghiacciato'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {Math.round(session.duration)} min
                      {session.temperature && ` • ${session.temperature}°C`}
                    </div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">
                  {new Date(session.date).toLocaleDateString('it-IT')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}