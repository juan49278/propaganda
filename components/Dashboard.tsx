
import React, { useState } from 'react';
import { Product, Store, Announcement, DisplayItem } from '../types';
import { Play, Search, Tag, Check, Layers, Clock, X, Megaphone, MonitorPlay, Plus, ArrowUp, ArrowDown, ListOrdered } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  announcements: Announcement[];
  stores: Store[];
  onStartDisplay: (items: DisplayItem[], storeId: string, duration: number) => void;
  defaultDuration: number;
}

const Dashboard: React.FC<DashboardProps> = ({ products, announcements, stores, onStartDisplay, defaultDuration }) => {
  const [selectedStore, setSelectedStore] = useState<string>(stores[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [playlist, setPlaylist] = useState<DisplayItem[]>([]);
  const [duration, setDuration] = useState(defaultDuration);
  const [activeTab, setActiveTab] = useState<'products' | 'announcements' | 'playlist'>('products');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAnnouncements = announcements.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToPlaylist = (item: DisplayItem) => {
    setPlaylist(prev => [...prev, item]);
  };

  const removeFromPlaylist = (index: number) => {
    setPlaylist(prev => prev.filter((_, i) => i !== index));
  };

  const movePlaylistItem = (index: number, direction: 'up' | 'down') => {
    const newPlaylist = [...playlist];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPlaylist.length) return;
    [newPlaylist[index], newPlaylist[targetIndex]] = [newPlaylist[targetIndex], newPlaylist[index]];
    setPlaylist(newPlaylist);
  };

  const handleLaunchAllMixed = () => {
    if (playlist.length > 0 && selectedStore) {
      onStartDisplay(playlist, selectedStore, duration);
    }
  };

  const handleLaunchItemNow = (item: DisplayItem) => {
    onStartDisplay([item], selectedStore, duration);
  };

  const addAllToPlaylist = () => {
    const allProducts: DisplayItem[] = products.map(p => ({ type: 'product', id: p.id }));
    const allAnns: DisplayItem[] = announcements.map(a => ({ type: 'announcement', id: a.id }));
    setPlaylist([...allProducts, ...allAnns]);
    setActiveTab('playlist');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Control</h2>
          <p className="text-slate-500">Crea tu secuencia de propaganda mezclada.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            <Clock size={16} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase">Segundos</span>
            <input 
              type="number" 
              min="1" 
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 text-center font-bold text-indigo-600 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-slate-700">Local:</label>
            <select 
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-indigo-500 outline-none font-semibold text-slate-700 shadow-sm"
            >
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
        >
          <Tag size={18} /> Productos
        </button>
        <button 
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'announcements' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
        >
          <Megaphone size={18} /> Avisos Libres
        </button>
        <button 
          onClick={() => setActiveTab('playlist')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all relative ${activeTab === 'playlist' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'}`}
        >
          <ListOrdered size={18} /> Mi Secuencia
          {playlist.length > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full font-black animate-bounce shadow-lg">
              {playlist.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'playlist' ? (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900">Configuración de Secuencia</h3>
                <p className="text-sm text-slate-500">Ordena cómo aparecerán los productos y avisos en pantalla.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setPlaylist([])}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-all text-sm"
                >
                  Vaciar
                </button>
                <button 
                  disabled={playlist.length === 0}
                  onClick={handleLaunchAllMixed}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-3"
                >
                  <MonitorPlay size={20} /> Iniciar Transmisión
                </button>
              </div>
            </div>

            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto bg-white">
              {playlist.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <ListOrdered size={40} />
                  </div>
                  <p className="text-slate-400 font-medium">Tu secuencia está vacía. Añade items desde las otras pestañas.</p>
                  <button onClick={addAllToPlaylist} className="text-indigo-600 font-bold hover:underline">Añadir todo el catálogo</button>
                </div>
              ) : (
                playlist.map((item, index) => {
                  const data = item.type === 'product' ? products.find(p => p.id === item.id) : announcements.find(a => a.id === item.id);
                  if (!data) return null;

                  return (
                    <div key={`${item.id}-${index}`} className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group">
                      <div className="text-xs font-black text-slate-300 w-6">{index + 1}</div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 overflow-hidden ${item.type === 'product' ? 'bg-slate-100' : ''}`} style={{ backgroundColor: item.type === 'announcement' ? (data as Announcement).backgroundColor : undefined }}>
                        {item.type === 'product' ? (
                          <img src={(data as Product).imageUrl || `https://picsum.photos/seed/${data.id}/100`} className="w-full h-full object-cover" />
                        ) : <Megaphone size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 truncate">
                          {item.type === 'product' ? (data as Product).name : (data as Announcement).title}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {item.type === 'product' ? 'Producto' : 'Aviso Libre'}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => movePlaylistItem(index, 'up')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"><ArrowUp size={16} /></button>
                        <button onClick={() => movePlaylistItem(index, 'down')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"><ArrowDown size={16} /></button>
                        <button onClick={() => removeFromPlaylist(index)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all ml-2"><X size={16} /></button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder={`Buscar en ${activeTab === 'products' ? 'productos' : 'avisos'}...`}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={addAllToPlaylist} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-all whitespace-nowrap">
              <Plus size={18} /> Añadir Todo a Secuencia
            </button>
          </div>

          {activeTab === 'products' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col">
                  <div className="aspect-square relative overflow-hidden bg-slate-100">
                    <img src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => handleLaunchItemNow({ type: 'product', id: product.id })}
                        className="p-3 bg-indigo-600 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all"
                        title="Lanzar Ahora"
                       >
                         <Play size={20} fill="currentColor" />
                       </button>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col gap-4">
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900 leading-tight mb-1">{product.name}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{product.category}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="text-2xl font-black text-indigo-600">$ {product.price.toLocaleString()}</div>
                      <button 
                        onClick={() => addToPlaylist({ type: 'product', id: product.id })}
                        className="p-3 bg-slate-50 text-slate-900 hover:bg-indigo-600 hover:text-white rounded-xl transition-all border border-slate-100"
                        title="Añadir a secuencia"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnnouncements.map(ann => (
                <div key={ann.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: ann.backgroundColor }}>
                      <Megaphone size={32} />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleLaunchItemNow({ type: 'announcement', id: ann.id })}
                        className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg hover:scale-110 transition-all"
                        title="Lanzar Ahora"
                      >
                        <Play size={20} fill="currentColor" />
                      </button>
                      <button 
                        onClick={() => addToPlaylist({ type: 'announcement', id: ann.id })}
                        className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-all"
                        title="Añadir a secuencia"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{ann.title}</h4>
                    <p className="text-slate-500 font-medium line-clamp-3 mb-6">{ann.message}</p>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <div className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{ann.fontFamily.replace('font-', '')}</div>
                    <div className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{ann.fontSize}px</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
