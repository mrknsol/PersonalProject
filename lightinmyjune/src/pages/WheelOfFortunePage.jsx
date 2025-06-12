import React, { useState, useRef } from 'react';

const wheelItems = [
  "Обменяться любимыми песнями на день",
  "Посчитать, сколько у нас общих привычек",
  "Придумать друг другу по одному милому прозвищу",
  "Сказать три вещи, которые тебе нравятся в друг друге (не внешность)",
  "Найти одно слово, которое нас обоих описывает",
  "Устроить маленький квиз друг о друге",
  "Собрать общий плейлист в Spotify",
  "Составить мини-список желаний на лето",
  "Послать друг другу случайную фотографию дня"
];
const sectorCount = wheelItems.length;
const sectorAngle = 360 / sectorCount;

export default function WheelOfFortune() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const wheelRef = useRef(null);

  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    const selectedIndex = Math.floor(Math.random() * sectorCount);
    const extraSpins = 3 * 360;
    const finalRotation = extraSpins + (360 - selectedIndex * sectorAngle) - sectorAngle / 2;

    wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)';
    wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;

    setTimeout(() => {
      setSpinning(false);
      setResult(wheelItems[selectedIndex]);
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = `rotate(${(360 - selectedIndex * sectorAngle) - sectorAngle / 2}deg)`;
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-300 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-8 text-center">Колесо судьбы</h1>

      <div className="relative w-96 h-96">
        {/* SVG колесо */}
        <svg
          ref={wheelRef}
          className="w-full h-full rounded-full shadow-lg"
          viewBox="0 0 300 300"
          style={{ transformOrigin: '50% 50%' }}
        >
          {wheelItems.map((item, i) => {
            const startAngle = i * sectorAngle;
            const endAngle = startAngle + sectorAngle;
            const largeArcFlag = sectorAngle > 180 ? 1 : 0;
            const radius = 150;

            const x1 = 150 + radius * Math.cos((Math.PI * startAngle) / 180);
            const y1 = 150 + radius * Math.sin((Math.PI * startAngle) / 180);
            const x2 = 150 + radius * Math.cos((Math.PI * endAngle) / 180);
            const y2 = 150 + radius * Math.sin((Math.PI * endAngle) / 180);

            // Обновленные цвета для секторов
            const fillColor = i % 2 === 0 ? '#c4b5fd' : '#fbcfe8';
            const strokeColor = i % 2 === 0 ? '#8b5cf6' : '#ec4899';

            const textAngle = startAngle + sectorAngle / 2;
            const textRadius = radius * 0.55;
            const textX = 150 + textRadius * Math.cos((Math.PI * textAngle) / 180);
            const textY = 150 + textRadius * Math.sin((Math.PI * textAngle) / 180);

            const maxTextLength = 22;
            const displayText =
              item.length > maxTextLength ? item.slice(0, maxTextLength - 3) + '...' : item;

            return (
              <g key={i}>
                <path
                  d={`M150 150 L${x1} ${y1} A${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="#4c1d95"
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${textAngle} ${textX} ${textY})`}
                  style={{ userSelect: 'none' }}
                >
                  {displayText}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Исправленная стрелка (справа по центру) */}
        <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
          <svg width="32" height="32" viewBox="0 0 24 24">
            <polygon points="0,12 14,4 14,20" fill="#7e22ce" />
            <circle cx="14" cy="12" r="3" fill="#7e22ce" />
          </svg>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="mt-10 px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-fuchsia-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {spinning ? 'Крутим...' : 'Крутить колесо'}
      </button>

      {result && (
        <div className="mt-8 max-w-md text-center bg-white rounded-2xl p-6 shadow-lg text-purple-900 text-xl font-semibold select-text animate-pulse">
          🎯 {result}
        </div>
      )}
    </div>
  );
}