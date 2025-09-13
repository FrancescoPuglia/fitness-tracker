import { useState, useEffect, useCallback } from 'react';
import type { Meal, DietDay } from '../types';
import { Storage } from '../storage';
import { formatDate, formatDisplayDate, generateId } from '../utils';

const defaultMeals: Omit<Meal, 'id' | 'completed'>[] = [
  { name: 'Colazione', calories: 400, protein: 20, carbs: 40, fat: 15 },
  { name: 'Spuntino Mattina', calories: 200, protein: 10, carbs: 20, fat: 8 },
  { name: 'Pranzo', calories: 600, protein: 35, carbs: 60, fat: 20 },
  {
    name: 'Spuntino Pomeriggio',
    calories: 250,
    protein: 15,
    carbs: 25,
    fat: 10,
  },
  { name: 'Cena', calories: 550, protein: 40, carbs: 45, fat: 18 },
  { name: 'Spuntino Sera', calories: 150, protein: 8, carbs: 15, fat: 6 },
];

export default function DietTracker() {
  const [currentDiet, setCurrentDiet] = useState<DietDay | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const today = formatDate();

  const loadTodayDiet = useCallback(() => {
    let diet = Storage.getDietDay(today);

    if (!diet) {
      diet = {
        id: generateId(),
        date: today,
        meals: defaultMeals.map((meal) => ({
          id: generateId(),
          ...meal,
          completed: false,
        })),
      };
    }

    setCurrentDiet(diet);
  }, [today]);

  useEffect(() => {
    loadTodayDiet();
  }, [loadTodayDiet]);

  const saveDiet = (diet: DietDay) => {
    Storage.saveDietDay(diet);
    setCurrentDiet(diet);
  };

  const toggleMeal = (mealId: string) => {
    if (!currentDiet) return;

    const updatedDiet = {
      ...currentDiet,
      meals: currentDiet.meals.map((meal) =>
        meal.id === mealId ? { ...meal, completed: !meal.completed } : meal
      ),
    };

    saveDiet(updatedDiet);
  };

  const updateMeal = (
    mealId: string,
    field: keyof Meal,
    value: string | number | boolean
  ) => {
    if (!currentDiet) return;

    const updatedDiet = {
      ...currentDiet,
      meals: currentDiet.meals.map((meal) =>
        meal.id === mealId ? { ...meal, [field]: value } : meal
      ),
    };

    saveDiet(updatedDiet);
  };

  const addMeal = () => {
    if (!currentDiet) return;

    const newMeal: Meal = {
      id: generateId(),
      name: 'Nuovo Pasto',
      calories: 300,
      protein: 20,
      carbs: 30,
      fat: 10,
      completed: false,
    };

    const updatedDiet = {
      ...currentDiet,
      meals: [...currentDiet.meals, newMeal],
    };

    saveDiet(updatedDiet);
  };

  const removeMeal = (mealId: string) => {
    if (!currentDiet) return;

    const updatedDiet = {
      ...currentDiet,
      meals: currentDiet.meals.filter((meal) => meal.id !== mealId),
    };

    saveDiet(updatedDiet);
  };

  const completedCount =
    currentDiet?.meals.filter((meal) => meal.completed).length || 0;
  const totalCount = currentDiet?.meals.length || 0;

  const totalCalories =
    currentDiet?.meals.reduce(
      (sum, meal) => (meal.completed ? sum + (meal.calories || 0) : sum),
      0
    ) || 0;
  const totalProtein =
    currentDiet?.meals.reduce(
      (sum, meal) => (meal.completed ? sum + (meal.protein || 0) : sum),
      0
    ) || 0;
  const totalCarbs =
    currentDiet?.meals.reduce(
      (sum, meal) => (meal.completed ? sum + (meal.carbs || 0) : sum),
      0
    ) || 0;
  const totalFat =
    currentDiet?.meals.reduce(
      (sum, meal) => (meal.completed ? sum + (meal.fat || 0) : sum),
      0
    ) || 0;

  const plannedCalories =
    currentDiet?.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0) ||
    0;

  if (!currentDiet) {
    return <div className="text-center py-8">Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {formatDisplayDate(today)}
            </h2>
            <p className="text-sm text-gray-600">
              {completedCount} / {totalCount} pasti completati
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {totalCalories} / {plannedCalories}
            </div>
            <div className="text-sm text-gray-600">kcal</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {totalCalories}
            </div>
            <div className="text-sm text-gray-600">Calorie</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {totalProtein}g
            </div>
            <div className="text-sm text-gray-600">Proteine</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600">
              {totalCarbs}g
            </div>
            <div className="text-sm text-gray-600">Carboidrati</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-600">
              {totalFat}g
            </div>
            <div className="text-sm text-gray-600">Grassi</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Pasti</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {isEditing ? 'Fine' : 'Modifica'}
          </button>
        </div>

        <div className="divide-y">
          {currentDiet.meals.map((meal) => (
            <div key={meal.id} className="p-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={meal.completed}
                  onChange={() => toggleMeal(meal.id)}
                  className="w-5 h-5 rounded border-2 text-primary-500 focus:ring-primary-500"
                  aria-label={`Mark ${meal.name} as completed`}
                />

                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={meal.name}
                      onChange={(e) =>
                        updateMeal(meal.id, 'name', e.target.value)
                      }
                      className="font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:border-primary-500 outline-none"
                    />
                  ) : (
                    <div
                      className={`font-medium ${meal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                    >
                      {meal.name}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 mt-2 flex-wrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Cal:</span>
                      <input
                        type="number"
                        value={meal.calories || ''}
                        onChange={(e) =>
                          updateMeal(
                            meal.id,
                            'calories',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-blue-600">P:</span>
                      <input
                        type="number"
                        value={meal.protein || ''}
                        onChange={(e) =>
                          updateMeal(
                            meal.id,
                            'protein',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-orange-600">C:</span>
                      <input
                        type="number"
                        value={meal.carbs || ''}
                        onChange={(e) =>
                          updateMeal(
                            meal.id,
                            'carbs',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-yellow-600">G:</span>
                      <input
                        type="number"
                        value={meal.fat || ''}
                        onChange={(e) =>
                          updateMeal(
                            meal.id,
                            'fat',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-yellow-500"
                      />
                    </div>

                    {isEditing && (
                      <button
                        onClick={() => removeMeal(meal.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Rimuovi
                      </button>
                    )}
                  </div>

                  {meal.notes && (
                    <div className="mt-2">
                      <textarea
                        value={meal.notes}
                        onChange={(e) =>
                          updateMeal(meal.id, 'notes', e.target.value)
                        }
                        placeholder="Note per il pasto..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary-500"
                        rows={2}
                      />
                    </div>
                  )}

                  {!meal.notes && (
                    <button
                      onClick={() => updateMeal(meal.id, 'notes', '')}
                      className="text-sm text-gray-500 hover:text-primary-600 mt-1"
                    >
                      + Aggiungi note
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="p-4 border-t">
            <button
              onClick={addMeal}
              className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded hover:border-primary-500 hover:text-primary-600"
            >
              + Aggiungi Pasto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
