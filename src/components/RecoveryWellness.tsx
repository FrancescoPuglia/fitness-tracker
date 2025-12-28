import { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { GamificationManager } from '../systems/gamification';

const RECOVERY_BENEFITS = {
  sauna: {
    title: 'SAUNA (Secca)',
    icon: '🔥',
    description: 'È come entrare in un piccolo sole privato: il calore ti svuota la testa e ti riempie il corpo di quiete.',
    benefits: [
      '❤️ Riduzione mortalità cardiovascolare (studi finlandesi)',
      '🧠 Possibile protezione da demenza e Alzheimer', 
      '💆‍♂️ Rilassamento profondo e riduzione stress',
      '🔄 Miglioramento circolazione sanguigna',
      '😴 Qualità del sonno migliorata'
    ],
    sources: ['JAMA Network', 'OUP Academic']
  },
  steam: {
    title: 'BAGNO TURCO / HAMMAM (Vapore)',
    icon: '💨',
    description: 'Il vapore è un abbraccio umido: ti scioglie le spalle, ammorbidisce la pelle, ti fa respirare "più largo".',
    benefits: [
      '💓 Riduzione pressione arteriosa',
      '🫀 Diminuzione frequenza cardiaca a riposo',
      '🫁 Sollievo per vie respiratorie (limitato)',
      '🧴 Idratazione e ammorbidimento pelle',
      '🧘‍♂️ Rilassamento muscolare profondo'
    ],
    sources: ['ScienceDirect', 'PMC']
  },
  ice: {
    title: 'ICE BATH (Immersione Fredda)',
    icon: '🧊',
    description: 'Il freddo è una lama pulita: taglia via la nebbia mentale e ti lascia addosso una scintilla, come se il corpo si ricordasse di essere vivo.',
    benefits: [
      '💪 Riduzione DOMS (indolenzimento muscolare)',
      '⚡ Diminuzione percezione di fatica',
      '🧠 Aumento concentrazione e lucidità mentale',
      '🔋 Boost energetico e umore',
      '🏃‍♂️ Accelerazione recupero post-allenamento'
    ],
    sources: ['Meta-analisi immersione fredda']
  }
};

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
  seconds: number;
  isActive: boolean;
  isPaused: boolean;
  startTime: number | null;
  elapsedTime: number;
  minRecommended: number;
}

export default function RecoveryWellness() {
  const [activeTimer, setActiveTimer] = useState<'sauna' | 'steam' | 'ice' | null>(null);
  const [timers, setTimers] = useState<Record<'sauna' | 'steam' | 'ice', TimerState>>({
    sauna: { seconds: 0, isActive: false, isPaused: false, startTime: null, elapsedTime: 0, minRecommended: 900 },
    steam: { seconds: 0, isActive: false, isPaused: false, startTime: null, elapsedTime: 0, minRecommended: 720 },
    ice: { seconds: 0, isActive: false, isPaused: false, startTime: null, elapsedTime: 0, minRecommended: 180 }
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
      pauseTimer();
    }
    
    setActiveTimer(type);
    const currentTime = Date.now();
    
    setTimers(prev => ({
      ...prev,
      [type]: { 
        ...prev[type], 
        isActive: true, 
        isPaused: false,
        startTime: prev[type].startTime || currentTime
      }
    }));

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimers(prev => {
        const currentTimer = prev[type];
        if (!currentTimer.isActive) return prev;
        
        const now = Date.now();
        const totalElapsed = currentTimer.elapsedTime + (now - (currentTimer.startTime || now));
        const currentSeconds = Math.floor(totalElapsed / 1000);

        return {
          ...prev,
          [type]: {
            ...currentTimer,
            seconds: currentSeconds
          }
        };
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (!activeTimer) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setTimers(prev => {
      const currentTimer = prev[activeTimer];
      const now = Date.now();
      const sessionElapsed = currentTimer.startTime ? now - currentTimer.startTime : 0;
      
      return {
        ...prev,
        [activeTimer]: {
          ...currentTimer,
          isActive: false,
          isPaused: true,
          elapsedTime: currentTimer.elapsedTime + sessionElapsed,
          startTime: null
        }
      };
    });
    
    setActiveTimer(null);
  };

  const stopAndSave = () => {
    if (!activeTimer) return;
    
    pauseTimer();
    
    const timerState = timers[activeTimer];
    const finalDuration = Math.floor((timerState.elapsedTime + (timerState.startTime ? Date.now() - timerState.startTime : 0)) / 1000);
    
    if (finalDuration > 0) {
      completeSession(activeTimer, finalDuration);
    }
  };

  const resetTimer = (type: 'sauna' | 'steam' | 'ice') => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimers(prev => ({
      ...prev,
      [type]: {
        seconds: 0,
        isActive: false,
        isPaused: false,
        startTime: null,
        elapsedTime: 0,
        minRecommended: prev[type].minRecommended
      }
    }));

    if (activeTimer === type) {
      setActiveTimer(null);
    }
  };

  const completeSession = (type: 'sauna' | 'steam' | 'ice', durationInSeconds?: number) => {
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 3000);

    const finalDuration = durationInSeconds || timers[type].seconds;
    
    const newSession: RecoverySession = {
      id: Date.now().toString(),
      type,
      duration: finalDuration / 60, // Convert to minutes
      temperature: temperature > 0 ? temperature : undefined,
      notes,
      date: new Date().toISOString(),
      completed: true
    };

    const updatedSessions = [...sessions, newSession];
    saveRecoveryData(updatedSessions);
    
    checkAchievements(updatedSessions);
    
    // Award XP based on duration vs minimum
    const minSeconds = timers[type].minRecommended;
    const baseXP = 30;
    const bonusXP = finalDuration > minSeconds ? Math.floor((finalDuration - minSeconds) / 60) * 10 : 0;
    
    GamificationManager.awardXP('workout_complete');
    GamificationManager.awardXP('exercise_complete', baseXP + bonusXP);
    
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
        GamificationManager.awardXP('badge_earned', 50);
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

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatMinRecommended = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min minimo`;
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

            {/* Timer Display */}
            <div className="text-center mb-4">
              <div className="text-6xl font-black text-white mb-2">
                {formatTime(timers[type].seconds)}
              </div>
              <div className="text-sm opacity-75">
                {formatMinRecommended(timers[type].minRecommended)}
              </div>
              {timers[type].seconds >= timers[type].minRecommended && (
                <div className="text-green-400 font-bold text-sm mt-1">
                  🎯 OBIETTIVO RAGGIUNTO!
                </div>
              )}
              {timers[type].isPaused && (
                <div className="text-yellow-400 font-bold text-sm mt-1">
                  ⏸️ IN PAUSA
                </div>
              )}
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center space-x-2 flex-wrap gap-2">
              {!timers[type].isActive && !timers[type].isPaused && (
                <button
                  onClick={() => startTimer(type)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all"
                >
                  ▶️ START
                </button>
              )}
              
              {timers[type].isActive && (
                <button
                  onClick={pauseTimer}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold transition-all"
                >
                  ⏸️ PAUSE
                </button>
              )}
              
              {timers[type].isPaused && (
                <button
                  onClick={() => startTimer(type)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all"
                >
                  ▶️ RIPRENDI
                </button>
              )}
              
              {(timers[type].isActive || timers[type].isPaused) && timers[type].seconds > 0 && (
                <button
                  onClick={stopAndSave}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all"
                >
                  💾 SALVA
                </button>
              )}
              
              <button
                onClick={() => resetTimer(type)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all"
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

      {/* Personal Records */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
        <h3 className="text-white font-bold text-xl mb-4">🏆 RECORD PERSONALI</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['sauna', 'steam', 'ice'] as const).map((type) => {
            const typeSessions = sessions.filter(s => s.type === type);
            const maxDuration = typeSessions.length > 0 
              ? Math.max(...typeSessions.map(s => s.duration))
              : 0;
            const maxSession = typeSessions.find(s => s.duration === maxDuration);
            
            return (
              <div key={type} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{getTimerIcon(type)}</span>
                  <span className="font-bold text-white">
                    {type === 'sauna' ? 'Sauna' : type === 'steam' ? 'Bagno Turco' : 'Bagno Ghiacciato'}
                  </span>
                </div>
                {maxDuration > 0 ? (
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {Math.round(maxDuration)} min
                    </div>
                    <div className="text-xs text-gray-400">
                      {maxSession && new Date(maxSession.date).toLocaleDateString('it-IT')}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">Nessun record</div>
                )}
              </div>
            );
          })}
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

      {/* Scientific Benefits */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
        <h3 className="text-white font-bold text-xl mb-6 flex items-center">
          <span className="mr-2">🧬</span>
          BENEFICI SCIENTIFICI PROVATI
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(RECOVERY_BENEFITS).map(([key, benefit]) => (
            <div key={key} className="bg-gray-700/50 rounded-xl p-5 border border-gray-600">
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3">{benefit.icon}</span>
                <h4 className="font-bold text-white text-lg">{benefit.title}</h4>
              </div>
              
              <p className="text-gray-300 text-sm mb-4 italic leading-relaxed">
                {benefit.description}
              </p>
              
              <div className="space-y-2 mb-4">
                {benefit.benefits.map((item, i) => (
                  <div key={i} className="text-sm text-gray-200 flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-gray-400 border-t border-gray-600 pt-2">
                <strong>Fonti:</strong> {benefit.sources.join(', ')}
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