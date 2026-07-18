import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Plus, Trash2, Edit3, Shirt, ShoppingCart, BarChart3, Package, Save } from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const { token } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics'>('inventory');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Product Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('tops');
  const [stock, setStock] = useState('20');
  const [imageUrl, setImageUrl] = useState('');
  const [sizesInput, setSizesInput] = useState('S, M, L');
  const [colorsInput, setColorsInput] = useState('Brown, Beige, Black');
  
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Tracking numbers status form state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderStatus] = useState('shipped');

  useEffect(() => {
    if (token) {
      fetchSellerData();
    }
  }, [token, activeTab]);

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'inventory') {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } else if (activeTab === 'orders') {
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const sizes = sizesInput.split(',').map(s => ({
      sizeLabel: s.trim(),
      measurements: { chest: 38, waist: 32 }
    }));
    const colors = colorsInput.split(',').map(c => c.trim());
    const images = [imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60'];

    const payload = { name, description, price: Number(price), category, stock: Number(stock), images, sizes, colors };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/products', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Reset
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setEditingId(null);
      fetchSellerData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p._id);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price.toString());
    setCategory(p.category);
    setStock(p.stock.toString());
    setImageUrl(p.images[0] || '');
    setSizesInput(p.sizes.map((s: any) => s.sizeLabel).join(', '));
    setColorsInput(p.colors.join(', '));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSellerData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrderId) return;
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/orders/${selectedOrderId}/status`, {
        status: orderStatus,
        trackingNumber
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedOrderId(null);
      setTrackingNumber('');
      fetchSellerData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Analytics totals calculation
  const totalSalesCount = orders.length;
  const totalRevenueVal = orders.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="bg-[#F5F1EB] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-[#2E1F16]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white border border-[#C4A484]/20 p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="font-poppins text-2xl font-bold">Seller Management Suite</h1>
            <p className="font-inter text-sm text-[#4A2C2A]/80">Manage listings, edit portfolio products, and check customer purchases.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-2 px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'inventory' ? 'bg-[#2E1F16] text-white' : 'bg-[#F5F1EB] hover:bg-[#ebdccb] text-[#2E1F16]'
              }`}
            >
              <Package className="h-4 w-4" /> Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'orders' ? 'bg-[#2E1F16] text-white' : 'bg-[#F5F1EB] hover:bg-[#ebdccb] text-[#2E1F16]'
              }`}
            >
              <ShoppingCart className="h-4 w-4" /> Orders
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'analytics' ? 'bg-[#2E1F16] text-white' : 'bg-[#F5F1EB] hover:bg-[#ebdccb] text-[#2E1F16]'
              }`}
            >
              <BarChart3 className="h-4 w-4" /> Analytics
            </button>
          </div>
        </div>

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form to Create/Edit */}
            <div className="bg-white border border-[#C4A484]/20 rounded-2xl p-6 shadow-sm h-fit">
              <h3 className="font-poppins text-lg font-bold mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#8B5E3C]" /> {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Silk Dress, Leather Belt..."
                    className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description detailing fits, fabrics, styling..."
                    rows={3}
                    className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase">Price ($)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="180"
                      className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase">Stock</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="20"
                      className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl text-sm bg-white"
                    >
                      <option value="tops">Tops</option>
                      <option value="bottoms">Bottoms</option>
                      <option value="dresses">Dresses</option>
                      <option value="shoes">Shoes</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase">Image URL</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://image-link.com"
                      className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase">Sizes (comma split)</label>
                    <input
                      type="text"
                      value={sizesInput}
                      onChange={(e) => setSizesInput(e.target.value)}
                      placeholder="S, M, L"
                      className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase">Colors (comma split)</label>
                    <input
                      type="text"
                      value={colorsInput}
                      onChange={(e) => setColorsInput(e.target.value)}
                      placeholder="Brown, Cream"
                      className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl text-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#2E1F16] hover:bg-[#8B5E3C] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Save className="h-4 w-4" /> {editingId ? 'Update Listing' : 'Publish Product'}
                </button>
              </form>
            </div>

            {/* Products List */}
            <div className="lg:col-span-2 bg-white border border-[#C4A484]/20 rounded-2xl p-6 shadow-sm">
              <h3 className="font-poppins text-lg font-bold mb-4 flex items-center gap-2">
                <Shirt className="h-5 w-5 text-[#8B5E3C]" /> Active Listings
              </h3>
              <div className="space-y-4">
                {products.length === 0 ? (
                  <p className="text-sm text-[#4A2C2A]/60">You have no products listed. Create one to get started.</p>
                ) : (
                  products.map(p => (
                    <div key={p._id} className="flex gap-4 p-4 border border-[#C4A484]/20 rounded-xl justify-between items-center">
                      <div className="flex gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-16 object-cover bg-[#F5F1EB] rounded-lg"
                        />
                        <div>
                          <h4 className="font-poppins text-sm font-semibold">{p.name}</h4>
                          <span className="text-xs text-[#8B5E3C] font-bold">${p.price}</span>
                          <p className="text-[10px] text-gray-500">Stock: {p.stock} units</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 hover:bg-[#F5F1EB] border border-gray-150 rounded-lg text-gray-700"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 hover:bg-red-50 border border-red-100 rounded-lg text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white border border-[#C4A484]/20 rounded-2xl p-6 shadow-sm">
            <h3 className="font-poppins text-lg font-bold mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-[#8B5E3C]" /> Customer Purchases
            </h3>
            {orders.length === 0 ? (
              <p className="text-sm text-[#4A2C2A]/60">No customer orders have been received yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((o: any) => (
                  <div key={o._id} className="p-5 border border-[#C4A484]/20 rounded-xl flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <span className="text-xs font-bold text-[#8B5E3C]">ORDER #{o._id.substring(12)}</span>
                      <h4 className="font-poppins text-base font-semibold mt-1">Total value: ${o.total}</h4>
                      <p className="text-xs text-[#2E1F16]/75 mt-0.5">Buyer: {o.userId?.name || 'Anonymous'}</p>
                      <p className="text-xs text-[#2E1F16]/75">Status: <span className="uppercase font-bold text-[#8B5E3C]">{o.status}</span></p>
                    </div>

                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      {o.trackingNumber ? (
                        <div className="text-sm bg-[#F5F1EB] p-2 rounded-lg text-[#2E1F16] border border-[#C4A484]/25">
                          <span className="block text-[10px] font-bold text-gray-500">TRACKING NUMBER</span>
                          <span className="font-mono">{o.trackingNumber}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedOrderId(o._id);
                            setTrackingNumber('');
                          }}
                          className="px-4 py-2 bg-[#2E1F16] hover:bg-[#8B5E3C] text-white text-xs font-bold rounded-lg transition-all"
                        >
                          Ship Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tracking Modal */}
            {selectedOrderId && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-xl space-y-4 border border-[#C4A484]/20">
                  <h4 className="font-poppins text-lg font-bold text-[#2E1F16]">Set Tracking Reference</h4>
                  <div>
                    <label className="block text-xs font-bold uppercase">Tracking Code / Number</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="E.g. FedEx-98934"
                      className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl text-sm"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setSelectedOrderId(null)}
                      className="px-4 py-2 border border-[#C4A484]/30 rounded-lg text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateOrderStatus}
                      className="px-4 py-2 bg-[#2E1F16] text-white rounded-lg text-xs font-bold"
                    >
                      Confirm Dispatch
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-[#C4A484]/20 rounded-2xl p-6 shadow-sm">
              <h3 className="font-poppins text-lg font-bold mb-4">Sales Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-[#F5F1EB] rounded-2xl text-center border border-[#C4A484]/20">
                  <span className="block text-xs font-bold text-[#8B5E3C] uppercase">Total Orders</span>
                  <span className="font-poppins font-extrabold text-3xl">{totalSalesCount}</span>
                </div>
                <div className="p-5 bg-[#F5F1EB] rounded-2xl text-center border border-[#C4A484]/20">
                  <span className="block text-xs font-bold text-[#8B5E3C] uppercase">Revenue</span>
                  <span className="font-poppins font-extrabold text-3xl">${totalRevenueVal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#C4A484]/20 rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
              <BarChart3 className="h-10 w-10 text-[#C4A484] mb-3" />
              <h4 className="font-poppins font-bold text-base">Interactive Sales & Fit Reports</h4>
              <p className="text-xs text-[#4A2C2A]/70 max-w-xs mt-1">
                Your monthly checkout trends and fit return rate analytics will automatically update once customer feedback reviews arrive.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
