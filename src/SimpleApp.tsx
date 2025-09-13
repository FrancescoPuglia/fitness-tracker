import { useState } from 'react';

interface Exercise {
  id: string;
  name: string;
  completed: boolean;
}

interface Meal {
  id: string;
  name: string;
  completed: boolean;
}

export default function SimpleApp() {
  const [activeTab, setActiveTab] = useState<'workout' | 'diet'>('workout');
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', name: 'Squat', completed: false },
    { id: '2', name: 'Push-ups', completed: false },
    { id: '3', name: 'Plank', completed: false },
  ]);

  const [meals, setMeals] = useState<Meal[]>([
    { id: '1', name: 'Breakfast', completed: false },
    { id: '2', name: 'Lunch', completed: false },
    { id: '3', name: 'Dinner', completed: false },
  ]);

  const toggleExercise = (id: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, completed: !ex.completed } : ex
      )
    );
  };

  const toggleMeal = (id: string) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === id ? { ...meal, completed: !meal.completed } : meal
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-green-600">
            🏋️ Fitness Tracker
          </h1>
          <p className="text-gray-600">Track your workouts and diet simply!</p>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('workout')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'workout'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              💪 Workout
            </button>
            <button
              onClick={() => setActiveTab('diet')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'diet'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              🍽️ Diet
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'workout' ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Workout</h2>
            <div className="space-y-3">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center space-x-3 p-3 border rounded"
                >
                  <input
                    type="checkbox"
                    checked={exercise.completed}
                    onChange={() => toggleExercise(exercise.id)}
                    className="w-5 h-5 text-green-500"
                    aria-label={`Mark ${exercise.name} as completed`}
                  />
                  <span
                    className={`font-medium ${exercise.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                  >
                    {exercise.name}
                  </span>
                  {exercise.completed && (
                    <span className="text-green-500">✓ Done!</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-green-600 font-semibold">
              Completed: {exercises.filter((ex) => ex.completed).length} /{' '}
              {exercises.length}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Meals</h2>
            <div className="space-y-3">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center space-x-3 p-3 border rounded"
                >
                  <input
                    type="checkbox"
                    checked={meal.completed}
                    onChange={() => toggleMeal(meal.id)}
                    className="w-5 h-5 text-green-500"
                    aria-label={`Mark ${meal.name} as completed`}
                  />
                  <span
                    className={`font-medium ${meal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                  >
                    {meal.name}
                  </span>
                  {meal.completed && (
                    <span className="text-green-500">✓ Eaten!</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-green-600 font-semibold">
              Completed: {meals.filter((m) => m.completed).length} /{' '}
              {meals.length}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            🎉 <strong>App is working perfectly!</strong> All components loaded
            successfully!
          </div>
        </div>
      </main>
    </div>
  );
}
