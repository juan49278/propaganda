
import React, { useState, useRef } from 'react';
import { Store, Product, UnitType, PromotionType, Announcement, FontType } from '../types';
/* Added missing X import to fix line 184 error */
import { Plus, Trash2, Building2, Apple, Sparkles, Edit2, Wand2, Loader2, Megaphone, AlignLeft, AlignCenter, AlignRight, Image as ImageIcon, Link, Upload, Check, X } from 'lucide-react';
import { generateSlogan, generateProductImage } from '../services/geminiService';

interface ManagementProps {
  stores: Store[];
  products: Product[];
  announcements: Announcement[];
  onAddStore: (store: Omit<Store, 'id'>) => void;
  onUpdateStore: (store: Store) => void;
  onDeleteStore: (id: string) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
  onUpdateAnnouncement: (ann: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
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

const INITIAL_ANN_STATE: Omit<Announcement, 'id'> = {
  title: '',
  message: '',
  fontSize: 64,
  fontFamily: 'font-bebas',
  backgroundColor: '#1e293b',
  textColor: '#ffffff',
  textAlign: 'center',
  hasAnimation: true
};

const Management: React.FC<ManagementProps> = ({ 
  stores, products, announcements, onAddStore, onUpdateStore, onDeleteStore, 
  onAddProduct, onUpdateProduct, onDeleteProduct,
  onAddAnnouncement, onUpdateAnnouncement, onDeleteAnnouncement
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'stores' | 'announcements'>('products');
  const [isGeneratingSlogan, setIsGeneratingSlogan] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [storeForm, setStoreForm] = useState<Omit<Store, 'id'>>({ name: '', address: '', logoColor: 'bg-indigo-600' });
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>(INITIAL_PRODUCT_STATE);
  const [annForm, setAnnForm] = useState<Omit<Announcement, 'id'>>(INITIAL_ANN_STATE);
  const [imgSourceMode, setImgSourceMode] = useState<'url' | 'upload' | 'ai'>('url');

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      onUpdateProduct({ ...productForm, id: editingProductId });
      setEditingProductId(null);
    } else {
      onAddProduct(productForm);
    }
    setProductForm(INITIAL_PRODUCT_STATE);
    setImgSourceMode('url');
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
      alert("Introduce un nombre de producto para generar una imagen.");
      return;
    }
    setIsGeneratingImage(true);
    const imageUrl = await generateProductImage(productForm.name);
    if (imageUrl) setProductForm(prev => ({ ...prev, imageUrl }));
    setIsGeneratingImage(false);
  };

  const handleAnnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnnId) {
      onUpdateAnnouncement({ ...annForm, id: editingAnnId });
      setEditingAnnId(null);
    } else {
      onAddAnnouncement(annForm);
    }
    setAnnForm(INITIAL_ANN_STATE);
  };

  const handleEditAnn = (ann: Announcement) => {
    setEditingAnnId(ann.id);
    setAnnForm({ ...ann });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900">Configuración Avanzada</h2>
        <p className="text-slate-500">Gestión de sucursales, productos y avisos corporativos.</p>
      </header>

      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button onClick={() => setActiveTab('products')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === 'products' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>
          Productos
        </button>
        <button onClick={() => setActiveTab('announcements')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === 'announcements' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>
          Avisos Libres
        </button>
        <button onClick={() => setActiveTab('stores')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === 'stores' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>
          Sucursales
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          <form onSubmit={handleProductSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-4">
              {editingProductId ? <Edit2 size={20} className="text-amber-500" /> : <Plus size={20} className="text-indigo-600" />} 
              {editingProductId ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Identificación</label>
                <input type="text" required className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Nombre del producto" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Imagen del Producto</label>
                <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
                  <button type="button" onClick={() => setImgSourceMode('url')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${imgSourceMode === 'url' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Link size={14} /> URL
                  </button>
                  <button type="button" onClick={() => setImgSourceMode('upload')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${imgSourceMode === 'upload' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Upload size={14} /> Subir
                  </button>
                  <button type="button" onClick={() => setImgSourceMode('ai')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${imgSourceMode === 'ai' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Sparkles size={14} /> AI
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 min-h-[120px] flex flex-col items-center justify-center gap-3">
                  {imgSourceMode === 'url' && (
                    <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://ejemplo.com/foto.jpg" value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} />
                  )}
                  {imgSourceMode === 'upload' && (
                    <>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                        <ImageIcon size={18} /> Seleccionar Archivo
                      </button>
                    </>
                  )}
                  {imgSourceMode === 'ai' && (
                    <button type="button" onClick={handleGenerateImage} disabled={isGeneratingImage || !productForm.name} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50">
                      {isGeneratingImage ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                      Generar con IA
                    </button>
                  )}
                  {productForm.imageUrl && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-indigo-500 mt-2">
                      <img src={productForm.imageUrl} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setProductForm(p => ({...p, imageUrl: ''}))} className="absolute top-0 right-0 bg-rose-500 text-white p-0.5 rounded-bl-md">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Precio</label>
                  <input type="number" required className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Unidad</label>
                  <select className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={productForm.unit} onChange={e => setProductForm({...productForm, unit: e.target.value as UnitType})}>
                    <option value="unidad">Unidad</option>
                    <option value="kg">Kilo</option>
                    <option value="g">Gramos</option>
                    <option value="litro">Litro</option>
                    <option value="pack">Pack</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Slogan Publicitario</label>
                <div className="flex gap-2 mt-1">
                   <textarea className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm h-16 resize-none outline-none focus:ring-2 focus:ring-indigo-500" value={productForm.slogan} onChange={e => setProductForm({...productForm, slogan: e.target.value})} placeholder="Mensaje corto e impactante..." />
                   <button type="button" onClick={async () => {
                     if(!productForm.name) return alert("Indica el nombre del producto.");
                     setIsGeneratingSlogan(true);
                     const s = await generateSlogan(productForm.name, productForm.description);
                     setProductForm(prev => ({ ...prev, slogan: s }));
                     setIsGeneratingSlogan(false);
                   }} className="h-fit p-3 bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-200 transition-colors">
                     {isGeneratingSlogan ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                   </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                   <input type="checkbox" id="manage-promo-check" className="w-5 h-5 accent-indigo-600 cursor-pointer" checked={productForm.isPromotion} onChange={e => setProductForm({...productForm, isPromotion: e.target.checked})} />
                   <label htmlFor="manage-promo-check" className="text-sm font-black text-indigo-900 cursor-pointer">ES UNA OFERTA</label>
                </div>
                
                {productForm.isPromotion && (
                  <div className="animate-fadeIn p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tipo de Oferta</label>
                    <div className="flex flex-wrap gap-2">
                      {(['general', 'dia', 'semana'] as PromotionType[]).map(type => (
                        <button key={type} type="button" onClick={() => setProductForm({...productForm, promotionType: type})} className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase transition-all border ${productForm.promotionType === type ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}>
                          {type === 'general' ? 'Oferta Simple' : type === 'dia' ? 'Oferta del Día' : 'Oferta Semanal'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 ${editingProductId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-indigo-600'}`}>
              {editingProductId ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            {products.length === 0 ? (
              <div className="bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center text-slate-400">
                 No hay productos en el catálogo. Comienza agregando uno.
              </div>
            ) : (
              products.map(p => (
                <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center justify-between group hover:border-indigo-400 transition-all shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-100">
                      <img src={p.imageUrl || `https://picsum.photos/seed/${p.id}/200`} className="w-full h-full object-cover" />
                      {p.isPromotion && (
                        <div className="absolute top-0 left-0 bg-rose-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-br-lg uppercase">
                          {p.promotionType === 'dia' ? 'Hoy' : p.promotionType === 'semana' ? 'Semana' : 'Oferta'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight">{p.name}</h4>
                      <p className="text-xs text-indigo-600 font-black uppercase tracking-widest mt-1">${p.price.toLocaleString()} / {p.unit}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingProductId(p.id); setProductForm({...p}); setImgSourceMode('url'); }} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"><Edit2 size={20} /></button>
                    <button onClick={() => onDeleteProduct(p.id)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
          {/* Editor Form */}
          <div className="space-y-6">
            <form onSubmit={handleAnnSubmit} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Megaphone className="text-indigo-600" /> {editingAnnId ? 'Editar Aviso' : 'Nuevo Aviso Libre'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Título Interno</label>
                  <input type="text" required placeholder="Ej: Horario de Verano" className="w-full mt-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" value={annForm.title} onChange={e => setAnnForm({...annForm, title: e.target.value})} />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mensaje Publicitario</label>
                  <textarea required placeholder="Escribe aquí el contenido del aviso..." className="w-full mt-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none" value={annForm.message} onChange={e => setAnnForm({...annForm, message: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tipografía</label>
                    <select className="w-full mt-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={annForm.fontFamily} onChange={e => setAnnForm({...annForm, fontFamily: e.target.value as FontType})}>
                      <option value="font-bebas">Impactante (Bebas)</option>
                      <option value="font-sans">Limpio (Inter)</option>
                      <option value="font-serif">Elegante (Serif)</option>
                      <option value="font-mono">Técnico (Mono)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tamaño Letra</label>
                    <div className="flex items-center gap-3 mt-2">
                      <input type="range" min="20" max="200" className="flex-1 accent-indigo-600" value={annForm.fontSize} onChange={e => setAnnForm({...annForm, fontSize: Number(e.target.value)})} />
                      <span className="font-bold text-slate-900 w-12">{annForm.fontSize}px</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                   <div className="col-span-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Alineación</label>
                    <div className="flex gap-1 mt-2">
                      {(['left', 'center', 'right'] as const).map(align => (
                        <button key={align} type="button" onClick={() => setAnnForm({...annForm, textAlign: align})} className={`flex-1 p-2 rounded-lg border transition-all ${annForm.textAlign === align ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-200'}`}>
                          {align === 'left' ? <AlignLeft size={16} /> : align === 'center' ? <AlignCenter size={16} /> : <AlignRight size={16} />}
                        </button>
                      ))}
                    </div>
                   </div>
                   <div className="col-span-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Fondo</label>
                    <input type="color" className="w-full h-10 mt-2 p-1 bg-white border border-slate-200 rounded-xl cursor-pointer" value={annForm.backgroundColor} onChange={e => setAnnForm({...annForm, backgroundColor: e.target.value})} />
                   </div>
                   <div className="col-span-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Letra</label>
                    <input type="color" className="w-full h-10 mt-2 p-1 bg-white border border-slate-200 rounded-xl cursor-pointer" value={annForm.textColor} onChange={e => setAnnForm({...annForm, textColor: e.target.value})} />
                   </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95">
                  {editingAnnId ? 'Actualizar Aviso' : 'Guardar Aviso'}
                </button>
                {editingAnnId && (
                  <button type="button" onClick={() => { setEditingAnnId(null); setAnnForm(INITIAL_ANN_STATE); }} className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Preview & List */}
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-4 left-4 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black text-white/50 uppercase tracking-widest">Vista Previa Real-Time</div>
              <div className="aspect-[16/10] flex items-center justify-center rounded-3xl transition-colors duration-500 overflow-hidden relative" style={{ backgroundColor: annForm.backgroundColor }}>
                {annForm.hasAnimation && <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none shine-effect"></div>}
                <div 
                  className={`p-10 leading-tight ${annForm.fontFamily} transition-all duration-300 w-full`}
                  style={{ 
                    fontSize: `${annForm.fontSize / 3}px`, 
                    color: annForm.textColor, 
                    textAlign: annForm.textAlign 
                  }}
                >
                  {annForm.message || 'Tu mensaje aparecerá aquí...'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Avisos Guardados</h4>
              {announcements.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400">
                  Aún no tienes avisos libres creados.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {announcements.map(ann => (
                    <div key={ann.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-400 transition-all">
                       <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: ann.backgroundColor }}>
                          <Megaphone size={20} />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900">{ann.title}</h5>
                          <p className="text-xs text-slate-400 font-medium">Font: {ann.fontFamily.replace('font-', '')} • {ann.fontSize}px</p>
                        </div>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleEditAnn(ann)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={18} /></button>
                         <button onClick={() => onDeleteAnnouncement(ann.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stores' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          <form onSubmit={e => {
            e.preventDefault();
            if (editingStoreId) { onUpdateStore({...storeForm, id: editingStoreId}); setEditingStoreId(null); }
            else onAddStore(storeForm);
            setStoreForm({ name: '', address: '', logoColor: 'bg-indigo-600' });
          }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 h-fit">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Building2 size={20} className="text-indigo-600" /> {editingStoreId ? 'Editar Local' : 'Nuevo Local'}
            </h3>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
              <input type="text" required className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Dirección</label>
              <input type="text" required className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none" value={storeForm.address} onChange={e => setStoreForm({...storeForm, address: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg">Guardar Local</button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            {stores.map(store => (
              <div key={store.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-indigo-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${store.logoColor} flex items-center justify-center text-white font-bold text-xl`}>{store.name.charAt(0)}</div>
                  <div>
                    <h4 className="font-bold text-slate-900">{store.name}</h4>
                    <p className="text-sm text-slate-500">{store.address}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingStoreId(store.id); setStoreForm({...store}); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={18} /></button>
                  <button onClick={() => onDeleteStore(store.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;
