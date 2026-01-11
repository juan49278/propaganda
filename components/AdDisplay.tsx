
import React, { useEffect, useState, useCallback } from 'react';
import { Product, Store } from '../types';
import { X, ChevronRight, Star, ChevronLeft } from 'lucide-react';

interface AdDisplayProps {
  products: Product[];
  store: Store;
  duration: number;
  onExit: () => void;
}

const AdDisplay: React.FC<AdDisplayProps> = ({ products, store, duration, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [progress, setProgress] = useState(0);

  const product = products[currentIndex];
  const themeColor = product.primaryColor || '#4f46e5';

  const nextSlide = useCallback(() => {
    setShowContent(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
      setProgress(0);
      setShowContent(true);
    }, 500);
  }, [products.length]);

  const prevSlide = useCallback(() => {
    setShowContent(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
      setProgress(0);
      setShowContent(true);
    }, 500);
  }, [products.length]);

  useEffect(() => {
    // Initial entrance
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (products.length <= 1) return;

    const interval = 100; // 100ms update frequency
    const totalSteps = (duration * 1000) / interval;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (100 / totalSteps);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, products.length, nextSlide]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-inter">
      {/* Progress Bar (at the top) */}
      {products.length > 1 && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 z-[120]">
          <div 
            className="h-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%`, backgroundColor: themeColor }}
          ></div>
        </div>
      )}

      {/* Dynamic Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] blur-[150px] rounded-full animate-pulse transition-all duration-1000"
          style={{ backgroundColor: themeColor }}
        ></div>
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full animate-pulse transition-all duration-1000 opacity-60"
          style={{ backgroundColor: themeColor, animationDelay: '1.5s' }}
        ></div>
      </div>

      {/* Control Buttons */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-[110]">
        {products.length > 1 && (
          <div className="flex gap-2 mr-4">
             <button 
              onClick={prevSlide}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
        <button 
          onClick={onExit}
          className="p-3 bg-rose-600/80 hover:bg-rose-600 text-white rounded-full transition-all backdrop-blur-md"
        >
          <X size={24} />
        </button>
      </div>

      {/* Slide Counter */}
      {products.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-[110]">
          {products.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-8' : 'w-2 bg-white/20'}`}
              style={{ backgroundColor: i === currentIndex ? themeColor : undefined }}
            ></div>
          ))}
        </div>
      )}

      {/* Main Container */}
      <div className={`w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-12 items-center transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        
        {/* Left Side: Product Image */}
        <div className="relative group">
          <div 
            className="absolute inset-0 blur-3xl scale-95 group-hover:scale-110 transition-transform duration-700 opacity-40"
            style={{ backgroundColor: themeColor }}
          ></div>
          
          <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10 shine-effect bg-slate-800">
            <img 
              src={product.imageUrl || `https://picsum.photos/seed/${product.id}/1200`} 
              className="w-full h-full object-cover animate-softZoom transition-transform duration-[3s]"
              alt={product.name}
              key={product.id} // Re-animate on change
            />
            
            {product.isPromotion && (
              <div 
                className="absolute top-8 left-8 text-white font-bebas text-4xl px-8 py-3 rounded-2xl shadow-xl transform -rotate-6 animate-bounce"
                style={{ backgroundColor: themeColor }}
              >
                {product.promotionType === 'dia' ? '¡OFERTA DEL DÍA!' : 
                 product.promotionType === 'semana' ? '¡OFERTA SEMANAL!' : '¡OFERTA ESPECIAL!'}
              </div>
            )}
            
            <div className="absolute bottom-8 right-8 flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-yellow-400 text-slate-900 p-2 rounded-xl shadow-lg">
                  <Star size={20} fill="currentColor" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="flex flex-col space-y-8 text-white">
          <header>
            <div 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-white/10"
              style={{ backgroundColor: `${themeColor}33`, color: themeColor }}
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: themeColor }}></span>
              {store.name}
            </div>
            <h1 className="text-6xl md:text-8xl font-bebas tracking-wide leading-none mb-4 drop-shadow-2xl">
              {product.name}
            </h1>
            {product.slogan && (
              <p className="text-2xl md:text-3xl font-bold leading-tight italic" style={{ color: themeColor }}>
                "{product.slogan}"
              </p>
            )}
          </header>

          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-medium">
            {product.description || "Calidad y frescura garantizada. Aprovecha esta oportunidad única disponible ahora en nuestra sucursal."}
          </p>

          <div className="flex flex-col gap-2">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Precio por {product.unit}</div>
            <div className="flex items-baseline gap-4">
              <span className="text-9xl font-bebas text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-none">
                <span className="text-5xl align-top mt-4 inline-block mr-2" style={{ color: themeColor }}>$</span>
                {product.price.toLocaleString()}
              </span>
              <span className="text-3xl font-bold text-slate-400 uppercase">/ {product.unit}</span>
            </div>
          </div>

          <div className="pt-8 flex flex-col gap-4">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">Visítanos en</div>
                  <div className="text-xl font-bold">{store.address}</div>
                </div>
                <div 
                  className="p-4 rounded-2xl shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: themeColor, boxShadow: `0 10px 20px ${themeColor}66` }}
                >
                  <ChevronRight size={32} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Ticker */}
      <div className="absolute bottom-0 left-0 w-full bg-slate-950/80 backdrop-blur-xl border-t border-white/5 py-4 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee space-x-12 px-12">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-4">
               {product.name} <span style={{ color: themeColor }}>•</span> {product.isPromotion ? (product.promotionType?.toUpperCase() || 'OFERTA') : 'EL MEJOR PRECIO'} <span style={{ color: themeColor }}>•</span> CALIDAD PREMIUN <span style={{ color: themeColor }}>•</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes softZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 30s linear infinite;
        }
        .animate-softZoom {
          animation: softZoom 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdDisplay;
