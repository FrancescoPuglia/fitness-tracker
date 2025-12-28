import { useState, useEffect } from 'react';
import { 
  GamificationManager, 
  ACHIEVEMENTS 
} from '../systems/gamification';
import type { PlayerStats, XPEvent } from '../systems/gamification';

interface GamificationPanelProps {
  onXPGained?: (events: XPEvent[]) => void;
}

export default function GamificationPanel({ onXPGained }: GamificationPanelProps) {
  const [stats, setStats] = useState<PlayerStats>(GamificationManager.getPlayerStats());
  const [recentEvents, setRecentEvents] = useState<XPEvent[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats(GamificationManager.getPlayerStats());
    };

    // Update stats every 10 seconds to catch any changes
    const interval = setInterval(updateStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const triggerTestXP = (type: XPEvent['type']) => {
    const events = GamificationManager.awardXP(type);
    setRecentEvents(prev => [...events, ...prev].slice(0, 5));
    setStats(GamificationManager.getPlayerStats());
    
    // Check for new achievements
    const newAchievements = GamificationManager.checkAchievements();
    if (newAchievements.length > 0) {
      // Show achievement notifications
      console.log('New achievements unlocked:', newAchievements);
    }
    
    onXPGained?.(events);
  };

  const getProgressPercentage = (): number => {
    const currentLevelXP = stats.totalXP - (Math.pow(stats.currentLevel - 1, 2) * 100);
    const xpNeededForThisLevel = Math.pow(stats.currentLevel, 2) * 100 - Math.pow(stats.currentLevel - 1, 2) * 100;
    return (currentLevelXP / xpNeededForThisLevel) * 100;
  };

  const unlockedAchievements = GamificationManager.getUnlockedAchievements();
  const lockedAchievements = GamificationManager.getLockedAchievements();

  return (
    <div className="space-y-6">
      {/* Player Level & XP */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-black">LIVELLO {stats.currentLevel}</h3>
            <p className="text-white/90 text-lg font-medium">
              {stats.totalXP.toLocaleString()} XP totali
            </p>
          </div>
          <div className="text-6xl">🏆</div>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-4 backdrop-blur-sm">
          <div
            className="bg-gradient-to-r from-yellow-300 to-yellow-100 h-4 rounded-full transition-all duration-1000 shadow-lg"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="flex justify-between text-sm mt-2 opacity-90">
          <span>Livello {stats.currentLevel}</span>
          <span>{stats.xpToNextLevel} XP al prossimo livello</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
          <div className="text-3xl mb-2">💪</div>
          <div className="text-2xl font-bold text-white">{stats.totalWorkouts}</div>
          <div className="text-gray-300 text-sm">Allenamenti</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-orange-400">{stats.currentStreak}</div>
          <div className="text-gray-300 text-sm">Streak</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-2xl font-bold text-yellow-400">{stats.totalPRs}</div>
          <div className="text-gray-300 text-sm">Record</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 text-center">
          <div className="text-3xl mb-2">🏅</div>
          <div className="text-2xl font-bold text-purple-400">{unlockedAchievements.length}</div>
          <div className="text-gray-300 text-sm">Badges</div>
        </div>
      </div>

      {/* Recent XP Events */}
      {recentEvents.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
          <h4 className="text-white font-bold mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            RECENT XP GAINS
          </h4>
          <div className="space-y-2">
            {recentEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg border border-green-500/30 animate-pulse"
              >
                <span className="text-green-300 text-sm">{event.description}</span>
                <span className="text-yellow-400 font-bold">+{event.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Toggle */}
      <button
        onClick={() => setShowAchievements(!showAchievements)}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl p-4 font-bold transition-all transform hover:scale-105 shadow-lg"
      >
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">🏅</span>
          <span>MOSTRA ACHIEVEMENTS ({unlockedAchievements.length}/{ACHIEVEMENTS.length})</span>
        </div>
      </button>

      {/* Achievements Panel */}
      {showAchievements && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
          <h4 className="text-white font-bold mb-6 text-xl">🏆 ACHIEVEMENTS</h4>
          
          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div className="mb-6">
              <h5 className="text-green-400 font-bold mb-3">✅ SBLOCCATI ({unlockedAchievements.length})</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 border-green-500/50 ${GamificationManager.getRarityBg(achievement.rarity)} backdrop-blur-sm`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className={`font-bold ${GamificationManager.getRarityColor(achievement.rarity)}`}>
                          {achievement.name}
                        </div>
                        <div className="text-gray-300 text-sm">
                          {achievement.description}
                        </div>
                        <div className="text-yellow-400 text-xs font-medium mt-1">
                          +{achievement.xpReward} XP • {achievement.rarity.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Achievements Preview */}
          <div>
            <h5 className="text-gray-400 font-bold mb-3">🔒 DA SBLOCCARE ({lockedAchievements.length})</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lockedAchievements.slice(0, 6).map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 rounded-lg border border-gray-600 bg-gray-700/30 opacity-60"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl filter grayscale">{achievement.icon}</span>
                    <div className="flex-1">
                      <div className="text-gray-400 font-bold">
                        {achievement.name}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {achievement.description}
                      </div>
                      <div className="text-gray-500 text-xs font-medium mt-1">
                        +{achievement.xpReward} XP • {achievement.rarity.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Test Buttons (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500">
          <h4 className="text-yellow-400 font-bold mb-4">🧪 TEST XP SYSTEM</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button
              onClick={() => triggerTestXP('exercise_complete')}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              Exercise +10
            </button>
            <button
              onClick={() => triggerTestXP('workout_complete')}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
            >
              Workout +50
            </button>
            <button
              onClick={() => triggerTestXP('pr_achieved')}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
            >
              PR +100
            </button>
            <button
              onClick={() => triggerTestXP('diet_perfect')}
              className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm"
            >
              Diet +75
            </button>
            <button
              onClick={() => triggerTestXP('streak_milestone')}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Streak +100
            </button>
            <button
              onClick={() => {
                // Force unlock achievement for testing
                const stats = GamificationManager.getPlayerStats();
                stats.totalWorkouts = 1;
                GamificationManager.savePlayerStats(stats);
                const newAchievements = GamificationManager.checkAchievements();
                setStats(GamificationManager.getPlayerStats());
                if (newAchievements.length > 0) {
                  setRecentEvents(prev => [{
                    type: 'badge_earned',
                    xp: newAchievements[0].xpReward,
                    description: `🏅 Achievement unlocked: ${newAchievements[0].name}!`,
                    timestamp: new Date().toISOString(),
                  }, ...prev]);
                }
              }}
              className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm"
            >
              Test Badge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}