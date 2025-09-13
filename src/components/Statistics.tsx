import { useState, useEffect } from 'react';

interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  timestamp: string;
}

export default function Statistics() {
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);

  useEffect(() => {
    const loadPersonalRecords = () => {
      const recordsData = localStorage.getItem('personal_records');
      const records = recordsData ? JSON.parse(recordsData) : [];
      setPersonalRecords(records.sort((a: PersonalRecord, b: PersonalRecord) => b.weight - a.weight));
    };

    loadPersonalRecords();
    
    // Aggiorna PR ogni 10 secondi per catturare nuovi record
    const interval = setInterval(loadPersonalRecords, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-2xl">
        <h2 className="text-3xl font-black mb-2">📈 DOMINATE</h2>
        <p className="text-blue-100 text-lg font-medium">
          I tuoi progressi e record personali
        </p>
      </div>

      {/* Personal Records */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="text-2xl mr-3">🏆</span>
          RECORD PERSONALI
        </h3>

        {personalRecords.length > 0 ? (
          <div className="space-y-3">
            {personalRecords.map((record, index) => (
              <div
                key={`${record.exerciseName}-${record.timestamp}`}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
              >
                <div className="flex-1">
                  <div className="text-white font-bold text-lg">
                    {record.exerciseName}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {new Date(record.date).toLocaleDateString('it-IT')}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-yellow-400 font-black text-xl">
                    {record.weight}kg
                  </div>
                  <div className="text-gray-400 text-sm">
                    {record.reps} reps
                  </div>
                </div>
                
                {index === 0 && (
                  <div className="ml-3">
                    <span className="text-2xl">🥇</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-4">💪</div>
            <div className="text-xl font-bold mb-2">Nessun record ancora</div>
            <div className="text-sm">
              Completa i tuoi primi allenamenti per iniziare a tracciare i tuoi progressi!
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600 text-center">
          <div className="text-3xl mb-2">🏋️</div>
          <div className="text-2xl font-black text-white">{personalRecords.length}</div>
          <div className="text-gray-400 text-sm">Record Totali</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600 text-center">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-2xl font-black text-yellow-400">
            {personalRecords.length > 0 
              ? Math.max(...personalRecords.map(r => r.weight))
              : 0
            }kg
          </div>
          <div className="text-gray-400 text-sm">Peso Max</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-black text-green-400">
            {personalRecords.length > 0 
              ? personalRecords.filter((r, i, arr) => 
                  arr.findIndex(r2 => r2.exerciseName === r.exerciseName) === i
                ).length
              : 0
            }
          </div>
          <div className="text-gray-400 text-sm">Esercizi Tracked</div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600 text-center">
        <div className="text-4xl mb-4">🚀</div>
        <h3 className="text-xl font-bold text-white mb-2">
          STATISTICHE AVANZATE IN ARRIVO
        </h3>
        <p className="text-gray-400">
          Grafici di progresso, analisi settimanali e molto altro...
        </p>
      </div>
    </div>
  );
}