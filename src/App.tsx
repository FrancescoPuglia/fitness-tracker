import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/NewWorkoutTracker';
import BeastModeDiet from './components/BeastModeDiet';
import Calendar from './components/Calendar';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import GamificationPanel from './components/GamificationPanel';
import AdvancedCharts from './components/AdvancedCharts';
import PhotoProgress from './components/PhotoProgress';
import TechnicalGuides from './components/TechnicalGuides';
import AICoaching from './components/AICoaching';
import RecoveryWellness from './components/RecoveryWellness';
import { MOTIVATIONAL_QUOTES } from './data/motivationalQuotes';
import type { XPEvent } from './systems/gamification';

type Tab = 'dashboard' | 'workout' | 'diet' | 'calendar' | 'stats' | 'settings' | 'gamification' | 'analytics' | 'photos' | 'guides' | 'ai' | 'recovery';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [currentQuote, setCurrentQuote] = useState(
    MOTIVATIONAL_QUOTES[new Date().getDay()]
  );
  const [xpEvents, setXpEvents] = useState<XPEvent[]>([]);

  useEffect(() => {
    // Aggiorna la quote ogni giorno
    const today = new Date().getDay();
    setCurrentQuote(MOTIVATIONAL_QUOTES[today]);
  }, []);

  const tabs = [
    { id: 'dashboard', label: '🏠 COMMAND', icon: '🏠' },
    { id: 'workout', label: '💪 TRAIN', icon: '🏋️' },
    { id: 'diet', label: '🍽️ FUEL', icon: '🥗' },
    { id: 'calendar', label: '📅 TRACK', icon: '📊' },
    { id: 'stats', label: '📈 DOMINATE', icon: '📈' },
    { id: 'gamification', label: '🎮 LEVEL UP', icon: '🏆' },
    { id: 'analytics', label: '📊 ANALYTICS', icon: '📈' },
    { id: 'photos', label: '📸 PROGRESS', icon: '📷' },
    { id: 'guides', label: '🎯 GUIDES', icon: '📚' },
    { id: 'ai', label: '🤖 AI COACH', icon: '🧠' },
    { id: 'recovery', label: '💆‍♂️ RECOVERY', icon: '🧘‍♂️' },
    { id: 'settings', label: '⚙️ CONFIG', icon: '⚙️' },
  ] as const;

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as Tab);
  };

  const handleXPGained = (events: XPEvent[]) => {
    setXpEvents(prev => [...events, ...prev].slice(0, 10)); // Keep last 10 events
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard currentQuote={currentQuote} onNavigate={handleNavigate} />
        );
      case 'workout':
        return <WorkoutTracker />;
      case 'diet':
        return <BeastModeDiet />;
      case 'calendar':
        return <Calendar />;
      case 'stats':
        return <Statistics />;
      case 'gamification':
        return <GamificationPanel onXPGained={handleXPGained} />;
      case 'analytics':
        return <AdvancedCharts />;
      case 'photos':
        return <PhotoProgress />;
      case 'guides':
        return <TechnicalGuides />;
      case 'ai':
        return <AICoaching />;
      case 'recovery':
        return <RecoveryWellness />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <Dashboard currentQuote={currentQuote} onNavigate={handleNavigate} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* XP Events Notifications */}
      {xpEvents.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {xpEvents.slice(0, 3).map((event, index) => (
            <div
              key={`${event.timestamp}-${index}`}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg shadow-2xl animate-bounce"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '2s',
                animationFillMode: 'forwards',
              }}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚡</span>
                <span className="font-bold text-sm">{event.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header con gradiente epico */}
      <header className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg">
            🔥 BEAST MODE ACTIVATED 🔥
          </h1>
          <p className="text-white/90 mt-2 text-lg font-semibold">
            Trasforma il tuo corpo, domina la tua mente
          </p>
        </div>
      </header>

      {/* Navigation con stile gaming */}
      <nav className="bg-black/90 backdrop-blur-sm border-b border-yellow-500/30 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-4 transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10 shadow-lg'
                    : 'border-transparent text-gray-300 hover:text-yellow-300 hover:bg-yellow-500/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline font-bold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">{renderContent()}</main>
    </div>
  );
}

export default App;
