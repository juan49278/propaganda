
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Product, Store, Announcement } from '../types';
import { X, ChevronRight, Megaphone, Star, ShieldCheck, Zap } from 'lucide-react';

interface AdDisplayProps {
  items: (Product | Announcement)[];
  store: Store;
  duration: number;
  onExit: () => void;
}

const AdDisplay: React.FC<AdDisplayProps> = ({ items, store, duration, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentItem = items[currentIndex];
  const isProduct = 'price' in currentItem;
  const product = isProduct ? (currentItem as Product) : null;
  const announcement = !isProduct ? (currentItem as Announcement) : null;

  const themeColor = product ? (product.primaryColor || '#4f46e5') : (announcement?.backgroundColor || '#1e293b');

  const getPromoLabel = (type?: string) => {
    switch (type) {
      case 'dia': return '¡OFERTA DEL DÍA!';
      case 'semana': return '¡OFERTA DE LA SEMANA!';
      case 'general':
      default: return '¡OFERTA IMPERDIBLE!';
    }
  };

  const tickerMessages = useMemo(() => {
    if (isProduct && product) {
      const messages = [
        product.name.toUpperCase(),
        "CALIDAD GARANTIZADA",
        "DISPONIBLE AHORA",
        store.name.toUpperCase()
      ];
      if (product.isPromotion) {
        messages.push("¡OFERTA LIMITADA!");
        messages.push(`MEJOR PRECIO: $${product.price.toLocaleString()}`);
      }
      if (product.category?.toLowerCase().includes('carne')) {
        messages.push("CALIDAD PREMIUM SELECCIONADA");
      }
      return messages;
    } else if (announcement) {
      return [
        announcement.title.toUpperCase(),
        "AVISO IMPORTANTE",
        store.name.toUpperCase(),
        "¡GRACIAS POR SU VISITA!"
      ];
    }
    return [];
  }, [currentItem, store.name, isProduct, product, announcement]);

  const nextSlide = useCallback(() => {
    setShowContent(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setProgress(0);
      setShowContent(true);
    }, 500);
  }, [items.length]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = 100;
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
  }, [duration, items.length, nextSlide]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-inter select-none">
      {/* Progress Bar */}
      {items.length > 1 && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 z-[150]">
          <div 
            className="h-full transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
            style={{ width: `${progress}%`, backgroundColor: themeColor }}
          ></div>
        </div>
      )}

      {/* Dynamic Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] blur-[200px] rounded-full animate-pulse transition-all duration-1000" style={{ backgroundColor: themeColor }}></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[35%] h-[35%] blur-[160px] rounded-full animate-pulse transition-all duration-1000 opacity-60" style={{ backgroundColor: themeColor, animationDelay: '1.5s' }}></div>
      </div>

      {/* Exit Button */}
      <div className="absolute top-6 right-6 z-[160]">
        <button 
          onClick={onExit} 
          className="p-4 bg-rose-600/80 hover:bg-rose-500 text-white rounded-xl transition-all shadow-2xl backdrop-blur-md border border-white/10 active:scale-90 group"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Main Content Stage */}
      <div className="w-full h-full flex items-center justify-center p-4 md:p-12 xl:p-20 overflow-hidden">
        
        {!isProduct && announcement && (
          <div className={`w-full max-w-6xl h-fit p-16 md:p-24 rounded-[4rem] border border-white/10 shadow-3xl backdrop-blur-xl transition-all duration-1000 transform ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ backgroundColor: `${announcement.backgroundColor}DD` }}>
            <div className="flex flex-col items-center justify-center relative">
               {announcement.hasAnimation && <div className="absolute inset-0 bg-white/5 opacity-10 shine-effect pointer-events-none"></div>}
               
               <div className="mb-12 inline-flex items-center gap-6 bg-white/10 px-10 py-4 rounded-[2rem] border border-white/10 shadow-2xl">
                  <Megaphone className="text-white animate-bounce" size={40} />
                  <span className="text-2xl font-black text-white tracking-[0.4em] uppercase">{store.name}</span>
               </div>

               <div 
                 className={`${announcement.fontFamily} w-full leading-[1.05] drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]`}
                 style={{ 
                   fontSize: `${announcement.fontSize}px`, 
                   color: announcement.textColor,
                   textAlign: announcement.textAlign
                 }}
               >
                 {announcement.message}
               </div>
            </div>
          </div>
        )}

        {isProduct && product && (
          <div className={`w-100dvh max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 xl:gap-24 transition-all duration-[800ms] ease-out transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            
            {/* Image Container - Slightly smaller and neater */}
            <div className="relative flex-shrink-0 group perspective-1000">
              <div className="absolute inset-0 blur-[120px] scale-90 opacity-40 transition-all duration-1000" style={{ backgroundColor: themeColor }}></div>
              <div className="relative w-72 h-72 md:w-[28rem] md:h-[28rem] xl:w-[32rem] xl:h-[32rem] rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border-[4px] border-white/10 shine-effect bg-slate-900 ring-1 ring-white/5">
                <img src={product.imageUrl || `https://picsum.photos/seed/${product.id}/1200`} className="w-full h-full object-cover animate-softZoom transition-transform duration-700" alt={product.name} />
                
                {product.isPromotion && (
                  <div className="absolute top-6 left-6 text-white font-bebas text-4xl xl:text-5xl px-8 py-3 rounded-[1.5rem] shadow-2xl transform -rotate-3 animate-pulse whitespace-nowrap z-20 ring-2 ring-white/10" style={{ backgroundColor: themeColor }}>
                    {getPromoLabel(product.promotionType)}
                  </div>
                )}
                
                <div className="absolute bottom-6 left-6 z-20">
                  <div className="bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 flex items-center gap-2.5">
                    <ShieldCheck size={20} className="text-emerald-400" />
                    <span className="text-white font-black text-xs tracking-wider">PREMIUM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="flex flex-col space-y-8 text-white text-center lg:text-left">
              <header className="space-y-4">
                <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-white/10 shadow-lg mx-auto lg:mx-0" style={{ backgroundColor: `${themeColor}22`, color: themeColor }}>
                  <Zap size={16} fill="currentColor" />
                  {store.name}
                </div>
                
                <h1 className="text-7xl md:text-7xl xl:text-[6rem] font-bebas tracking-wider leading-[0.85] drop-shadow-2xl">
                  {product.name}
                </h1>
                
                {product.slogan && (
                  <div className="relative inline-block mt-2">
                    <p className="text-3xl xl:text-4xl font-black italic tracking-tight leading-tight opacity-90" style={{ color: themeColor }}>
                      "{product.slogan}"
                    </p>
                  </div>
                )}
              </header>

              <div className="flex flex-col gap-2">
                <div className="text-slate-500 text-sm font-black uppercase tracking-[0.3em] flex items-center justify-center lg:justify-start gap-3">
                  <div className="hidden lg:block w-8 h-0.5 bg-slate-800"></div>
                  Precio por {product.unit}
                </div>
                <div className="flex items-baseline justify-center lg:justify-start gap-4">
                  <span className="text-[10rem] xl:text-[12rem] font-bebas text-white leading-[0.8] tracking-tighter drop-shadow-2xl">
                    <span className="text-5xl xl:text-7xl align-top mt-8 inline-block mr-2" style={{ color: themeColor }}>$</span>
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-3xl xl:text-4xl font-black text-slate-600 uppercase">/ {product.unit}</span>
                </div>
              </div>

              <div className="pt-6 flex flex-col gap-6 w-full lg:w-[110%]">
                <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] backdrop-blur-xl flex items-center justify-between shadow-2xl group transition-all hover:bg-white/[0.08]">
                  <div className="text-left">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1 flex items-center gap-2">
                      <Star size={12} fill="currentColor" className="text-amber-500" />
                      UBICACIÓN
                    </div>
                    <div className="text-xl xl:text-2xl font-black tracking-tight">{store.address}</div>
                  </div>
                  <div className="p-5 rounded-2xl shadow-xl transition-all duration-500 group-hover:scale-110 flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                    <ChevronRight size={32} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ticker - Moved a bit higher from extreme bottom to avoid cutoff on some screens */}
      <div className="absolute bottom-4 left-0 w-full bg-black/40 backdrop-blur-md border-y border-white/5 py-4 overflow-hidden whitespace-nowrap z-[140]">
        <div className="flex animate-marquee space-x-20 px-10 items-center">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              {tickerMessages.map((msg, idx) => (
                <span key={`${i}-${idx}`} className={`font-bebas text-3xl xl:text-4xl tracking-[0.15em] flex items-center gap-6 ${idx % 2 === 0 ? 'text-white/90' : ''}`} style={{ color: idx % 2 !== 0 ? themeColor : undefined }}>
                  {msg}
                  <div className="w-2 h-2 rounded-full bg-white/20"></div>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-3 z-[130]">
          {items.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 transition-all duration-700 rounded-full cursor-pointer ${i === currentIndex ? 'w-12 bg-white' : 'w-2 bg-white/10 hover:bg-white/30'}`} 
              style={{ backgroundColor: i === currentIndex ? themeColor : undefined }}
              onClick={() => {
                setCurrentIndex(i);
                setProgress(0);
                setShowContent(false);
                setTimeout(() => setShowContent(true), 100);
              }}
            ></div>
          ))}
        </div>
      )}
      
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes softZoom { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        .animate-softZoom { animation: softZoom 15s ease-in-out infinite; }
        .animate-marquee { display: flex; width: fit-content; animation: marquee 35s linear infinite; }
        .font-bebas { font-family: 'Bebas Neue', cursive; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default AdDisplay;
