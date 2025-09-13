import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/NewWorkoutTracker';
import DietTracker from './components/NewDietTracker';
import Calendar from './components/Calendar';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import { MOTIVATIONAL_QUOTES } from './data/motivationalQuotes';

type Tab = 'dashboard' | 'workout' | 'diet' | 'calendar' | 'stats' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [currentQuote, setCurrentQuote] = useState(
    MOTIVATIONAL_QUOTES[new Date().getDay()]
  );

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
    { id: 'settings', label: '⚙️ CONFIG', icon: '⚙️' },
  ] as const;

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as Tab);
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
        return <DietTracker />;
      case 'calendar':
        return <Calendar />;
      case 'stats':
        return <Statistics />;
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
