import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTracks } from '../redux/slices/musicSlice';

export default function MusicPage() {
  const [mood, setMood] = useState('');
  const dispatch = useDispatch();
  const { tracks, loading, error } = useSelector((state) => state.music);

  const handleSearch = () => {
    if (!mood.trim()) return;
    dispatch(fetchTracks(mood));
  };

  const moodExamples = ['happy', 'sad', 'romantic', 'energetic', 'calm', 'focused', 'nostalgic', 'dreamy'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-6">
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white">
        <h1 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          🎶 Музыкальная шкатулка для твоего настроения 🎶
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Подбери идеальную музыку под любое состояние души
        </p>
        
        <div className="relative">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Какое у тебя сегодня настроение?"
            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg pl-12"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="mt-3 mb-4">
          <p className="text-sm text-gray-500 mb-2">Попробуй например:</p>
          <div className="flex flex-wrap gap-2">
            {moodExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => setMood(example)}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={handleSearch}
          disabled={loading}
          className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg disabled:opacity-70"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Ищем идеальные треки...
            </div>
          ) : (
            'Найти музыку'
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-xl text-center">
            <p className="text-red-600 font-medium">Ой! Что-то пошло не так:</p>
            <p className="text-red-500 mt-1">{error}</p>
            <button 
              onClick={handleSearch}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {tracks.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-center mb-4 text-purple-700">
              Мы подобрали для тебя {tracks.length} треков под настроение "{mood}"
            </h2>
            <div className="space-y-4">
              {tracks.map(({ name, artist, url }, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-all hover:border-purple-300"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-300 rounded-lg flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-grow">
                      <p className="font-semibold text-gray-800">{name || 'Без названия'}</p>
                      <p className="text-sm text-gray-600">{artist || 'Исполнитель неизвестен'}</p>
                    </div>
                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-lg text-sm hover:from-purple-600 hover:to-pink-500 transition-all"
                      >
                        Слушать
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tracks.length === 0 && !loading && !error && (
          <div className="mt-10 text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
            <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-purple-700 mb-2">Давай наполним мир музыкой!</h3>
            <p className="text-gray-600">
              Введи свое настроение, и мы подберем идеальные треки, чтобы создать нужную атмосферу.
              Попробуй "romantic" для романтического вечера или "energetic" для тренировки!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}