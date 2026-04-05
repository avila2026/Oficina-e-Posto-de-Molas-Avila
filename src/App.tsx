/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Menu, 
  ShoppingCart, 
  Search, 
  ArrowRight, 
  Verified, 
  Zap, 
  Wrench, 
  Package, 
  Home as HomeIcon, 
  Heart, 
  User as UserIcon, 
  ReceiptText,
  ArrowLeft,
  Star,
  ChevronDown,
  Share2,
  Truck,
  Store,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from './constants';
import { Product, Screen } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  const navigateToDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('details');
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCartCount(prev => prev + 1);
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 300);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full max-w-md z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-outline-variant/10">
        <div className="absolute top-0 left-0 w-full h-1 bg-tertiary"></div>
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 text-on-surface cursor-pointer" />
          <span className="text-lg font-black italic text-on-surface tracking-tighter headline-font">
            Oficina e Posto de Molas Avila
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-full hover:bg-on-surface/5 transition-colors active:scale-95">
            <motion.div
              animate={isCartAnimating ? { 
                scale: [1, 1.2, 0.9, 1.1, 1],
                rotate: [0, -15, 15, -10, 10, 0]
              } : {}}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <ShoppingCart className="w-6 h-6 text-on-surface" />
            </motion.div>
            
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  key="cart-badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-0 right-0 bg-tertiary text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>

            {isCartAnimating && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-tertiary/20 rounded-full z-[-1]"
              />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-14 pb-20 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <HomeScreen 
                onNavigateCatalog={() => setCurrentScreen('catalog')} 
                onNavigateDetails={navigateToDetails} 
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          )}
          {currentScreen === 'catalog' && (
            <motion.div 
              key="catalog"
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="flex flex-col min-h-full bg-surface"
            >
              <CatalogScreen 
                onBack={() => setCurrentScreen('home')} 
                onNavigateDetails={navigateToDetails} 
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          )}
          {currentScreen === 'details' && selectedProduct && (
            <motion.div 
              key="details"
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="flex flex-col min-h-full bg-surface"
            >
              <DetailsScreen 
                product={selectedProduct} 
                onBack={() => setCurrentScreen('catalog')} 
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container-lowest/90 backdrop-blur-2xl z-50 border-t border-outline-variant/10">
        <NavItem 
          icon={<HomeIcon className="w-6 h-6" />} 
          label="Loja" 
          active={currentScreen === 'home'} 
          onClick={() => setCurrentScreen('home')} 
        />
        <NavItem 
          icon={<Search className="w-6 h-6" />} 
          label="Busca" 
          active={currentScreen === 'catalog'} 
          onClick={() => setCurrentScreen('catalog')} 
        />
        <NavItem 
          icon={<ReceiptText className="w-6 h-6" />} 
          label="Pedidos" 
          active={currentScreen === 'orders'} 
          onClick={() => setCurrentScreen('orders')} 
        />
        <NavItem 
          icon={<UserIcon className="w-6 h-6" />} 
          label="Perfil" 
          active={currentScreen === 'profile'} 
          onClick={() => setCurrentScreen('profile')} 
        />
      </nav>
    </div>
  );
}

const NavItem = React.memo(({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${active ? 'text-primary' : 'text-on-surface/40'}`}
    >
      <div className={`${active ? 'scale-110' : 'scale-100'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
});

function HomeScreen({ onNavigateCatalog, onNavigateDetails, onAddToCart }: { onNavigateCatalog: () => void, onNavigateDetails: (p: Product) => void, onAddToCart: (e?: React.MouseEvent) => void }) {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex flex-col justify-end p-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-primary/20 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary-container/40 z-10"></div>
          <img 
            className="w-full h-full object-cover object-center scale-105" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsPtp_PvKovFB4rmce37T-XvwEgFPSwWZWe3y1tQNNp9nLj1HVd1bE9wFazr0p0YiFW-N8f3yMdALK6CfPz5Bl95M3wpU_COzJUb9FJ4nV-RFbPSiq_giN9l1S-LeqnbsWYCsbiWScPYe2yXmdnmaw3REtKsJbxHL54o0_Xs5vtbMcVGly2SfvwFRnUV2NvC_rUqwbgjiNFTF90uLBvgFG3LmXLhSmn6Pi3sEQFYWutlFu0512WtCzn2tSwbc5X9gO2mpQmPWWgkmF" 
            alt="Engine"
            referrerPolicy="no-referrer"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        
        <div className="relative z-20 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 w-fit">
            <Truck className="w-4 h-4 text-white" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white">ENTREGA EXCLUSIVA NO ACRE</span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="headline-font text-5xl font-black text-white leading-[0.95] tracking-tighter uppercase">
              PEÇAS ORIGINAIS PARA SEU VEÍCULO
            </h1>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs font-light">
              Precisão técnica e performance extrema. Encontre componentes de fábrica com garantia total.
            </p>
          </div>

          <div className="relative flex items-center bg-surface-container-lowest shadow-2xl rounded-xl p-1 border border-outline-variant/15">
            <Search className="w-5 h-5 text-on-surface/40 ml-3" />
            <input 
              className="w-full bg-transparent border-none focus:outline-none text-on-surface p-3 text-sm placeholder:text-on-surface/30" 
              placeholder="Busque por modelo, ano ou peça..." 
              type="text"
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onNavigateCatalog}
              className="bg-primary text-white px-6 py-4 rounded-lg font-black uppercase tracking-widest text-xs flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              VER CATÁLOGO
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-lg font-black uppercase tracking-widest text-xs active:scale-95 transition-all">
              PROMOÇÕES
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 gap-3 px-6 -mt-6 relative z-30">
        <StatCard icon={<Zap className="w-5 h-5 text-primary" />} label="Envio" value="EM 24H" />
        <StatCard icon={<Wrench className="w-5 h-5 text-primary" />} label="Suporte" value="ESPECIALISTA" />
      </section>

      {/* Featured Section */}
      <section className="px-6 py-10">
        <h2 className="headline-font text-2xl font-bold uppercase mb-6">Destaques</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {PRODUCTS.slice(0, 4).map(product => (
            <div 
              key={product.id} 
              onClick={() => onNavigateDetails(product)}
              className="min-w-[200px] bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10 relative group"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-32 object-cover" 
                referrerPolicy="no-referrer" 
                loading="lazy"
                decoding="async"
              />
              <button 
                onClick={product.inStock ? onAddToCart : undefined}
                disabled={!product.inStock}
                className={`absolute top-2 right-2 backdrop-blur-md p-2 rounded-full shadow-lg transition-opacity active:scale-90 ${product.inStock ? 'bg-white/90 opacity-0 group-hover:opacity-100' : 'bg-on-surface/20 opacity-100'}`}
              >
                <Package className={`w-4 h-4 ${product.inStock ? 'text-primary' : 'text-on-surface/40'}`} />
              </button>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-on-surface/60 uppercase tracking-widest">{product.category}</p>
                  {!product.inStock && <span className="text-[8px] font-black text-on-surface/40 bg-on-surface/5 px-1 rounded">ESGOTADO</span>}
                </div>
                <h3 className="font-bold text-sm truncate">{product.name}</h3>
                <p className="text-primary font-black mt-2">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const StatCard = React.memo(({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col gap-1">
      {icon}
      <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface/40">{label}</p>
      <p className="text-xs font-black text-on-surface">{value}</p>
    </div>
  );
});

function CatalogScreen({ onBack, onNavigateDetails, onAddToCart }: { onBack: () => void, onNavigateDetails: (p: Product) => void, onAddToCart: (e?: React.MouseEvent) => void }) {
  const [activeCategory, setActiveCategory] = useState('Todas as Peças');
  const categories = ['Todas as Peças', 'Motor', 'Suspensão', 'Freios', 'Escapamento', 'Interior'];

  const filteredProducts = activeCategory === 'Todas as Peças' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col min-h-full bg-surface">
      <div className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl p-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="headline-font text-lg font-bold uppercase tracking-tight">Peças de Alta Performance</h2>
      </div>

      <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar border-b border-outline-variant/10">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`relative px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'text-white' : 'text-on-surface/60 bg-surface-container-low'}`}
          >
            {activeCategory === cat && (
              <motion.div 
                layoutId="activeCategory"
                className="absolute inset-0 bg-primary rounded-lg z-0"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map(product => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={product.id} 
              onClick={() => onNavigateDetails(product)}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10 flex flex-col relative group"
            >
              <div className="aspect-square overflow-hidden bg-surface-container-low">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                referrerPolicy="no-referrer" 
                loading="lazy"
                decoding="async"
              />
            </div>
            <button 
              onClick={product.inStock ? onAddToCart : undefined}
              disabled={!product.inStock}
              className={`absolute top-2 right-2 backdrop-blur-md p-2 rounded-full shadow-lg transition-opacity active:scale-90 ${product.inStock ? 'bg-white/90 opacity-0 group-hover:opacity-100' : 'bg-on-surface/20 opacity-100'}`}
            >
              <Package className={`w-4 h-4 ${product.inStock ? 'text-primary' : 'text-on-surface/40'}`} />
            </button>
            <div className="p-3 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="headline-font text-xs font-bold uppercase truncate">{product.name}</h3>
                {!product.inStock && <span className="text-[8px] font-black text-on-surface/40 bg-on-surface/5 px-1 rounded">ESGOTADO</span>}
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-primary text-sm font-black">
                  {product.price > 0 ? `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Sob Consulta'}
                </p>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-tertiary fill-tertiary" />
                  <span className="text-[10px] font-bold text-on-surface/60">{product.rating}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DetailsScreen({ product, onBack, onAddToCart }: { product: Product, onBack: () => void, onAddToCart: (e?: React.MouseEvent) => void }) {
  return (
    <div className="flex flex-col min-h-full bg-surface">
      <div className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl p-4 flex items-center justify-between border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="headline-font text-sm font-bold uppercase tracking-widest">Ficha Técnica</h2>
        </div>
        <Share2 className="w-5 h-5 text-on-surface/60 cursor-pointer" />
      </div>

      <div className="flex flex-col">
        <div className="w-full aspect-video bg-surface-container-low overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer" 
            decoding="async"
          />
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {product.inStock ? (
              <span className="bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Em Estoque</span>
            ) : (
              <span className="bg-on-surface/10 text-on-surface/40 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Fora de Estoque</span>
            )}
            <span className="text-on-surface/40 text-xs font-medium">Cód: {product.code || 'N/A'}</span>
          </div>

          <h1 className="headline-font text-3xl font-black leading-none tracking-tighter uppercase">
            {product.name}
          </h1>
          
          <p className="text-on-surface/60 text-base font-light leading-relaxed">
            {product.description || 'Componente de alta precisão desenvolvido para performance extrema e durabilidade em condições severas.'}
          </p>

          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 mt-4">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" />
              Especificações Técnicas
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {product.specs?.map(spec => (
                <div key={spec.label}>
                  <p className="text-[10px] font-bold uppercase text-on-surface/40 mb-1">{spec.label}</p>
                  <p className="headline-font font-bold text-lg">{spec.value}</p>
                </div>
              )) || (
                <>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-on-surface/40 mb-1">Material</p>
                    <p className="headline-font font-bold text-lg">Aço Forjado</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-on-surface/40 mb-1">Origem</p>
                    <p className="headline-font font-bold text-lg">Brasil</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Instruções de Instalação</h3>
            <ul className="space-y-4">
              <li className="flex gap-4 text-sm">
                <span className="font-black text-primary">01.</span>
                <span className="text-on-surface/70">Certifique-se que o veículo esteja nivelado e travado.</span>
              </li>
              <li className="flex gap-4 text-sm">
                <span className="font-black text-primary">02.</span>
                <span className="text-on-surface/70">Verifique o alinhamento dos grampos antes do aperto final.</span>
              </li>
              <li className="flex gap-4 text-sm">
                <span className="font-black text-primary">03.</span>
                <span className="text-on-surface/70">Aplique torque conforme manual da montadora.</span>
              </li>
            </ul>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Opções de Entrega</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-bold text-sm">Entrega Local (Logística Própria)</p>
                  <p className="text-xs text-on-surface/40">Para toda região metropolitana em até 24h.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Store className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-bold text-sm">Retirada em Unidade</p>
                  <p className="text-xs text-on-surface/40">Disponível imediatamente após confirmação.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-32"></div>

      <div className="fixed bottom-0 w-full max-w-md p-4 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/10 z-50 flex gap-3">
        {product.inStock ? (
          <>
            <button 
              onClick={onAddToCart}
              className="flex-1 bg-surface-container-lowest border border-primary text-primary py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="headline-font font-bold text-[10px] uppercase tracking-tighter leading-tight text-center">Carrinho</span>
            </button>
            <button className="flex-1 bg-primary text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform">
              <MessageCircle className="w-5 h-5" />
              <span className="headline-font font-bold text-[10px] uppercase tracking-tighter leading-tight text-center">Falar no WhatsApp</span>
            </button>
          </>
        ) : (
          <button className="w-full bg-on-surface text-white py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-transform">
            <Zap className="w-6 h-6 text-tertiary" />
            <span className="headline-font font-bold text-lg uppercase tracking-tighter">Avise-me quando chegar</span>
          </button>
        )}
      </div>
    </div>
  );
}
