// 🎮 GAMIFICATION SYSTEM - BEAST MODE ACTIVATED
// Sistema completo di punti, livelli, achievement e progressi

export interface PlayerStats {
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  totalWorkouts: number;
  totalDietDays: number;
  currentStreak: number;
  longestStreak: number;
  totalPRs: number;
  badges: string[];
  lastUpdated: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  condition: (stats: PlayerStats) => boolean;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface XPEvent {
  type: 'workout_complete' | 'exercise_complete' | 'pr_achieved' | 'streak_milestone' | 'diet_perfect' | 'badge_earned';
  xp: number;
  description: string;
  timestamp: string;
}

// 🏆 SISTEMA LIVELLI (Infinito con scaling)
export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

export function getXPForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

export function getXPToNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  return nextLevelXP - totalXP;
}

// 🎯 XP REWARDS SYSTEM
export const XP_REWARDS = {
  EXERCISE_COMPLETE: 10,
  WORKOUT_COMPLETE: 50,
  PR_ACHIEVED: 100,
  PERFECT_DIET_DAY: 75,
  STREAK_3: 25,
  STREAK_7: 100,
  STREAK_14: 250,
  STREAK_30: 500,
  STREAK_100: 1000,
  FIRST_WORKOUT: 50,
  FIRST_PR: 100,
  BADGE_COMMON: 25,
  BADGE_RARE: 50,
  BADGE_EPIC: 100,
  BADGE_LEGENDARY: 200,
};

// 🏅 ACHIEVEMENT DEFINITIONS
export const ACHIEVEMENTS: Achievement[] = [
  // 💪 WORKOUT ACHIEVEMENTS
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Completa il tuo primo allenamento',
    icon: '🥇',
    xpReward: XP_REWARDS.FIRST_WORKOUT,
    condition: (stats) => stats.totalWorkouts >= 1,
    unlocked: false,
    rarity: 'common',
  },
  {
    id: 'workout_warrior',
    name: 'Workout Warrior',
    description: 'Completa 10 allenamenti',
    icon: '⚔️',
    xpReward: XP_REWARDS.BADGE_COMMON,
    condition: (stats) => stats.totalWorkouts >= 10,
    unlocked: false,
    rarity: 'common',
  },
  {
    id: 'fitness_beast',
    name: 'Fitness Beast',
    description: 'Completa 50 allenamenti',
    icon: '🦁',
    xpReward: XP_REWARDS.BADGE_RARE,
    condition: (stats) => stats.totalWorkouts >= 50,
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 'iron_god',
    name: 'Iron God',
    description: 'Completa 100 allenamenti',
    icon: '⚡',
    xpReward: XP_REWARDS.BADGE_EPIC,
    condition: (stats) => stats.totalWorkouts >= 100,
    unlocked: false,
    rarity: 'epic',
  },

  // 🔥 STREAK ACHIEVEMENTS
  {
    id: 'on_fire',
    name: 'On Fire!',
    description: 'Mantieni uno streak di 3 giorni',
    icon: '🔥',
    xpReward: XP_REWARDS.STREAK_3,
    condition: (stats) => stats.currentStreak >= 3,
    unlocked: false,
    rarity: 'common',
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable Force',
    description: 'Streak di 7 giorni consecutivi',
    icon: '🌟',
    xpReward: XP_REWARDS.STREAK_7,
    condition: (stats) => stats.currentStreak >= 7,
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 'legendary_streak',
    name: 'Legendary Streak',
    description: 'Streak di 30 giorni! Sei una leggenda!',
    icon: '👑',
    xpReward: XP_REWARDS.STREAK_30,
    condition: (stats) => stats.currentStreak >= 30,
    unlocked: false,
    rarity: 'legendary',
  },

  // 🏋️ STRENGTH ACHIEVEMENTS
  {
    id: 'record_breaker',
    name: 'Record Breaker',
    description: 'Stabilisci il tuo primo Personal Record',
    icon: '💥',
    xpReward: XP_REWARDS.FIRST_PR,
    condition: (stats) => stats.totalPRs >= 1,
    unlocked: false,
    rarity: 'common',
  },
  {
    id: 'strength_machine',
    name: 'Strength Machine',
    description: 'Ottieni 10 Personal Records',
    icon: '🤖',
    xpReward: XP_REWARDS.BADGE_RARE,
    condition: (stats) => stats.totalPRs >= 10,
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 'pr_master',
    name: 'PR Master',
    description: 'Colleziona 25 Personal Records',
    icon: '👑',
    xpReward: XP_REWARDS.BADGE_EPIC,
    condition: (stats) => stats.totalPRs >= 25,
    unlocked: false,
    rarity: 'epic',
  },

  // 🥗 DIET ACHIEVEMENTS  
  {
    id: 'nutrition_ninja',
    name: 'Nutrition Ninja',
    description: 'Completa perfettamente 7 giorni di dieta',
    icon: '🥷',
    xpReward: XP_REWARDS.BADGE_COMMON,
    condition: (stats) => stats.totalDietDays >= 7,
    unlocked: false,
    rarity: 'common',
  },
  {
    id: 'diet_destroyer',
    name: 'Diet Destroyer',
    description: 'Segui la dieta per 30 giorni',
    icon: '⚡',
    xpReward: XP_REWARDS.BADGE_EPIC,
    condition: (stats) => stats.totalDietDays >= 30,
    unlocked: false,
    rarity: 'epic',
  },

  // 🎖️ SPECIAL ACHIEVEMENTS
  {
    id: 'consistency_king',
    name: 'Consistency King',
    description: 'Mantieni uno streak di 100 giorni',
    icon: '👑',
    xpReward: XP_REWARDS.STREAK_100,
    condition: (stats) => stats.longestStreak >= 100,
    unlocked: false,
    rarity: 'legendary',
  },
  {
    id: 'level_ten',
    name: 'Elite Athlete',
    description: 'Raggiungi il livello 10',
    icon: '🌟',
    xpReward: XP_REWARDS.BADGE_EPIC,
    condition: (stats) => stats.currentLevel >= 10,
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 'level_twenty',
    name: 'Fitness Legend',
    description: 'Raggiungi il livello 20',
    icon: '🏆',
    xpReward: XP_REWARDS.BADGE_LEGENDARY,
    condition: (stats) => stats.currentLevel >= 20,
    unlocked: false,
    rarity: 'legendary',
  },
];

// 🎮 GAMIFICATION MANAGER CLASS
export class GamificationManager {
  private static readonly STORAGE_KEY = 'fitness_gamification';

  static getPlayerStats(): PlayerStats {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const stats = JSON.parse(saved) as PlayerStats;
      stats.currentLevel = calculateLevel(stats.totalXP);
      stats.xpToNextLevel = getXPToNextLevel(stats.totalXP);
      return stats;
    }

    return this.createDefaultStats();
  }

  private static createDefaultStats(): PlayerStats {
    return {
      totalXP: 0,
      currentLevel: 1,
      xpToNextLevel: 100,
      totalWorkouts: 0,
      totalDietDays: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalPRs: 0,
      badges: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  static savePlayerStats(stats: PlayerStats): void {
    stats.lastUpdated = new Date().toISOString();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
  }

  static awardXP(type: XPEvent['type'], customXP?: number): XPEvent[] {
    const stats = this.getPlayerStats();
    const events: XPEvent[] = [];

    const xpToAward = customXP || this.getXPForEventType(type);
    const oldLevel = stats.currentLevel;

    // Award primary XP
    stats.totalXP += xpToAward;
    events.push({
      type,
      xp: xpToAward,
      description: this.getEventDescription(type, xpToAward),
      timestamp: new Date().toISOString(),
    });

    // Check for level up
    const newLevel = calculateLevel(stats.totalXP);
    if (newLevel > oldLevel) {
      const levelUpXP = (newLevel - oldLevel) * 25; // Bonus XP for level up
      stats.totalXP += levelUpXP;
      events.push({
        type: 'badge_earned',
        xp: levelUpXP,
        description: `🎉 LEVEL UP! Sei ora livello ${newLevel}! (+${levelUpXP} XP bonus)`,
        timestamp: new Date().toISOString(),
      });
    }

    stats.currentLevel = newLevel;
    stats.xpToNextLevel = getXPToNextLevel(stats.totalXP);

    this.savePlayerStats(stats);
    return events;
  }

  private static getXPForEventType(type: XPEvent['type']): number {
    switch (type) {
      case 'exercise_complete': return XP_REWARDS.EXERCISE_COMPLETE;
      case 'workout_complete': return XP_REWARDS.WORKOUT_COMPLETE;
      case 'pr_achieved': return XP_REWARDS.PR_ACHIEVED;
      case 'diet_perfect': return XP_REWARDS.PERFECT_DIET_DAY;
      case 'streak_milestone': return XP_REWARDS.STREAK_7;
      case 'badge_earned': return XP_REWARDS.BADGE_COMMON;
      default: return 10;
    }
  }

  private static getEventDescription(type: XPEvent['type'], xp: number): string {
    switch (type) {
      case 'exercise_complete': return `💪 Esercizio completato! (+${xp} XP)`;
      case 'workout_complete': return `🔥 Workout dominato! (+${xp} XP)`;
      case 'pr_achieved': return `🏆 NUOVO RECORD PERSONALE! (+${xp} XP)`;
      case 'diet_perfect': return `🥗 Dieta perfetta oggi! (+${xp} XP)`;
      case 'streak_milestone': return `⚡ Streak milestone raggiunto! (+${xp} XP)`;
      case 'badge_earned': return `🏅 Nuovo achievement sbloccato! (+${xp} XP)`;
      default: return `✨ Ottimo lavoro! (+${xp} XP)`;
    }
  }

  static checkAchievements(): Achievement[] {
    const stats = this.getPlayerStats();
    const newUnlocks: Achievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (!stats.badges.includes(achievement.id) && achievement.condition(stats)) {
        // Achievement unlocked!
        stats.badges.push(achievement.id);
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        
        // Award achievement XP
        stats.totalXP += achievement.xpReward;
        newUnlocks.push(achievement);
      }
    }

    if (newUnlocks.length > 0) {
      stats.currentLevel = calculateLevel(stats.totalXP);
      stats.xpToNextLevel = getXPToNextLevel(stats.totalXP);
      this.savePlayerStats(stats);
    }

    return newUnlocks;
  }

  static updateWorkoutStats(): void {
    const stats = this.getPlayerStats();
    stats.totalWorkouts++;
    this.savePlayerStats(stats);
  }

  static updatePRStats(): void {
    const stats = this.getPlayerStats();
    stats.totalPRs++;
    this.savePlayerStats(stats);
  }

  static updateStreakStats(currentStreak: number): void {
    const stats = this.getPlayerStats();
    stats.currentStreak = currentStreak;
    if (currentStreak > stats.longestStreak) {
      stats.longestStreak = currentStreak;
    }
    this.savePlayerStats(stats);
  }

  static updateDietStats(): void {
    const stats = this.getPlayerStats();
    stats.totalDietDays++;
    this.savePlayerStats(stats);
  }

  static getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
    const stats = this.getPlayerStats();
    return ACHIEVEMENTS.filter(a => 
      a.rarity === rarity && stats.badges.includes(a.id)
    );
  }

  static getUnlockedAchievements(): Achievement[] {
    const stats = this.getPlayerStats();
    return ACHIEVEMENTS.filter(a => stats.badges.includes(a.id));
  }

  static getLockedAchievements(): Achievement[] {
    const stats = this.getPlayerStats();
    return ACHIEVEMENTS.filter(a => !stats.badges.includes(a.id));
  }

  static getRarityColor(rarity: Achievement['rarity']): string {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
    }
  }

  static getRarityBg(rarity: Achievement['rarity']): string {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20';
      case 'rare': return 'bg-blue-500/20';
      case 'epic': return 'bg-purple-500/20';
      case 'legendary': return 'bg-yellow-500/20';
    }
  }
}