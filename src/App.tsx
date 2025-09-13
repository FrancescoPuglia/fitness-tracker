import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/NewWorkoutTracker';
import DietTracker from './components/DietTracker';
import Calendar from './components/Calendar';
import Statistics from './components/Statistics';
import Settings from './components/Settings';

type Tab = 'dashboard' | 'workout' | 'diet' | 'calendar' | 'stats' | 'settings';

// Quote motivazionali per ogni giorno  
export const MOTIVATIONAL_QUOTES: Record<number, {quote: string, author: string, image: string}> = {
  0: { // Domenica
    quote: "Champions don't become champions in the ring. They become champions in their training.",
    author: "Muhammad Ali",
    image: "https://images.unsplash.com/photo-1549476464-37392f717541?w=500&q=80"
  },
  1: { // Lunedì
    quote: "I'll be back! Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Arnold Schwarzenegger", 
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80"
  },
  2: { // Martedì
    quote: "We are what we repeatedly do. Excellence is not an act, but a habit.",
    author: "Bruce Lee",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&q=80"
  },
  3: { // Mercoledì
    quote: "Discipline is doing what you hate to do, but nonetheless doing it like you love it.",
    author: "Mike Tyson",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80"
  },
  4: { // Giovedì
    quote: "We're not just here to take part, we're here to take over!",
    author: "Conor McGregor",
    image: "https://images.unsplash.com/photo-1583500178949-fb12e8e6aa4a?w=500&q=80"
  },
  5: { // Venerdì
    quote: "Float like a butterfly, sting like a bee! Impossible is nothing!",
    author: "Muhammad Ali",
    image: "https://images.unsplash.com/photo-1549476464-37392f717541?w=500&q=80"
  },
  6: { // Sabato
    quote: "The successful warrior is the average man with laser-like focus.", 
    author: "Bruce Lee",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&q=80"
  }
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[new Date().getDay()]);

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
    { id: 'settings', label: '⚙️ CONFIG', icon: '⚙️' }
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard currentQuote={currentQuote} />;
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
        return <Dashboard currentQuote={currentQuote} />;
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

      <main className="max-w-6xl mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;