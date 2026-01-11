
import React, { useState, useRef } from 'react';
import { Store, Product, UnitType, PromotionType } from '../types';
import { Plus, Trash2, Building2, Apple, Sparkles, Upload, Edit2, X, Palette, Calendar, Wand2, Loader2 } from 'lucide-react';
import { generateSlogan, suggestProductColor, generateProductImage } from '../services/geminiService';

interface ManagementProps {
  stores: Store[];
  products: Product[];
  onAddStore: (store: Omit<Store, 'id'>) => void;
  onUpdateStore: (store: Store) => void;
  onDeleteStore: (id: string) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const INITIAL_PRODUCT_STATE = {
  name: '',
  description: '',
  price: 0,
  unit: 'unidad' as UnitType,
  category: '',
  isPromotion: false,
  promotionType: 'general' as PromotionType,
  slogan: '',
  imageUrl: '',
  primaryColor: '#4f46e5'
};

const INITIAL_STORE_STATE = {
  name: '',
  address: '',
  logoColor: 'bg-indigo-600'
};

const Management: React.FC<ManagementProps> = ({ 
  stores, products, onAddStore, onUpdateStore, onDeleteStore, onAddProduct, onUpdateProduct, onDeleteProduct 
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products');
  const [isGeneratingSlogan, setIsGeneratingSlogan] = useState(false);
  const [isSuggestingColor, setIsSuggestingColor] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [storeForm, setStoreForm] = useState<Omit<Store, 'id'>>(INITIAL_STORE_STATE);
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>(INITIAL_PRODUCT_STATE);

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storeForm.name) {
      if (editingStoreId) {
        onUpdateStore({ ...storeForm, id: editingStoreId });
        setEditingStoreId(null);
      } else {
        onAddStore(storeForm);
      }
      setStoreForm(INITIAL_STORE_STATE);
    }
  };

  const handleEditStore = (store: Store) => {
    setEditingStoreId(store.id);
    setStoreForm({
      name: store.name,
      address: store.address,
      logoColor: store.logoColor
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productForm.name && productForm.price > 0) {
      let finalProduct = { ...productForm };
      
      // Auto-generate image if missing
      if (!finalProduct.imageUrl) {
        setIsGeneratingImage(true);
        const aiImage = await generateProductImage(finalProduct.name);
        if (aiImage) {
          finalProduct.imageUrl = aiImage;
        }
        setIsGeneratingImage(false);
      }

      if (editingProductId) {
        onUpdateProduct({ ...finalProduct, id: editingProductId });
        setEditingProductId(null);
      } else {
        onAddProduct(finalProduct);
      }
      setProductForm(INITIAL_PRODUCT_STATE);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      category: product.category,
      isPromotion: product.isPromotion,
      promotionType: product.promotionType || 'general',
      slogan: product.slogan || '',
      imageUrl: product.imageUrl || '',
      primaryColor: product.primaryColor || '#4f46e5'
    });
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    if (!productForm.name) {
      alert("Por favor ingresa el nombre del producto para generar una imagen.");
      return;
    }
    setIsGeneratingImage(true);
    const imageUrl = await generateProductImage(productForm.name);
    if (imageUrl) {
      setProductForm(prev => ({ ...prev, imageUrl }));
    } else {
      alert("No se pudo generar la imagen. Inténtalo de nuevo.");
    }
    setIsGeneratingImage(false);
  };

  const handleGenerateSlogan = async () => {
    if (!productForm.name || !productForm.description) {
      alert("Por favor ingresa nombre y descripción para generar un eslogan.");
      return;
    }
    setIsGeneratingSlogan(true);
    const slogan = await generateSlogan(productForm.name, productForm.description);
    setProductForm(prev => ({ ...prev, slogan }));
    setIsGeneratingSlogan(false);
  };

  const handleSuggestColor = async () => {
    if (!productForm.name) {
      alert("Ingresa al menos el nombre del producto.");
      return;
    }
    setIsSuggestingColor(true);
    const color = await suggestProductColor(productForm.name, productForm.imageUrl);
    setProductForm(prev => ({ ...prev, primaryColor: color }));
    setIsSuggestingColor(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900">Gestión de Datos</h2>
        <p className="text-slate-500">Administra tus sucursales y catálogo de productos.</p>
      </header>

      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'products' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Productos
        </button>
        <button 
          onClick={() => setActiveTab('stores')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'stores' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Sucursales
        </button>
      </div>

      {activeTab === 'stores' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          <form onSubmit={handleStoreSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 h-fit">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {editingStoreId ? <Edit2 size={20} className="text-indigo-600" /> : <Building2 size={20} className="text-indigo-600" />} 
                {editingStoreId ? 'Editar Local' : 'Nuevo Local'}
              </h3>
              {editingStoreId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingStoreId(null);
                    setStoreForm(INITIAL_STORE_STATE);
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
              <input 
                type="text" 
                required
                className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium"
                placeholder="Ej: Sucursal Norte"
                value={storeForm.name}
                onChange={e => setStoreForm({...storeForm, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Dirección</label>
              <input 
                type="text" 
                required
                className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium"
                placeholder="Calle 123..."
                value={storeForm.address}
                onChange={e => setStoreForm({...storeForm, address: e.target.value})}
              />
            </div>
            <button type="submit" className={`w-full text-white py-3 rounded-xl font-bold transition-all transform active:scale-95 ${editingStoreId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {editingStoreId ? 'Actualizar Local' : 'Guardar Local'}
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            {stores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                <Building2 size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">No hay sucursales registradas</p>
              </div>
            ) : (
              stores.map(store => (
                <div key={store.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${store.logoColor} flex items-center justify-center text-white font-bold text-xl shadow-inner`}>
                      {store.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{store.name}</h4>
                      <p className="text-sm text-slate-500">{store.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditStore(store)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDeleteStore(store.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      title="Borrar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          {/* Product Form */}
          <form onSubmit={handleProductSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {editingProductId ? <Edit2 size={20} className="text-indigo-600" /> : <Apple size={20} className="text-indigo-600" />} 
                {editingProductId ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              {editingProductId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingProductId(null);
                    setProductForm(INITIAL_PRODUCT_STATE);
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
                <input 
                  type="text" 
                  required
                  className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium"
                  value={productForm.name}
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Descripción</label>
                <textarea 
                  className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 resize-none h-20 font-medium"
                  value={productForm.description}
                  onChange={e => setProductForm({...productForm, description: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Precio</label>
                <input 
                  type="number" 
                  required
                  className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium"
                  value={productForm.price}
                  onChange={e => setProductForm({...productForm, price: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Unidad</label>
                <select 
                  className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold"
                  value={productForm.unit}
                  onChange={e => setProductForm({...productForm, unit: e.target.value as UnitType})}
                >
                  <option value="unidad">Unidad</option>
                  <option value="kg">Kilo (Kg)</option>
                  <option value="g">Gramo (g)</option>
                  <option value="litro">Litro (L)</option>
                  <option value="pack">Pack</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Foto del Producto</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center shrink-0 relative">
                    {productForm.imageUrl ? (
                      <img src={productForm.imageUrl} className="w-full h-full object-cover" alt="Previsualización" />
                    ) : (
                      <Apple className="text-slate-300" />
                    )}
                    {isGeneratingImage && (
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="text-white animate-spin" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Upload size={16} /> Subir
                    </button>
                    <button 
                      type="button"
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-100 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all disabled:opacity-50"
                    >
                      <Wand2 size={16} className={isGeneratingImage ? 'animate-pulse' : ''} /> IA Generar
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <input 
                    type="checkbox" 
                    id="promo"
                    className="w-5 h-5 accent-indigo-600"
                    checked={productForm.isPromotion}
                    onChange={e => setProductForm({...productForm, isPromotion: e.target.checked})}
                  />
                  <label htmlFor="promo" className="text-sm font-bold text-slate-700">PROMOCIÓN ACTIVA</label>
                </div>
                
                {productForm.isPromotion && (
                  <div className="flex flex-col gap-1.5 animate-fadeIn">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Calendar size={12} /> Tipo de Oferta
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['dia', 'semana', 'general'] as PromotionType[]).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setProductForm({...productForm, promotionType: type})}
                          className={`py-2 px-1 text-[10px] font-bold uppercase rounded-lg border transition-all ${productForm.promotionType === type ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                        >
                          {type === 'dia' ? 'Del Día' : type === 'semana' ? 'Semanal' : 'General'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                  Color de la Propaganda
                  <button 
                    type="button"
                    onClick={handleSuggestColor}
                    disabled={isSuggestingColor}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50"
                  >
                    <Sparkles size={12} className={isSuggestingColor ? 'animate-spin' : ''} /> Sugerencia AI
                  </button>
                </label>
                <div className="flex gap-3 mt-1 items-center">
                  <input 
                    type="color" 
                    className="w-12 h-10 p-1 bg-white border border-slate-200 rounded-xl cursor-pointer"
                    value={productForm.primaryColor}
                    onChange={e => setProductForm({...productForm, primaryColor: e.target.value})}
                  />
                  <input 
                    type="text" 
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-sm uppercase"
                    value={productForm.primaryColor}
                    onChange={e => setProductForm({...productForm, primaryColor: e.target.value})}
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Slogan</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="text" 
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium"
                    placeholder="Impactante..."
                    value={productForm.slogan}
                    onChange={e => setProductForm({...productForm, slogan: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={handleGenerateSlogan}
                    disabled={isGeneratingSlogan}
                    className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Sparkles size={20} className={isGeneratingSlogan ? 'animate-pulse' : ''} />
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isGeneratingImage}
              className={`w-full text-white py-3 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 ${editingProductId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-indigo-600'} disabled:opacity-70`}
            >
              {isGeneratingImage ? <Loader2 className="animate-spin" size={18} /> : null}
              {editingProductId ? 'Actualizar Producto' : 'Guardar Producto'}
            </button>
          </form>

          {/* Product List */}
          <div className="lg:col-span-2 space-y-4">
            {products.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                <Apple size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">Sin productos registrados</p>
              </div>
            ) : (
              products.map(product => (
                <div key={product.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-indigo-200 group transition-all">
                  <div className="flex items-center gap-4">
                    <img src={product.imageUrl || `https://picsum.photos/seed/${product.id}/100`} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt={product.name} />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{product.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        <span className="font-bold" style={{ color: product.primaryColor }}>${product.price}</span> / {product.unit}
                        {product.isPromotion && (
                          <span className="ml-2 text-[8px] bg-indigo-50 text-indigo-600 px-1 py-0.5 rounded font-bold uppercase">
                            {product.promotionType}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDeleteProduct(product.id)}
                      className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      title="Borrar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;
