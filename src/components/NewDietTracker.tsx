import { useState, useEffect } from 'react';
import { formatDate, formatDisplayDate } from '../utils';
import { WEEKLY_DIET_PLAN } from '../data/weeklyDiet';

interface CheatMeal {
  id: string;
  timestamp: string;
  food: string;
  quantity: string;
  severity: 'light' | 'medium' | 'heavy';
  notes?: string;
}

interface DietStatus {
  date: string;
  completedItems: string[];
  cheats: CheatMeal[];
}

export default function NewDietTracker() {
  const [dietStatus, setDietStatus] = useState<DietStatus>({
    date: formatDate(),
    completedItems: [],
    cheats: [],
  });
  const [showCheatForm, setShowCheatForm] = useState(false);
  const [cheatForm, setCheatForm] = useState({
    food: '',
    quantity: '',
    severity: 'light' as 'light' | 'medium' | 'heavy',
    notes: '',
  });

  const today = formatDate();
  const currentDay = new Date().getDay();
  const todayPlan = WEEKLY_DIET_PLAN[currentDay];

  // Load diet status from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`diet_${today}`);
    if (saved) {
      setDietStatus(JSON.parse(saved));
    } else {
      setDietStatus({
        date: today,
        completedItems: [],
        cheats: [],
      });
    }
  }, [today]);

  // Save diet status to localStorage
  const saveDietStatus = (status: DietStatus) => {
    localStorage.setItem(`diet_${today}`, JSON.stringify(status));
    setDietStatus(status);
  };

  // Toggle food item completion
  const toggleFoodItem = (mealIndex: number, itemIndex: number) => {
    const itemKey = `${mealIndex}-${itemIndex}`;
    const newCompletedItems = dietStatus.completedItems.includes(itemKey)
      ? dietStatus.completedItems.filter((item) => item !== itemKey)
      : [...dietStatus.completedItems, itemKey];

    saveDietStatus({
      ...dietStatus,
      completedItems: newCompletedItems,
    });
  };

  // Add cheat meal
  const addCheatMeal = () => {
    const cheat: CheatMeal = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('it-IT'),
      food: cheatForm.food,
      quantity: cheatForm.quantity,
      severity: cheatForm.severity,
      notes: cheatForm.notes,
    };

    saveDietStatus({
      ...dietStatus,
      cheats: [...dietStatus.cheats, cheat],
    });

    setCheatForm({ food: '', quantity: '', severity: 'light', notes: '' });
    setShowCheatForm(false);
  };

  // Calculate compliance
  const totalItems = todayPlan.meals.reduce(
    (sum, meal) => sum + meal.items.length,
    0
  );
  const completedItemsCount = dietStatus.completedItems.length;
  const compliancePercentage =
    totalItems > 0 ? (completedItemsCount / totalItems) * 100 : 0;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'light':
        return 'bg-yellow-500';
      case 'medium':
        return 'bg-orange-500';
      case 'heavy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'light':
        return '⚠️ Leggero';
      case 'medium':
        return '🔶 Medio';
      case 'heavy':
        return '🚨 Grave';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con Compliance */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-500 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-black">🍽️ FUEL PROTOCOL</h2>
            <p className="text-green-100 text-lg font-medium">
              {todayPlan.day} - Piano Nutrizionale
            </p>
            <p className="text-sm opacity-90 mt-1">
              {formatDisplayDate(today)}
            </p>
          </div>

          <div className="text-right">
            <div className="text-4xl font-black mb-2">
              {Math.round(compliancePercentage)}%
            </div>
            <div className="text-lg font-bold opacity-90">COMPLIANCE</div>
            <div className="text-sm opacity-75">
              {completedItemsCount}/{totalItems} alimenti
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${compliancePercentage}%` }}
          />
        </div>

        {/* Cheat Meals Alert */}
        {dietStatus.cheats.length > 0 && (
          <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-400/30">
            <div className="flex items-center">
              <span className="text-red-200 mr-2">⚠️</span>
              <span className="font-semibold">
                {dietStatus.cheats.length} sgarro
                {dietStatus.cheats.length > 1 ? 'i' : ''} registrato
                {dietStatus.cheats.length > 1 ? 'i' : ''}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Meals */}
      <div className="space-y-4">
        {todayPlan.meals.map((meal, mealIndex) => (
          <div
            key={mealIndex}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="text-2xl mr-3">
                  {mealIndex === 0
                    ? '🌅'
                    : mealIndex === 1
                      ? '🥐'
                      : mealIndex === 2
                        ? '🍽️'
                        : '🥤'}
                </span>
                {meal.time} - {meal.name}
              </h3>
            </div>

            <div className="space-y-3">
              {meal.items.map((item, itemIndex) => {
                const itemKey = `${mealIndex}-${itemIndex}`;
                const isCompleted = dietStatus.completedItems.includes(itemKey);

                return (
                  <div
                    key={itemIndex}
                    className={`flex items-start space-x-3 p-3 rounded-lg transition-all ${
                      isCompleted
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-gray-700/30'
                    }`}
                  >
                    <button
                      onClick={() => toggleFoodItem(mealIndex, itemIndex)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all mt-1 ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-400 text-gray-400 hover:border-green-400 hover:text-green-400'
                      }`}
                    >
                      {isCompleted ? '✓' : ''}
                    </button>

                    <div className="flex-1">
                      <div
                        className={`font-semibold ${isCompleted ? 'text-green-300 line-through' : 'text-white'}`}
                      >
                        {item.food}
                      </div>
                      {item.details && (
                        <div
                          className={`text-sm mt-1 ${isCompleted ? 'text-green-400/70' : 'text-gray-400'}`}
                        >
                          {item.details}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Cheat Meals Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="text-2xl mr-3">🚨</span>
            SGARRI
          </h3>
          <button
            onClick={() => setShowCheatForm(!showCheatForm)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all"
          >
            + AGGIUNGI SGARRO
          </button>
        </div>

        {/* Cheat Form */}
        {showCheatForm && (
          <div className="mb-6 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  ALIMENTO
                </label>
                <input
                  type="text"
                  value={cheatForm.food}
                  onChange={(e) =>
                    setCheatForm({ ...cheatForm, food: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-red-400 outline-none"
                  placeholder="es. Pizza Margherita"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  QUANTITÀ
                </label>
                <input
                  type="text"
                  value={cheatForm.quantity}
                  onChange={(e) =>
                    setCheatForm({ ...cheatForm, quantity: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-red-400 outline-none"
                  placeholder="es. 3 fette, 200g"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-400 block mb-2">
                GRAVITÀ
              </label>
              <div className="flex space-x-2">
                {(['light', 'medium', 'heavy'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setCheatForm({ ...cheatForm, severity: level })
                    }
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      cheatForm.severity === level
                        ? `${getSeverityColor(level)} text-white`
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {getSeverityText(level)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-400 block mb-2">
                NOTE (opzionale)
              </label>
              <textarea
                value={cheatForm.notes}
                onChange={(e) =>
                  setCheatForm({ ...cheatForm, notes: e.target.value })
                }
                className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-red-400 outline-none resize-none"
                rows={2}
                placeholder="Come ti senti? Cosa ha scatenato lo sgarro?"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={addCheatMeal}
                disabled={!cheatForm.food || !cheatForm.quantity}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white rounded-lg font-bold transition-all"
              >
                REGISTRA SGARRO
              </button>
              <button
                onClick={() => setShowCheatForm(false)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold transition-all"
              >
                ANNULLA
              </button>
            </div>
          </div>
        )}

        {/* Cheat Meals List */}
        {dietStatus.cheats.length > 0 ? (
          <div className="space-y-3">
            {dietStatus.cheats.map((cheat) => (
              <div
                key={cheat.id}
                className="p-4 bg-red-500/10 rounded-lg border border-red-500/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold text-white ${getSeverityColor(cheat.severity)}`}
                      >
                        {getSeverityText(cheat.severity)}
                      </span>
                      <span className="text-sm text-gray-400">
                        {cheat.timestamp}
                      </span>
                    </div>
                    <div className="text-white font-semibold">{cheat.food}</div>
                    <div className="text-gray-400 text-sm">
                      Quantità: {cheat.quantity}
                    </div>
                    {cheat.notes && (
                      <div className="text-gray-400 text-sm mt-1">
                        Note: {cheat.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <div className="text-4xl mb-2">✅</div>
            <div className="font-semibold">Nessuno sgarro registrato oggi!</div>
            <div className="text-sm">
              Continua così, stai seguendo perfettamente il piano!
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="text-2xl mr-3">📊</span>
          RIEPILOGO GIORNALIERO
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-black text-green-400">
              {Math.round(compliancePercentage)}%
            </div>
            <div className="text-sm text-gray-400">Compliance Dieta</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-blue-400">
              {completedItemsCount}/{totalItems}
            </div>
            <div className="text-sm text-gray-400">Alimenti Consumati</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-red-400">
              {dietStatus.cheats.length}
            </div>
            <div className="text-sm text-gray-400">Sgarri Totali</div>
          </div>
        </div>
      </div>
    </div>
  );
}
