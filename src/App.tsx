import { useState } from 'react';
import WorkoutTracker from './components/WorkoutTracker';
import DietTracker from './components/DietTracker';
import Calendar from './components/Calendar';
import Statistics from './components/Statistics';
import Settings from './components/Settings';

type Tab = 'workout' | 'diet' | 'calendar' | 'stats' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('workout');

  const tabs = [
    { id: 'workout', label: '💪 Allenamento', icon: '🏋️' },
    { id: 'diet', label: '🍽️ Dieta', icon: '🥗' },
    { id: 'calendar', label: '📅 Calendario', icon: '📊' },
    { id: 'stats', label: '📈 Statistiche', icon: '📈' },
    { id: 'settings', label: '⚙️ Impostazioni', icon: '⚙️' }
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
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
        return <WorkoutTracker />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Fitness Tracker</h1>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;