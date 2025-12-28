import { useState } from 'react';

interface ExerciseGuide {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  equipment: string[];
  videoUrl?: string;
  steps: string[];
  commonMistakes: string[];
  formCues: string[];
  variations: Array<{
    name: string;
    description: string;
    difficulty: 'easier' | 'harder';
  }>;
  safetyTips: string[];
  benefits: string[];
  progressionTips: string[];
}

const EXERCISE_GUIDES: ExerciseGuide[] = [
  {
    id: 'bench-press',
    name: 'Panca Piana Bilanciere',
    category: 'chest',
    difficulty: 'intermediate',
    muscleGroups: ['Pettorali', 'Deltoidi anteriori', 'Tricipiti'],
    equipment: ['Bilanciere', 'Panca piana', 'Rack'],
    videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
    steps: [
      'Sdraiati sulla panca con occhi sotto al bilanciere',
      'Posiziona i piedi saldamente a terra',
      'Afferra il bilanciere con presa leggermente più ampia delle spalle',
      'Ritira le scapole e mantieni l\'arco naturale della schiena',
      'Stacca il bilanciere e portalo sopra il petto',
      'Scendi controllando il peso fino al petto',
      'Spingi energicamente verso l\'alto mantenendo la traiettoria',
    ],
    commonMistakes: [
      'Rimbalzare il peso sul petto',
      'Sollevare i piedi da terra',
      'Presa troppo stretta o troppo larga',
      'Non controllare la fase eccentrica',
      'Perdere la tensione delle scapole',
    ],
    formCues: [
      'Spezza il bilanciere tirando le mani verso l\'esterno',
      'Pensa di spingere te stesso nella panca, non il peso verso l\'alto',
      'Mantieni sempre il controllo del movimento',
      'Respira in fase di discesa, espira in fase di spinta',
    ],
    variations: [
      {
        name: 'Panca inclinata',
        description: 'Maggiore enfasi sui fasci alti del pettorale',
        difficulty: 'harder',
      },
      {
        name: 'Panca con manubri',
        description: 'Maggiore ROM e stabilizzazione',
        difficulty: 'easier',
      },
      {
        name: 'Panca declinata',
        description: 'Focus sui fasci bassi del pettorale',
        difficulty: 'harder',
      },
    ],
    safetyTips: [
      'Usa sempre un spotter per carichi elevati',
      'Non bloccare i gomiti in modo completo',
      'Riscaldamento progressivo obbligatorio',
      'Mantieni sempre il controllo del bilanciere',
    ],
    benefits: [
      'Sviluppo massa pettorale',
      'Forza funzionale spinta',
      'Coordinazione multi-articolare',
      'Base per altri movimenti di spinta',
    ],
    progressionTips: [
      'Aumenta il peso gradualmente (2.5kg per volta)',
      'Varia il numero di ripetizioni (6-12 range)',
      'Alterna periodi di forza e ipertrofia',
      'Lavora su tecnica prima di aumentare i carichi',
    ],
  },
  {
    id: 'squat',
    name: 'Squat',
    category: 'legs',
    difficulty: 'intermediate',
    muscleGroups: ['Quadricipiti', 'Glutei', 'Femorali', 'Core'],
    equipment: ['Bilanciere', 'Rack'],
    videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8',
    steps: [
      'Posiziona il bilanciere sui trapezi superiori',
      'Stance alla larghezza spalle, piedi leggermente extra-ruotati',
      'Mantieni il petto alto e lo sguardo avanti',
      'Inizia il movimento spingendo i fianchi indietro',
      'Scendi mantenendo le ginocchia in linea con i piedi',
      'Arriva alla massima profondità possibile',
      'Spingi attraverso i talloni per risalire',
    ],
    commonMistakes: [
      'Ginocchia che collassano verso l\'interno',
      'Non scendere abbastanza in profondità',
      'Inclinare troppo il busto in avanti',
      'Sollevare i talloni da terra',
      'Non mantenere la neutralità della colonna',
    ],
    formCues: [
      'Pensa di sederti su una sedia dietro di te',
      'Spingi le ginocchia verso l\'esterno',
      'Mantieni il peso sui talloni',
      'Petto alto e core attivo',
    ],
    variations: [
      {
        name: 'Goblet squat',
        description: 'Versione con manubrio per imparare la tecnica',
        difficulty: 'easier',
      },
      {
        name: 'Front squat',
        description: 'Maggiore enfasi sui quadricipiti',
        difficulty: 'harder',
      },
      {
        name: 'Sumo squat',
        description: 'Stance largo per enfatizzare glutei e adduttori',
        difficulty: 'easier',
      },
    ],
    safetyTips: [
      'Usa sempre i safety bars nel rack',
      'Riscaldamento completo delle anche e caviglie',
      'Non superare mai la propria mobilità',
      'Progressione graduale dei carichi',
    ],
    benefits: [
      'Forza funzionale completa delle gambe',
      'Miglioramento dell\'equilibrio e coordinazione',
      'Aumento massa muscolare gambe e glutei',
      'Trasferimento ad attività sportive',
    ],
    progressionTips: [
      'Lavora prima sulla mobilità di anche e caviglie',
      'Inizia con il peso corporeo',
      'Aggiungi peso quando la tecnica è perfetta',
      'Varia le ripetizioni tra 5-15 secondo l\'obiettivo',
    ],
  },
  {
    id: 'deadlift',
    name: 'Stacco da Terra',
    category: 'back',
    difficulty: 'advanced',
    muscleGroups: ['Erettori spinali', 'Glutei', 'Femorali', 'Trapezi', 'Core'],
    equipment: ['Bilanciere', 'Dischi'],
    videoUrl: 'https://www.youtube.com/embed/op9kVnSso6Q',
    steps: [
      'Posiziona il bilanciere sopra la metà del piede',
      'Stance alla larghezza delle spalle',
      'Piegati e afferra il bilanciere con presa mista o doppia overhand',
      'Posiziona le spalle sopra o leggermente avanti al bilanciere',
      'Attiva il core e mantieni la schiena neutra',
      'Spingi il pavimento con i piedi mentre tiri il bilanciere',
      'Estendi simultaneamente anche e ginocchia',
      'Completa in piedi con anche e ginocchia completamente estese',
    ],
    commonMistakes: [
      'Bilanciere troppo lontano dal corpo',
      'Iniziare con le spalle troppo indietro rispetto al bilanciere',
      'Curvare la schiena durante il movimento',
      'Tirare solo con le braccia',
      'Non completare l\'estensione delle anche',
    ],
    formCues: [
      'Pensa di spingere il pavimento, non di tirare il peso',
      'Mantieni il bilanciere a contatto con le gambe',
      'Petto alto e spalle indietro',
      'Attiva il core come se dovessi ricevere un pugno',
    ],
    variations: [
      {
        name: 'Romanian Deadlift',
        description: 'Enfasi sui femorali, inizia dall\'alto',
        difficulty: 'easier',
      },
      {
        name: 'Sumo Deadlift',
        description: 'Stance largo, maggiore coinvolgimento quadricipiti',
        difficulty: 'harder',
      },
      {
        name: 'Deficit Deadlift',
        description: 'Da pedana rialzata per maggiore ROM',
        difficulty: 'harder',
      },
    ],
    safetyTips: [
      'Mai tentare PR senza riscaldamento adeguato',
      'Usa cintura solo per carichi >85% 1RM',
      'Gesso o straps per migliorare la presa',
      'Se la forma peggiora, ferma l\'allenamento',
    ],
    benefits: [
      'Forza funzionale completa della catena posteriore',
      'Miglioramento postura',
      'Aumento forza core e stabilità',
      'Transfert ad attività quotidiane',
    ],
    progressionTips: [
      'Inizia con trap bar o Romanian deadlift',
      'Concentrati sulla tecnica per mesi prima di aumentare carichi',
      'Usa variazioni per rompere plateau',
      'Includi lavoro di mobilità delle anche',
    ],
  },
  {
    id: 'pull-up',
    name: 'Trazioni alla Sbarra',
    category: 'back',
    difficulty: 'advanced',
    muscleGroups: ['Gran dorsale', 'Romboidi', 'Trapezio medio', 'Bicipiti'],
    equipment: ['Sbarra per trazioni'],
    steps: [
      'Afferra la sbarra con presa prona, larghezza spalle',
      'Appendi completamente con braccia estese',
      'Attiva le scapole tirandole verso il basso',
      'Inizia il movimento dal dorsale, non dalle braccia',
      'Tira il corpo verso l\'alto fino al mento sopra la sbarra',
      'Controlla la discesa fino all\'estensione completa',
    ],
    commonMistakes: [
      'Utilizzare slancio per salire',
      'Non completare l\'estensione in basso',
      'Tirare solo con le braccia',
      'Non attivare correttamente le scapole',
      'Oscillare durante il movimento',
    ],
    formCues: [
      'Immagina di tirare i gomiti verso le tasche posteriori',
      'Pensa di tirare la sbarra verso di te, non te verso la sbarra',
      'Mantieni il core attivo per evitare oscillazioni',
      'Scapole sempre attive e depresse',
    ],
    variations: [
      {
        name: 'Trazioni assistite con elastico',
        description: 'Per principianti che non riescono ancora a fare trazioni complete',
        difficulty: 'easier',
      },
      {
        name: 'Chin-up (presa supina)',
        description: 'Maggiore coinvolgimento bicipiti',
        difficulty: 'easier',
      },
      {
        name: 'Trazioni zavorrate',
        description: 'Con peso aggiuntivo per progressione',
        difficulty: 'harder',
      },
    ],
    safetyTips: [
      'Riscaldamento spalle e dorsale',
      'Progressione graduale se principiante',
      'Non forzare se senti dolore alle spalle',
      'Evita movimenti balistici eccessivi',
    ],
    benefits: [
      'Sviluppo completo catena di trazione',
      'Miglioramento presa e forza funzionale',
      'Definizione muscolare dorso',
      'Correzione squilibri posturali',
    ],
    progressionTips: [
      'Inizia con negative (solo fase eccentrica)',
      'Usa bande elastiche per assistenza',
      'Lavora su lat pulldown per costruire forza',
      'Obiettivo: 10 trazioni pulite prima di aggiungere peso',
    ],
  },
];

export default function TechnicalGuides() {
  const [selectedGuide, setSelectedGuide] = useState<ExerciseGuide | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    { id: 'all', name: 'Tutti', icon: '🏋️' },
    { id: 'chest', name: 'Petto', icon: '💪' },
    { id: 'back', name: 'Dorso', icon: '🔥' },
    { id: 'legs', name: 'Gambe', icon: '🦵' },
    { id: 'shoulders', name: 'Spalle', icon: '👑' },
    { id: 'arms', name: 'Braccia', icon: '💥' },
    { id: 'core', name: 'Core', icon: '⚡' },
  ];

  const filteredGuides = EXERCISE_GUIDES.filter(guide => {
    const categoryMatch = selectedCategory === 'all' || guide.category === selectedCategory;
    const searchMatch = guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       guide.muscleGroups.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  const getDifficultyColor = (difficulty: ExerciseGuide['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
    }
  };

  const getDifficultyIcon = (difficulty: ExerciseGuide['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return '🟢';
      case 'intermediate': return '🟡';
      case 'advanced': return '🔴';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-2xl">
        <h2 className="text-3xl font-black mb-2">🎯 TECHNICAL GUIDES</h2>
        <p className="text-cyan-100 text-lg font-medium">
          Guide complete per esecuzione perfetta
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cerca esercizio o gruppo muscolare..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-500/20 text-white'
                    : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500 hover:text-white'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
      {!selectedGuide ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600 cursor-pointer hover:border-gray-500 transition-all transform hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-white font-bold text-lg">{guide.name}</h3>
                <div className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyColor(guide.difficulty)}`}>
                  {getDifficultyIcon(guide.difficulty)} {guide.difficulty.toUpperCase()}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">MUSCOLI COINVOLTI</h4>
                  <div className="flex flex-wrap gap-1">
                    {guide.muscleGroups.map((muscle, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">ATTREZZATURA</h4>
                  <div className="flex flex-wrap gap-1">
                    {guide.equipment.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{guide.steps.length} step tecnici</span>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Visualizza Guida →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed Guide View */
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => setSelectedGuide(null)}
            className="flex items-center text-blue-400 hover:text-blue-300 font-medium"
          >
            ← Torna alla lista
          </button>

          {/* Guide Header */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-white font-black text-3xl">{selectedGuide.name}</h1>
              <div className={`px-3 py-2 rounded-lg text-sm font-bold ${getDifficultyColor(selectedGuide.difficulty)}`}>
                {getDifficultyIcon(selectedGuide.difficulty)} {selectedGuide.difficulty.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-400 font-medium mb-2">MUSCOLI COINVOLTI</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGuide.muscleGroups.map((muscle, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 font-medium mb-2">ATTREZZATURA NECESSARIA</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGuide.equipment.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Video Tutorial */}
          {selectedGuide.videoUrl && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
              <h2 className="text-white font-bold text-xl mb-4 flex items-center">
                <span className="mr-2">🎥</span>
                VIDEO TUTORIAL
              </h2>
              <div className="aspect-video">
                <iframe
                  src={selectedGuide.videoUrl}
                  title={`${selectedGuide.name} Tutorial`}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Step by Step */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
            <h2 className="text-white font-bold text-xl mb-4 flex items-center">
              <span className="mr-2">📋</span>
              ESECUZIONE STEP-BY-STEP
            </h2>
            <div className="space-y-4">
              {selectedGuide.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Cues & Common Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
              <h2 className="text-white font-bold text-xl mb-4 flex items-center">
                <span className="mr-2">✅</span>
                FORM CUES
              </h2>
              <ul className="space-y-2">
                {selectedGuide.formCues.map((cue, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    <span className="text-gray-300">{cue}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
              <h2 className="text-white font-bold text-xl mb-4 flex items-center">
                <span className="mr-2">❌</span>
                ERRORI COMUNI
              </h2>
              <ul className="space-y-2">
                {selectedGuide.commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    <span className="text-gray-300">{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Variations */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
            <h2 className="text-white font-bold text-xl mb-4 flex items-center">
              <span className="mr-2">🔄</span>
              VARIANTI
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedGuide.variations.map((variation, index) => (
                <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-bold">{variation.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      variation.difficulty === 'easier' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {variation.difficulty === 'easier' ? '🟢 PIÙ FACILE' : '🔴 PIÙ DIFFICILE'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{variation.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits, Safety, Progression */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <span className="mr-2">💎</span>
                BENEFICI
              </h3>
              <ul className="space-y-2">
                {selectedGuide.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-400 flex-shrink-0">•</span>
                    <span className="text-gray-300 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <span className="mr-2">🛡️</span>
                SICUREZZA
              </h3>
              <ul className="space-y-2">
                {selectedGuide.safetyTips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-400 flex-shrink-0">⚠️</span>
                    <span className="text-gray-300 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                <span className="mr-2">📈</span>
                PROGRESSIONE
              </h3>
              <ul className="space-y-2">
                {selectedGuide.progressionTips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-400 flex-shrink-0">🎯</span>
                    <span className="text-gray-300 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}