import { useState, useEffect, useRef } from 'react';

interface ProgressPhoto {
  id: string;
  url: string;
  date: string;
  weight?: number;
  notes?: string;
  category: 'front' | 'side' | 'back' | 'pose';
  thumbnail?: string;
}

interface PhotoSession {
  id: string;
  date: string;
  photos: ProgressPhoto[];
  weight?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    arms?: number;
    thighs?: number;
  };
  notes?: string;
}

export default function PhotoProgress() {
  const [sessions, setSessions] = useState<PhotoSession[]>([]);
  const [, setSelectedSession] = useState<PhotoSession | null>(null);
  const [showCapture, setShowCapture] = useState(false);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [compareMode, setCompareMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<ProgressPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    loadSessions();
    return () => {
      // Clean up camera stream
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const loadSessions = () => {
    const stored = localStorage.getItem('fitness_photo_sessions');
    if (stored) {
      setSessions(JSON.parse(stored));
    }
  };

  const saveSessions = (newSessions: PhotoSession[]) => {
    localStorage.setItem('fitness_photo_sessions', JSON.stringify(newSessions));
    setSessions(newSessions);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 1920, 
          height: 1080,
          facingMode: 'environment' // Use back camera on mobile
        } 
      });
      setCameraStream(stream);
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Impossibile accedere alla camera. Usa il caricamento da file.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = (category: ProgressPhoto['category']) => {
    if (!cameraRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = cameraRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx?.drawImage(video, 0, 0);
    
    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
    const thumbnail = createThumbnail(dataURL);

    const newPhoto: ProgressPhoto = {
      id: Date.now().toString(),
      url: dataURL,
      date: new Date().toISOString(),
      category,
      thumbnail,
    };

    addPhotoToCurrentSession(newPhoto);
  };

  const createThumbnail = (dataURL: string): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise<string>((resolve) => {
      img.onload = () => {
        const size = 150;
        canvas.width = size;
        canvas.height = size;
        
        // Calculate crop to center square
        const minDim = Math.min(img.width, img.height);
        const x = (img.width - minDim) / 2;
        const y = (img.height - minDim) / 2;
        
        ctx?.drawImage(img, x, y, minDim, minDim, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = dataURL;
    }) as any;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, category: ProgressPhoto['category']) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURL = e.target?.result as string;
      const thumbnail = createThumbnail(dataURL);

      const newPhoto: ProgressPhoto = {
        id: Date.now().toString(),
        url: dataURL,
        date: new Date().toISOString(),
        category,
        thumbnail: thumbnail as string,
      };

      addPhotoToCurrentSession(newPhoto);
    };
    reader.readAsDataURL(file);
  };

  const addPhotoToCurrentSession = (photo: ProgressPhoto) => {
    const today = new Date().toISOString().split('T')[0];
    let currentSession = sessions.find(s => s.date === today);

    if (!currentSession) {
      currentSession = {
        id: Date.now().toString(),
        date: today,
        photos: [],
        weight: currentWeight,
        notes: sessionNotes,
      };
    }

    currentSession.photos.push(photo);
    
    const updatedSessions = sessions.filter(s => s.date !== today);
    updatedSessions.unshift(currentSession);
    
    saveSessions(updatedSessions);
    setSelectedSession(currentSession);
  };

  const deletePhoto = (sessionId: string, photoId: string) => {
    const updatedSessions = sessions.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          photos: session.photos.filter(photo => photo.id !== photoId)
        };
      }
      return session;
    }).filter(session => session.photos.length > 0); // Remove empty sessions

    saveSessions(updatedSessions);
    
    // Update selected session
    const updatedSession = updatedSessions.find(s => s.id === sessionId);
    setSelectedSession(updatedSession || null);
  };

  const toggleComparePhoto = (photo: ProgressPhoto) => {
    if (comparePhotos.find(p => p.id === photo.id)) {
      setComparePhotos(comparePhotos.filter(p => p.id !== photo.id));
    } else if (comparePhotos.length < 4) {
      setComparePhotos([...comparePhotos, photo]);
    }
  };

  const getCategoryIcon = (category: ProgressPhoto['category']) => {
    switch (category) {
      case 'front': return '🔄';
      case 'side': return '↩️';
      case 'back': return '🔃';
      case 'pose': return '💪';
    }
  };

  const getCategoryName = (category: ProgressPhoto['category']) => {
    switch (category) {
      case 'front': return 'Frontale';
      case 'side': return 'Profilo';
      case 'back': return 'Posteriore';
      case 'pose': return 'Posa';
    }
  };

  const getCategoryColor = (category: ProgressPhoto['category']) => {
    switch (category) {
      case 'front': return 'bg-blue-500';
      case 'side': return 'bg-green-500';
      case 'back': return 'bg-purple-500';
      case 'pose': return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-2xl">
        <h2 className="text-3xl font-black mb-2">📸 PROGRESS PHOTOS</h2>
        <p className="text-purple-100 text-lg font-medium">
          Traccia la tua trasformazione visiva
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setShowCapture(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
        >
          <span className="mr-2">📷</span>
          NUOVA SESSIONE FOTO
        </button>
        
        <button
          onClick={() => setCompareMode(!compareMode)}
          className={`px-6 py-3 ${compareMode ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg`}
        >
          <span className="mr-2">🔄</span>
          {compareMode ? 'ESCI CONFRONTO' : 'MODALITÀ CONFRONTO'}
        </button>
        
        {compareMode && comparePhotos.length > 0 && (
          <button
            onClick={() => setComparePhotos([])}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
          >
            <span className="mr-2">🗑️</span>
            PULISCI CONFRONTO ({comparePhotos.length})
          </button>
        )}
      </div>

      {/* Compare Mode Panel */}
      {compareMode && comparePhotos.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
          <h3 className="text-white font-bold text-xl mb-4">
            🔍 CONFRONTO PROGRESS ({comparePhotos.length}/4)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {comparePhotos.map((photo, index) => (
              <div key={photo.id} className="relative">
                <img
                  src={photo.url}
                  alt={`Compare ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg border-2 border-yellow-500"
                />
                <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-xs">
                  {new Date(photo.date).toLocaleDateString('it-IT')}
                </div>
                <div className={`absolute top-2 right-2 ${getCategoryColor(photo.category)} px-2 py-1 rounded text-white text-xs`}>
                  {getCategoryIcon(photo.category)} {getCategoryName(photo.category)}
                </div>
                <button
                  onClick={() => toggleComparePhoto(photo)}
                  className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      {showCapture && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-xl">📷 NUOVA SESSIONE FOTO</h3>
              <button
                onClick={() => {
                  setShowCapture(false);
                  stopCamera();
                }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Session Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Peso attuale (kg)</label>
                <input
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
                  placeholder="75.5"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Note sessione</label>
                <input
                  type="text"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
                  placeholder="Post-workout, buona luce..."
                />
              </div>
            </div>

            {/* Camera Controls */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                📹 Avvia Camera
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                ⏹️ Stop Camera
              </button>
            </div>

            {/* Camera View */}
            <div className="mb-6">
              <video
                ref={cameraRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 bg-gray-900 rounded-lg object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Capture Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {(['front', 'side', 'back', 'pose'] as const).map((category) => (
                <div key={category}>
                  <button
                    onClick={() => capturePhoto(category)}
                    disabled={!cameraStream}
                    className={`w-full p-4 ${getCategoryColor(category)} hover:opacity-80 disabled:opacity-50 text-white rounded-lg font-bold transition-all`}
                  >
                    <div className="text-2xl mb-2">{getCategoryIcon(category)}</div>
                    <div className="text-sm">{getCategoryName(category)}</div>
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, category)}
                    className="hidden"
                  />
                  <button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => handleFileUpload(e as any, category);
                      input.click();
                    }}
                    className="w-full mt-2 p-2 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs"
                  >
                    📁 Upload
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sessions Timeline */}
      <div className="space-y-6">
        {sessions.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-600 text-center">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-bold text-white mb-2">Nessuna foto ancora</h3>
            <p className="text-gray-400">
              Inizia a tracciare la tua trasformazione con la prima sessione foto!
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">
                    📅 {new Date(session.date).toLocaleDateString('it-IT', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                  {session.weight && (
                    <p className="text-gray-400">Peso: {session.weight}kg</p>
                  )}
                  {session.notes && (
                    <p className="text-gray-300 text-sm">{session.notes}</p>
                  )}
                </div>
                <div className="text-gray-400">
                  {session.photos.length} foto
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {session.photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.thumbnail || photo.url}
                      alt={`Progress ${photo.category}`}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-105"
                      onClick={() => {
                        if (compareMode) {
                          toggleComparePhoto(photo);
                        } else {
                          // Open full view modal
                          window.open(photo.url, '_blank');
                        }
                      }}
                    />
                    
                    <div className={`absolute top-2 left-2 ${getCategoryColor(photo.category)} px-2 py-1 rounded text-white text-xs`}>
                      {getCategoryIcon(photo.category)}
                    </div>

                    {compareMode && (
                      <div className="absolute top-2 right-2">
                        <input
                          type="checkbox"
                          checked={comparePhotos.some(p => p.id === photo.id)}
                          onChange={() => toggleComparePhoto(photo)}
                          className="w-5 h-5"
                        />
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePhoto(session.id, photo.id);
                      }}
                      className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600 text-center">
          <div className="text-3xl mb-2">📸</div>
          <div className="text-2xl font-bold text-white">
            {sessions.reduce((sum, session) => sum + session.photos.length, 0)}
          </div>
          <div className="text-gray-400 text-sm">Foto Totali</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600 text-center">
          <div className="text-3xl mb-2">📅</div>
          <div className="text-2xl font-bold text-white">{sessions.length}</div>
          <div className="text-gray-400 text-sm">Sessioni</div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600 text-center">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold text-white">
            {sessions.length > 1 && sessions[0]?.weight && sessions[sessions.length - 1]?.weight
              ? ((sessions[0]?.weight || 0) - (sessions[sessions.length - 1]?.weight || 0) > 0 ? '+' : '') +
                ((sessions[0]?.weight || 0) - (sessions[sessions.length - 1]?.weight || 0)).toFixed(1)
              : '0'
            }kg
          </div>
          <div className="text-gray-400 text-sm">Variazione Peso</div>
        </div>
      </div>
    </div>
  );
}