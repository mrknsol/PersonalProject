import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchFact } from '../redux/slices/factsSlice';

const FactsPage = () => {
  const dispatch = useAppDispatch();
  const { fact, loading, error } = useAppSelector((state) => state.facts);

  const handleClick = () => {
    dispatch(fetchFact());
    console.log(fact);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-pink-700 mb-8 text-center">
        ✨ Удивительный факт для тебя ✨
      </h1>

      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-pink-500 text-white text-lg px-8 py-4 rounded-full shadow-xl hover:bg-pink-600 transition-all duration-300 disabled:opacity-50"
      >
        {loading ? 'Загрузка...' : 'Получить факт'}
      </button>

      {fact && (
        <div className="mt-10 bg-white p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-pink-200 max-w-xl w-full transition-all duration-500 ease-in-out animate-fade-in">
          <p className="text-center text-xl md:text-2xl text-pink-800 font-serif leading-relaxed">
            “{fact}”
          </p>
        </div>
      )}

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default FactsPage;