
import React, { useState, useEffect, useCallback } from 'react';
import { Store, Product, AppState, UnitType } from './types';
import Dashboard from './components/Dashboard';
import Management from './components/Management';
import AdDisplay from './components/AdDisplay';
import { LayoutGrid, Settings, Tv, CheckCircle2, Info, X } from 'lucide-react';

const STORAGE_KEY = 'promomaster_data_v1';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

const App: React.FC = () => {
  // Persistence logic using localStorage
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure critical fields exist
        return {
          ...parsed,
          view: 'dashboard' // Always start at dashboard on reload
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
      displayDuration: 5,
      view: 'dashboard'
    };
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Sync state to localStorage whenever it changes
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

  const addStore = (store: Omit<Store, 'id'>) => {
    const newStore = { ...store, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, stores: [...prev.stores, newStore] }));
    addNotification(`Local "${store.name}" agregado con éxito`);
  };

  const updateStore = (updatedStore: Store) => {
    setState(prev => ({
      ...prev,
      stores: prev.stores.map(s => s.id === updatedStore.id ? updatedStore : s)
    }));
    addNotification(`Local "${updatedStore.name}" actualizado`);
  };

  const deleteStore = (id: string) => {
    const store = state.stores.find(s => s.id === id);
    setState(prev => ({ ...prev, stores: prev.stores.filter(s => s.id !== id) }));
    if (store) addNotification(`Local "${store.name}" eliminado`, 'info');
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
    addNotification(`Producto "${product.name}" creado`);
  };

  const updateProduct = (updatedProduct: Product) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    }));
    addNotification(`Producto "${updatedProduct.name}" actualizado`);
  };

  const deleteProduct = (id: string) => {
    const product = state.products.find(p => p.id === id);
    setState(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
    if (product) addNotification(`Producto "${product.name}" eliminado`, 'info');
  };

  const startDisplay = (productIds: string[], storeId: string, duration: number) => {
    setState(prev => ({
      ...prev,
      currentProductIds: productIds,
      currentStoreId: storeId,
      displayDuration: duration,
      view: 'display'
    }));
  };

  if (state.view === 'display') {
    const products = state.products.filter(p => state.currentProductIds?.includes(p.id));
    const store = state.stores.find(s => s.id === state.currentStoreId);
    if (products.length === 0 || !store) {
      setView('dashboard');
      return null;
    }
    return (
      <AdDisplay 
        products={products} 
        store={store} 
        duration={state.displayDuration || 5}
        onExit={() => setView('dashboard')} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 relative overflow-hidden">
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

      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Tv size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">PromoMaster</h1>
        </div>
        
        <div className="flex-1 px-4 space-y-2 mt-4">
          <div className="group relative">
            <button 
              onClick={() => setView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <LayoutGrid size={20} />
              <span className="font-semibold">Panel de Control</span>
            </button>
            <div className="hidden md:block absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none shadow-xl border border-slate-700 whitespace-nowrap">
              Ver resumen y lanzar propagandas
            </div>
          </div>

          <div className="group relative">
            <button 
              onClick={() => setView('management')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${state.view === 'management' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Settings size={20} />
              <span className="font-semibold">Gestión</span>
            </button>
            <div className="hidden md:block absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none shadow-xl border border-slate-700 whitespace-nowrap">
              Administrar sucursales y productos
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800">
          <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2">Locales Activos</div>
          <div className="flex flex-col gap-2">
            {state.stores.slice(0, 3).map(s => (
              <div key={s.id} className="flex items-center gap-2 text-sm text-slate-300">
                <div className={`w-2 h-2 rounded-full ${s.logoColor}`}></div>
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {state.view === 'dashboard' && (
          <Dashboard 
            products={state.products} 
            stores={state.stores} 
            onStartDisplay={startDisplay}
            defaultDuration={state.displayDuration || 5}
          />
        )}
        {state.view === 'management' && (
          <Management 
            stores={state.stores}
            products={state.products}
            onAddStore={addStore}
            onUpdateStore={updateStore}
            onDeleteStore={deleteStore}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
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
