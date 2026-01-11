
import React, { useState } from 'react';
import { Product, Store } from '../types';
// Added missing X import
import { Play, Search, Tag, Check, Layers, Clock, X } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  stores: Store[];
  onStartDisplay: (productIds: string[], storeId: string, duration: number) => void;
  defaultDuration: number;
}

const Dashboard: React.FC<DashboardProps> = ({ products, stores, onStartDisplay, defaultDuration }) => {
  const [selectedStore, setSelectedStore] = useState<string>(stores[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [duration, setDuration] = useState(defaultDuration);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleLaunch = () => {
    if (selectedProductIds.length > 0 && selectedStore) {
      onStartDisplay(selectedProductIds, selectedStore, duration);
    }
  };

  const handlePlayAll = () => {
    const allIds = filteredProducts.map(p => p.id);
    if (allIds.length > 0 && selectedStore) {
      onStartDisplay(allIds, selectedStore, duration);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Control</h2>
          <p className="text-slate-500">Configura y lanza tus propagandas digitales.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Duration Config */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            <Clock size={16} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase">Tiempo (s)</span>
            <input 
              type="number" 
              min="1" 
              max="60"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 text-center font-bold text-indigo-600 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-slate-700">Emitir en:</label>
            <select 
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-700 shadow-sm"
            >
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Stats / Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <Tag size={24} className="opacity-80" />
            <div className="flex gap-2">
              <button 
                onClick={handlePlayAll}
                className="text-xs font-bold uppercase tracking-widest bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
              >
                <Layers size={14} /> Reproducir Todos
              </button>
            </div>
          </div>
          <div className="text-4xl font-bold mb-1">{products.length}</div>
          <div className="text-indigo-100 font-medium text-sm">Productos en catálogo</div>
        </div>

        {selectedProductIds.length > 0 && (
          <div className="flex-1 bg-amber-500 p-6 rounded-3xl text-white shadow-xl shadow-amber-200 animate-slideInRight">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-bold uppercase tracking-widest bg-black/10 px-2 py-1 rounded-lg">Selección: {selectedProductIds.length}</div>
              {/* Fix: Icon X is now correctly imported */}
              <button onClick={() => setSelectedProductIds([])} className="p-1 hover:bg-black/10 rounded">
                <X size={16} />
              </button>
            </div>
            <div className="text-2xl font-bold mb-3">Lanzar carrusel</div>
            <button 
              onClick={handleLaunch}
              className="w-full bg-white text-amber-600 py-3 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
            >
              Iniciar Propaganda
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <h3 className="text-xl font-bold text-slate-800">Tus Productos</h3>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o categoría..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            <Tag size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const isSelected = selectedProductIds.includes(product.id);
              return (
                <div 
                  key={product.id} 
                  onClick={() => toggleProductSelection(product.id)}
                  className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer relative ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50 shadow-xl' : 'border-slate-100 shadow-sm hover:shadow-md'}`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-10 bg-indigo-600 text-white p-1 rounded-full shadow-lg">
                      <Check size={14} strokeWidth={4} />
                    </div>
                  )}
                  <div className="aspect-square relative overflow-hidden bg-slate-100">
                    <img 
                      src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400`} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.isPromotion && (
                      <div className="absolute top-4 left-4 bg-rose-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-lg">
                        {product.promotionType === 'dia' ? 'Oferta del día' : 
                         product.promotionType === 'semana' ? 'Oferta semanal' : 'Oferta'}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="font-bold text-slate-900 truncate leading-tight">{product.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-indigo-600 font-black text-lg">${product.price.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">x {product.unit}</div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartDisplay([product.id], selectedStore, duration);
                      }}
                      className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 py-2 rounded-xl font-bold transition-all text-sm"
                    >
                      <Play size={14} fill="currentColor" /> Directo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
