import { useState, useEffect, useCallback } from 'react';
import { Storage } from '../storage';
import { formatDate, formatDisplayDate } from '../utils';

interface DayData {
  date: string;
  hasWorkout: boolean;
  hasDiet: boolean;
  workoutCompletion: number;
  dietCompletion: number;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const loadCalendarData = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOfWeek = new Date(firstDay);
    startOfWeek.setDate(firstDay.getDate() - firstDay.getDay());
    const endOfWeek = new Date(lastDay);
    endOfWeek.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    const data: DayData[] = [];
    const current = new Date(startOfWeek);

    while (current <= endOfWeek) {
      const dateString = formatDate(current);
      const workout = Storage.getWorkoutDay(dateString);
      const diet = Storage.getDietDay(dateString);

      const workoutCompletion = workout 
        ? workout.exercises.filter(ex => ex.completed).length / workout.exercises.length 
        : 0;
      
      const dietCompletion = diet 
        ? diet.meals.filter(meal => meal.completed).length / diet.meals.length 
        : 0;

      data.push({
        date: dateString,
        hasWorkout: workoutCompletion > 0,
        hasDiet: dietCompletion > 0,
        workoutCompletion,
        dietCompletion
      });

      current.setDate(current.getDate() + 1);
    }

    setCalendarData(data);
  }, [currentDate]);

  useEffect(() => {
    loadCalendarData();
  }, [currentDate, loadCalendarData]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const isCurrentMonth = (dateString: string) => {
    const date = new Date(dateString);
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (dateString: string) => {
    return dateString === formatDate(new Date());
  };

  const calculateStreak = () => {
    const workouts = Storage.getWorkoutDays();
    const today = new Date();
    let streak = 0;

    for (let i = 0; i >= -30; i--) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dateString = formatDate(checkDate);
      
      const workout = workouts.find(w => w.date === dateString);
      const hasCompleted = workout && workout.exercises.some(ex => ex.completed);

      if (hasCompleted) {
        if (i === 0 || streak > 0) {
          streak++;
        }
      } else if (i === 0) {
        break;
      } else if (streak > 0) {
        break;
      }
    }

    return streak;
  };

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  const monthName = currentDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  const currentStreak = calculateStreak();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 capitalize">
              {monthName}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{currentStreak}</div>
              <div className="text-sm text-gray-600">Streak giorni</div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                ←
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
          
          {calendarData.map((dayData) => {
            const date = new Date(dayData.date);
            const dayNumber = date.getDate();
            
            return (
              <button
                key={dayData.date}
                onClick={() => setSelectedDay(dayData)}
                className={`
                  relative p-2 h-12 text-sm rounded transition-colors
                  ${!isCurrentMonth(dayData.date) ? 'text-gray-300' : 'text-gray-900'}
                  ${isToday(dayData.date) ? 'bg-primary-100 border-2 border-primary-500' : 'hover:bg-gray-100'}
                `}
              >
                <span className="relative z-10">{dayNumber}</span>
                
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {dayData.hasWorkout && (
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        dayData.workoutCompletion >= 0.7 ? 'bg-green-500' : 
                        dayData.workoutCompletion >= 0.3 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  )}
                  {dayData.hasDiet && (
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        dayData.dietCompletion >= 0.7 ? 'bg-blue-500' : 
                        dayData.dietCompletion >= 0.3 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Allenamento completo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Dieta completa</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">Parziale</span>
          </div>
        </div>
      </div>

      {selectedDay && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {formatDisplayDate(selectedDay.date)}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Allenamento</h4>
              {selectedDay.hasWorkout ? (
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    Completamento: {Math.round(selectedDay.workoutCompletion * 100)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${selectedDay.workoutCompletion * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Nessun allenamento registrato</div>
              )}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Dieta</h4>
              {selectedDay.hasDiet ? (
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    Pasti completati: {Math.round(selectedDay.dietCompletion * 100)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${selectedDay.dietCompletion * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Nessuna dieta registrata</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}