import { useState, useEffect, useCallback } from 'react';
import { Storage } from '../storage';
import type { PersonalRecord } from '../types';

interface WeeklyStats {
  week: string;
  workoutDays: number;
  dietCompliance: number;
  totalCalories: number;
}

export default function Statistics() {
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'30' | '90' | '365'>('30');

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics, selectedPeriod]);

  const loadStatistics = useCallback(() => {
    const records = Storage.getPersonalRecords();
    const workouts = Storage.getWorkoutDays();
    const diets = Storage.getDietDays();

    setPersonalRecords(records.sort((a, b) => b.weight - a.weight));

    const days = parseInt(selectedPeriod);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const weekly: WeeklyStats[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const weekStart = new Date(current);
      const weekEnd = new Date(current);
      weekEnd.setDate(current.getDate() + 6);

      const weekWorkouts = workouts.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
      });

      const weekDiets = diets.filter(d => {
        const dietDate = new Date(d.date);
        return dietDate >= weekStart && dietDate <= weekEnd;
      });

      const workoutDays = weekWorkouts.filter(w => 
        w.exercises.some(ex => ex.completed)
      ).length;

      const totalMeals = weekDiets.reduce((sum, d) => sum + d.meals.length, 0);
      const completedMeals = weekDiets.reduce((sum, d) => 
        sum + d.meals.filter(m => m.completed).length, 0);
      
      const dietCompliance = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;

      const totalCalories = weekDiets.reduce((sum, d) => 
        sum + d.meals.filter(m => m.completed).reduce((mealSum, m) => 
          mealSum + (m.calories || 0), 0), 0);

      weekly.push({
        week: `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`,
        workoutDays,
        dietCompliance,
        totalCalories
      });

      current.setDate(current.getDate() + 7);
    }

    setWeeklyStats(weekly.reverse());
  }, [selectedPeriod]);

  const calculateOverallStats = () => {
    const workouts = Storage.getWorkoutDays();
    const diets = Storage.getDietDays();

    const totalWorkoutDays = workouts.filter(w => 
      w.exercises.some(ex => ex.completed)
    ).length;

    const totalMeals = diets.reduce((sum, d) => sum + d.meals.length, 0);
    const completedMeals = diets.reduce((sum, d) => 
      sum + d.meals.filter(m => m.completed).length, 0);
    
    const avgDietCompliance = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;

    const totalWorkoutTime = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const avgWorkoutTime = totalWorkoutDays > 0 ? totalWorkoutTime / totalWorkoutDays : 0;

    return {
      totalWorkoutDays,
      avgDietCompliance: Math.round(avgDietCompliance),
      avgWorkoutTime: Math.round(avgWorkoutTime / 60),
      totalPRs: personalRecords.length
    };
  };

  const overallStats = calculateOverallStats();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Statistiche Generali</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as '30' | '90' | '365')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
          >
            <option value="30">Ultimi 30 giorni</option>
            <option value="90">Ultimi 3 mesi</option>
            <option value="365">Ultimo anno</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{overallStats.totalWorkoutDays}</div>
            <div className="text-sm text-gray-600">Giorni di allenamento</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{overallStats.avgDietCompliance}%</div>
            <div className="text-sm text-gray-600">Aderenza dieta media</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{overallStats.avgWorkoutTime}min</div>
            <div className="text-sm text-gray-600">Durata media allenamento</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{overallStats.totalPRs}</div>
            <div className="text-sm text-gray-600">Record personali</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Personali</h3>
          
          {personalRecords.length > 0 ? (
            <div className="space-y-3">
              {personalRecords.slice(0, 10).map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{record.exerciseName}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(record.date).toLocaleDateString('it-IT')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary-600">{record.weight}kg</div>
                    <div className="text-sm text-gray-600">{record.reps} rip</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Nessun record personale registrato ancora.
              <br />
              Inizia ad allenarti per vedere i tuoi progressi!
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Andamento Settimanale</h3>
          
          {weeklyStats.length > 0 ? (
            <div className="space-y-4">
              {weeklyStats.map((week, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{week.week}</div>
                    <div className="text-sm text-gray-600">{week.workoutDays} giorni</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Aderenza dieta</div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${week.dietCompliance}%` }}
                          />
                        </div>
                        <div className="font-medium">{Math.round(week.dietCompliance)}%</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gray-600">Calorie totali</div>
                      <div className="font-medium">{week.totalCalories.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Nessun dato disponibile per il periodo selezionato.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}