
import React, { useState, useEffect, useCallback } from 'react';
import { Store, Product, AppState, Announcement, DisplayItem } from './types';
import Dashboard from './components/Dashboard';
import Management from './components/Management';
import AdDisplay from './components/AdDisplay';
import { LayoutGrid, Settings, Tv, CheckCircle2, Info, X } from 'lucide-react';

const STORAGE_KEY = 'promomaster_data_v2';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          announcements: parsed.announcements || [],
          view: 'dashboard'
        };
      }
    } catch (e) {
      console.error("Failed to load state from storage", e);
    }
    return {
      stores: [
        { id: '1', name: 'Sucursal Central', address: 'Av. Libertador 1234', logoColor: 'bg-blue-600' }
      ],
      products: [],
      announcements: [],
      displayDuration: 5,
      view: 'dashboard'
    };
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'success') => {
    const id = crypto.randomUUID();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const setView = (view: AppState['view']) => setState(prev => ({ ...prev, view }));

  // CRUD Operations (unchanged for brevity but maintaining connectivity)
  const addStore = (store: Omit<Store, 'id'>) => {
    const newStore = { ...store, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, stores: [...prev.stores, newStore] }));
    addNotification(`Local "${store.name}" agregado`);
  };
  const updateStore = (updatedStore: Store) => {
    setState(prev => ({ ...prev, stores: prev.stores.map(s => s.id === updatedStore.id ? updatedStore : s) }));
    addNotification(`Local "${updatedStore.name}" actualizado`);
  };
  const deleteStore = (id: string) => {
    setState(prev => ({ ...prev, stores: prev.stores.filter(s => s.id !== id) }));
    addNotification(`Local eliminado`, 'info');
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
    addNotification(`Producto "${product.name}" creado`);
  };
  const updateProduct = (updatedProduct: Product) => {
    setState(prev => ({ ...prev, products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p) }));
    addNotification(`Producto "${updatedProduct.name}" actualizado`);
  };
  const deleteProduct = (id: string) => {
    setState(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
    addNotification(`Producto eliminado`, 'info');
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id'>) => {
    const newAnn = { ...ann, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, announcements: [...prev.announcements, newAnn] }));
    addNotification(`Aviso "${ann.title}" creado`);
  };
  const updateAnnouncement = (ann: Announcement) => {
    setState(prev => ({ ...prev, announcements: prev.announcements.map(a => a.id === ann.id ? ann : a) }));
    addNotification(`Aviso "${ann.title}" actualizado`);
  };
  const deleteAnnouncement = (id: string) => {
    setState(prev => ({ ...prev, announcements: prev.announcements.filter(a => a.id !== id) }));
    addNotification(`Aviso eliminado`, 'info');
  };

  const startDisplay = (items: DisplayItem[], storeId: string, duration: number) => {
    setState(prev => ({
      ...prev,
      currentItems: items,
      currentStoreId: storeId,
      displayDuration: duration,
      view: 'display'
    }));
  };

  if (state.view === 'display') {
    const resolvedItems = (state.currentItems || []).map(item => {
      if (item.type === 'product') return state.products.find(p => p.id === item.id);
      return state.announcements.find(a => a.id === item.id);
    }).filter(Boolean) as (Product | Announcement)[];

    const store = state.stores.find(s => s.id === state.currentStoreId);
    
    if (resolvedItems.length === 0 || !store) {
      setView('dashboard');
      return null;
    }
    return (
      <AdDisplay 
        items={resolvedItems} 
        store={store} 
        duration={state.displayDuration || 5}
        onExit={() => setView('dashboard')} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 relative overflow-hidden font-sans">
      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl border-l-4 animate-slideInRight ${
              n.type === 'success' ? 'bg-white border-emerald-500 text-slate-800' : 
              n.type === 'info' ? 'bg-white border-blue-500 text-slate-800' : 
              'bg-white border-rose-500 text-slate-800'
            }`}
          >
            {n.type === 'success' ? <CheckCircle2 className="text-emerald-500 shrink-0" size={20} /> : <Info className="text-blue-500 shrink-0" size={20} />}
            <span className="font-semibold text-sm flex-1">{n.message}</span>
            <button onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))} className="text-slate-300 hover:text-slate-500">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <nav className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Tv size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">PromoMaster</h1>
        </div>
        
        <div className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LayoutGrid size={20} />
            <span className="font-semibold">Panel de Control</span>
          </button>

          <button 
            onClick={() => setView('management')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.view === 'management' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Settings size={20} />
            <span className="font-semibold">Gestión Total</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {state.view === 'dashboard' && (
          <Dashboard 
            products={state.products} 
            announcements={state.announcements}
            stores={state.stores} 
            onStartDisplay={startDisplay}
            defaultDuration={state.displayDuration || 5}
          />
        )}
        {state.view === 'management' && (
          <Management 
            stores={state.stores}
            products={state.products}
            announcements={state.announcements}
            onAddStore={addStore}
            onUpdateStore={updateStore}
            onDeleteStore={deleteStore}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onAddAnnouncement={addAnnouncement}
            onUpdateAnnouncement={updateAnnouncement}
            onDeleteAnnouncement={deleteAnnouncement}
          />
        )}
      </main>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
