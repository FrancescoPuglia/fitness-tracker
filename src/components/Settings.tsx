import { useState } from 'react';
import { Storage } from '../storage';
import { downloadFile } from '../utils';

export default function Settings() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const handleExport = () => {
    const data = Storage.exportData();
    const filename = `fitness-data-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(data, filename);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = Storage.importData(content);

        if (success) {
          setImportStatus('success');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setImportStatus('error');
        }
      } catch {
        setImportStatus('error');
      }

      setTimeout(() => setImportStatus('idle'), 3000);
    };
    reader.readAsText(file);

    event.target.value = '';
  };

  const handleReset = () => {
    if (showConfirm) {
      Storage.clearAllData();
      setShowConfirm(false);
      window.location.reload();
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 5000);
    }
  };

  const getStorageInfo = () => {
    const workouts = Storage.getWorkoutDays();
    const diets = Storage.getDietDays();
    const records = Storage.getPersonalRecords();

    return {
      workouts: workouts.length,
      diets: diets.length,
      records: records.length,
      totalSize: new Blob([Storage.exportData()]).size,
    };
  };

  const storageInfo = getStorageInfo();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Impostazioni
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Backup e Ripristino
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Esporta Dati</div>
                  <div className="text-sm text-gray-600">
                    Scarica un backup completo dei tuoi dati in formato JSON
                  </div>
                </div>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Esporta
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Importa Dati</div>
                  <div className="text-sm text-gray-600">
                    Ripristina i dati da un file di backup JSON
                  </div>
                  {importStatus === 'success' && (
                    <div className="text-sm text-green-600 mt-1">
                      ✓ Dati importati con successo! Ricaricamento in corso...
                    </div>
                  )}
                  {importStatus === 'error' && (
                    <div className="text-sm text-red-600 mt-1">
                      ✗ Errore durante l'importazione. Controlla il formato del
                      file.
                    </div>
                  )}
                </div>
                <label className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">
                  Importa
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">
                    Cancella Tutti i Dati
                  </div>
                  <div className="text-sm text-gray-600">
                    Rimuovi permanentemente tutti i dati salvati
                  </div>
                  {showConfirm && (
                    <div className="text-sm text-orange-600 mt-1">
                      ⚠️ Clicca di nuovo per confermare la cancellazione
                      definitiva
                    </div>
                  )}
                </div>
                <button
                  onClick={handleReset}
                  className={`px-4 py-2 rounded-lg ${
                    showConfirm
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {showConfirm ? 'Conferma Cancellazione' : 'Cancella Dati'}
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Informazioni Storage
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">
                  {storageInfo.workouts}
                </div>
                <div className="text-sm text-gray-600">Allenamenti</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {storageInfo.diets}
                </div>
                <div className="text-sm text-gray-600">Piani dieta</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {storageInfo.records}
                </div>
                <div className="text-sm text-gray-600">Record personali</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(storageInfo.totalSize / 1024)}KB
                </div>
                <div className="text-sm text-gray-600">Spazio utilizzato</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Informazioni App
            </h3>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <strong>Fitness Tracker</strong> - Versione 1.0.0
                </div>
                <div>
                  Un'applicazione semplice e potente per tracciare allenamenti,
                  dieta e progressi. Tutti i dati sono salvati localmente nel
                  browser per la massima privacy.
                </div>
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="font-medium text-gray-700 mb-2">
                    Funzionalità:
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Tracciamento allenamenti con timer</li>
                    <li>• Pianificazione e monitoraggio dieta</li>
                    <li>• Calendario con streak e progressi</li>
                    <li>• Statistiche e record personali</li>
                    <li>• Backup e ripristino dati</li>
                    <li>• Funzionamento completamente offline</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
