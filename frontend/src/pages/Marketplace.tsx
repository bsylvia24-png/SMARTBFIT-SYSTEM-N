import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../components/ProductCard';
import { Search, Filter, ShoppingBag, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Marketplace: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cart State
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number; selectedSize: string; selectedColor: string }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Buy Now simulation state
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [category, verifiedOnly]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/products?`;
      if (category) url += `category=${category}&`;
      if (search) url += `search=${search}&`;
      if (minPrice) url += `minPrice=${minPrice}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}&`;
      if (verifiedOnly) url += `verifiedOnly=true&`;
      
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    // default size & color selection if not chosen
    const size = product.sizes[0]?.sizeLabel || 'M';
    const color = product.colors[0] || 'Default';

    setCart(prev => {
      const exists = prev.find(item => item.product._id === product._id && item.selectedSize === size);
      if (exists) {
        return prev.map(item => item.product._id === product._id && item.selectedSize === size 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
    setIsCartOpen(true);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert('Please log in or register to complete your purchase.');
      return;
    }
    if (cart.length === 0) return;

    try {
      // Create orders on the backend
      for (const item of cart) {
        const sellerId = typeof item.product.sellerId === 'object' ? item.product.sellerId._id : item.product.sellerId;
        await axios.post('http://localhost:5000/api/orders', {
          sellerId,
          products: [{ productId: item.product._id, quantity: item.quantity, size: item.selectedSize, color: item.selectedColor }],
          customMeasurements: {
            chest: 38,
            waist: 32,
            hips: 39
          },
          total: item.product.price * item.quantity
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setCart([]);
      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutSuccess(false);
        setIsCartOpen(false);
      }, 3000);
    } catch (err) {
      console.error('Checkout failed', err);
      alert('Checkout failed, please check your network connection.');
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="bg-[#F5F1EB] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-[#2E1F16]">
      <div className="max-w-7xl mx-auto">
        
        {/* Page title */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-poppins text-3xl font-bold">Premium Fashion Marketplace</h1>
            <p className="font-inter text-sm text-[#4A2C2A]/80">Guaranteed fits from verified tailors and designers.</p>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-[#2E1F16] hover:bg-[#8B5E3C] text-white rounded-full transition-all duration-300 shadow-md"
          >
            <ShoppingBag className="h-6 w-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8B5E3C] border-2 border-white text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="bg-white border border-[#C4A484]/20 rounded-2xl p-6 shadow-sm h-fit space-y-6">
            <h3 className="font-poppins text-lg font-bold flex items-center gap-2 border-b border-[#F5F1EB] pb-3">
              <Filter className="h-5 w-5 text-[#8B5E3C]" /> Catalog Filters
            </h3>

            {/* Search */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#2E1F16] uppercase">Search</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Silk shirt, linen trousers..."
                  className="w-full pl-9 pr-3 py-2 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#C4A484]" />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#2E1F16] uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              >
                <option value="">All Categories</option>
                <option value="tops">Tops</option>
                <option value="bottoms">Bottoms</option>
                <option value="dresses">Dresses</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            {/* Price Limit */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#2E1F16] uppercase">Min Price</label>
                <input 
                  type="number" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="$ Min"
                  className="w-full p-2 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2E1F16] uppercase">Max Price</label>
                <input 
                  type="number" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="$ Max"
                  className="w-full p-2 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>
            </div>

            {/* Verified status checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded border-[#C4A484]/30 text-[#8B5E3C] focus:ring-[#8B5E3C]" 
              />
              <span className="text-xs font-semibold text-[#2E1F16]">Verified Boutiques Only</span>
            </label>

            <button
              onClick={fetchProducts}
              className="w-full py-2.5 bg-[#2E1F16] hover:bg-[#8B5E3C] text-white font-semibold rounded-xl transition-all duration-300"
            >
              Apply Filter
            </button>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20 font-poppins text-lg font-bold">Catalog loading...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-[#C4A484]/30 bg-white/40 rounded-2xl">
                <p className="font-poppins text-lg font-bold text-[#2E1F16]">No items found</p>
                <p className="text-sm text-[#4A2C2A]/70">Try broadening your search query or removing filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                  <ProductCard 
                    key={p._id} 
                    product={p} 
                    onAddToCart={handleAddToCart}
                    onSelect={(prod) => setSelectedProduct(prod)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl relative p-6">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#F5F1EB] pb-4">
              <h3 className="font-poppins text-lg font-bold text-[#2E1F16] flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#8B5E3C]" /> Shopping Cart
              </h3>
              <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-[#F5F1EB] rounded-full">
                <X className="h-5 w-5 text-[#2E1F16]" />
              </button>
            </div>

            {/* Cart Items list */}
            <div className="flex-grow overflow-y-auto py-4 space-y-4">
              {checkoutSuccess ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                  <div className="h-12 w-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="font-poppins text-base font-bold text-green-700">Purchase Completed!</h4>
                  <p className="text-xs text-[#4A2C2A]/75">Your custom fit order has been placed successfully.</p>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-20 text-[#4A2C2A]/60">Your cart is currently empty.</div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border-b border-[#F5F1EB] pb-4">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      className="w-16 h-20 object-cover bg-[#F5F1EB] rounded-lg"
                    />
                    <div className="flex-grow">
                      <h4 className="font-poppins text-sm font-semibold line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-[#8B5E3C] mt-0.5">Size: {item.selectedSize} / Color: {item.selectedColor}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-bold">${item.product.price}</span>
                        <span className="text-xs text-[#2E1F16]">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout Footer */}
            {cart.length > 0 && !checkoutSuccess && (
              <div className="border-t border-[#F5F1EB] pt-4 space-y-4">
                <div className="flex justify-between font-poppins text-base font-bold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-[#2E1F16] hover:bg-[#8B5E3C] text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Buy Now (Secure Checkout)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col md:flex-row">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm"
            >
              <X className="h-5 w-5 text-[#2E1F16]" />
            </button>

            {/* Product Image */}
            <div className="md:w-1/2 aspect-[4/5] bg-[#F5F1EB]">
              <img 
                src={selectedProduct.images[0]} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Meta */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <span className="text-xs font-semibold text-[#8B5E3C] tracking-wide uppercase">
                  {typeof selectedProduct.sellerId === 'object' ? selectedProduct.sellerId.storeName : 'Seller'}
                </span>
                <h3 className="font-poppins text-xl font-bold text-[#2E1F16]">{selectedProduct.name}</h3>
                <p className="text-sm text-[#4A2C2A]/80 leading-relaxed">{selectedProduct.description}</p>

                <div className="space-y-2">
                  <span className="block text-xs font-bold text-[#2E1F16] uppercase">Available Sizes</span>
                  <div className="flex gap-2">
                    {selectedProduct.sizes.map((s, idx) => (
                      <span key={idx} className="px-3 py-1 text-xs border border-[#C4A484]/30 rounded-lg font-bold">
                        {s.sizeLabel}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-xs font-bold text-[#2E1F16] uppercase">Available Colors</span>
                  <div className="flex gap-2">
                    {selectedProduct.colors.map((c, idx) => (
                      <span key={idx} className="px-3 py-1 text-xs border border-[#C4A484]/30 rounded-lg text-[#2E1F16]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-[#F5F1EB] pt-4">
                <span className="font-poppins font-bold text-xl text-[#2E1F16]">${selectedProduct.price}</span>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="px-6 py-2.5 bg-[#2E1F16] hover:bg-[#8B5E3C] text-white font-bold rounded-xl transition-all duration-300"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
