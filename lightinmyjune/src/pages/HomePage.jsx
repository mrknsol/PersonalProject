import React, { useEffect, useState } from "react";

export default function HomePage() {
  const [showContent, setShowContent] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const [currentWish, setCurrentWish] = useState(0);
  
  const wishes = [
    "Каждый твой день пусть будет наполнен улыбками и теплом",
    "Пусть сбудутся все твои мечты, даже те, о которых ты ещё не рассказала",
    "Желаю тебе безграничного счастья и вдохновения каждый день",
    "Пусть жизнь дарит тебе только приятные сюрпризы и волшебные моменты",
    "Желаю тебе всегда оставаться такой же нежной, мудрой и прекрасной",
    "Пусть каждый новый день приносит тебе радость и новые причины для улыбок",
    "Желаю тебе бесконечного тепла, заботы и любви, которую ты заслуживаешь"
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    
    const elements = [];
    const types = ['heart', 'star', 'circle'];
    const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];
    
    for (let i = 0; i < 20; i++) {
      elements.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        size: Math.random() * 40 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        top: Math.random() * 100,
        left: Math.random() * 100,
        animationDuration: Math.random() * 20 + 10
      });
    }
    
    setFloatingElements(elements);
    
    // Автопереключение пожеланий
    const wishInterval = setInterval(() => {
      setCurrentWish((prev) => (prev + 1) % wishes.length);
    }, 4000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(wishInterval);
    };
  }, [wishes.length]);

  const renderFloatingElement = (element) => {
    const style = {
      top: `${element.top}%`,
      left: `${element.left}%`,
      width: `${element.size}px`,
      height: `${element.size}px`,
      animation: `float ${element.animationDuration}s infinite ease-in-out`,
      animationDelay: `${Math.random() * 5}s`,
      position: 'absolute',
      zIndex: 0,
      opacity: 0.6
    };

    switch (element.type) {
      case 'heart':
        return (
          <div key={element.id} style={style} className="animate-pulse">
            <svg viewBox="0 0 32 32" fill={element.color}>
              <path d="M16,28.261c0,0-14-7.926-14-17.046c0-9.356,13.159-10.399,14-0.454c1.011-9.938,14-8.903,14,0.454 C30,20.335,16,28.261,16,28.261z"/>
            </svg>
          </div>
        );
      case 'star':
        return (
          <div key={element.id} style={style} className="animate-spin-slow">
            <svg viewBox="0 0 24 24" fill={element.color}>
              <path d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div 
            key={element.id} 
            style={{ 
              ...style, 
              borderRadius: '50%',
              backgroundColor: element.color
            }} 
            className="animate-ping"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map(renderFloatingElement)}
        
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              bottom: '-50px',
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 120 + 20}px`,
              height: `${Math.random() * 120 + 20}px`,
              animation: `rise ${Math.random() * 20 + 10}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Контент с анимацией */}
      <div className={`relative z-10 max-w-4xl w-full transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold text-center mb-6 drop-shadow-lg">
          <span className="block mb-3 animate-pulse">💖 Моя любимая, с днём рождения! 💖</span>
          <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            Ты — мое вдохновение и радость в каждом дне.
          </span>
        </h1>
        
        {/* Блок с меняющимися пожеланиями */}
        <div className="mt-12 mb-10 h-40 flex items-center justify-center">
          <div className="relative w-full max-w-2xl">
            {wishes.map((wish, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                  currentWish === index 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
                  <p className="text-white text-xl md:text-2xl font-medium text-center italic">
                    "{wish}"
                  </p>
                </div>
              </div>
            ))}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-70">
              ❤️
            </div>
          </div>
        </div>
        
        {/* Дополнительные пожелания */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-pink-200/30 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/20 transition-all hover:scale-105">
            <p className="text-white text-lg text-center">
              Желаю тебе всегда оставаться такой же лучезарной, нежной и удивительной!
            </p>
          </div>
          <div className="bg-purple-200/30 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/20 transition-all hover:scale-105">
            <p className="text-white text-lg text-center">
              Пусть каждый твой день будет наполнен волшебством и приятными неожиданностями!
            </p>
          </div>
        </div>
        
        {/* Призыв к действию */}
        <div className="mt-12 text-center">
          <p className="text-white text-xl md:text-2xl font-light mb-4 drop-shadow-md">
            <span className="inline-block animate-bounce delay-300">↓</span>
            <br />
            <span className="inline-block mt-6 bg-white/30 backdrop-blur-sm rounded-full px-8 py-4 border-2 border-white/40 text-xl font-medium">
              Жми на пункты меню сверху, чтобы открыть удивительные страницы, созданные специально для тебя!
            </span>
          </p>
          
          <div className="mt-8 flex justify-center space-x-4">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="w-3 h-3 rounded-full bg-white animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Анимированные стили */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-30px) translateX(15px) rotate(5deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-15px) translateX(-15px) rotate(0deg);
            opacity: 0.7;
          }
          75% {
            transform: translateY(-25px) translateX(20px) rotate(-5deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.6;
          }
        }
        
        @keyframes rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-120vh) scale(1.8);
            opacity: 0;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}