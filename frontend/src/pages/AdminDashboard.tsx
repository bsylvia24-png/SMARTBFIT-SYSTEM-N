import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Users, Store, Shirt, ClipboardList } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'sellers' | 'products' | 'orders'>('users');
  
  const [users, setUsers] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token, activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        // Mock fetch users / sellers for standalone backend limits
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers([res.data.user]); 
      } else if (activeTab === 'sellers') {
        const res = await axios.get('http://localhost:5000/api/products');
        // Extract unique sellers from populated products
        const uniqueSellers: any[] = [];
        res.data.forEach((p: any) => {
          if (p.sellerId && typeof p.sellerId === 'object') {
            if (!uniqueSellers.find(s => s._id === p.sellerId._id)) {
              uniqueSellers.push(p.sellerId);
            }
          }
        });
        setSellers(uniqueSellers);
      } else if (activeTab === 'products') {
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

  const handleToggleVerify = async (_sellerId: string, currentStatus: boolean) => {
    // Optional backend toggle or mocked confirmation
    alert(`Boutique verification status toggled to: ${!currentStatus ? 'VERIFIED' : 'UNVERIFIED'}`);
    fetchAdminData();
  };

  return (
    <div className="bg-[#F5F1EB] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-[#2E1F16]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-[#2E1F16] text-[#F5F1EB] p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg border border-[#8B5E3C]/20">
          <div>
            <h1 className="font-poppins text-2xl font-bold tracking-wide">Platform Administrator Panel</h1>
            <p className="font-inter text-sm text-[#F5F1EB]/70 mt-1">Audit registries, toggle seller verification tokens, and inspect global order queues.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'users' ? 'bg-[#8B5E3C] text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Users className="h-4 w-4" /> Users
            </button>
            <button
              onClick={() => setActiveTab('sellers')}
              className={`py-2 px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'sellers' ? 'bg-[#8B5E3C] text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Store className="h-4 w-4" /> Sellers
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'products' ? 'bg-[#8B5E3C] text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Shirt className="h-4 w-4" /> Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'orders' ? 'bg-[#8B5E3C] text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <ClipboardList className="h-4 w-4" /> Orders
            </button>
          </div>
        </div>

        {/* Dynamic content cards */}
        <div className="bg-white border border-[#C4A484]/20 rounded-2xl p-6 shadow-sm">
          {loading ? (
            <div className="text-center py-20 font-poppins text-lg font-bold">Querying registry files...</div>
          ) : (
            <div className="space-y-4">
              
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <h3 className="font-poppins text-lg font-bold border-b border-[#F5F1EB] pb-3">Registered Users</h3>
                  {users.length === 0 ? (
                    <p className="text-sm text-gray-500">No users found.</p>
                  ) : (
                    <div className="divide-y divide-[#F5F1EB]">
                      {users.map((u: any, idx) => (
                        <div key={idx} className="py-3 flex justify-between items-center">
                          <div>
                            <p className="font-poppins text-sm font-semibold text-[#2E1F16]">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                          <span className="text-[10px] font-bold bg-[#F5F1EB] text-[#8B5E3C] uppercase px-2 py-0.5 rounded border border-[#C4A484]/20">
                            {u.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'sellers' && (
                <div className="space-y-4">
                  <h3 className="font-poppins text-lg font-bold border-b border-[#F5F1EB] pb-3">Fashion Boutiques & Sellers</h3>
                  {sellers.length === 0 ? (
                    <p className="text-sm text-gray-500">No verified or pending sellers currently registered.</p>
                  ) : (
                    <div className="divide-y divide-[#F5F1EB]">
                      {sellers.map((s: any) => (
                        <div key={s._id} className="py-3 flex justify-between items-center">
                          <div>
                            <p className="font-poppins text-sm font-semibold text-[#2E1F16]">{s.storeName}</p>
                            <p className="text-xs text-gray-500">{s.description || 'No description provided'}</p>
                          </div>
                          <button
                            onClick={() => handleToggleVerify(s._id, s.verifiedStatus)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                              s.verifiedStatus 
                                ? 'bg-green-50 border-green-200 text-green-700' 
                                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-green-50 hover:text-green-700'
                            }`}
                          >
                            {s.verifiedStatus ? 'Verified Boutique' : 'Verify Account'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'products' && (
                <div className="space-y-4">
                  <h3 className="font-poppins text-lg font-bold border-b border-[#F5F1EB] pb-3">Global Product Catalog</h3>
                  {products.length === 0 ? (
                    <p className="text-sm text-gray-500">No products published in the system catalog.</p>
                  ) : (
                    <div className="divide-y divide-[#F5F1EB]">
                      {products.map(p => (
                        <div key={p._id} className="py-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <img src={p.images[0]} alt="" className="w-10 h-12 object-cover bg-gray-50 rounded" />
                            <div>
                              <p className="font-poppins text-sm font-semibold text-[#2E1F16]">{p.name}</p>
                              <p className="text-xs text-gray-400">Category: {p.category}</p>
                            </div>
                          </div>
                          <span className="font-poppins font-bold text-sm text-[#8B5E3C]">${p.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h3 className="font-poppins text-lg font-bold border-b border-[#F5F1EB] pb-3">Global Transactions Registry</h3>
                  {orders.length === 0 ? (
                    <p className="text-sm text-gray-500">No transactions recorded yet.</p>
                  ) : (
                    <div className="divide-y divide-[#F5F1EB]">
                      {orders.map((o: any) => (
                        <div key={o._id} className="py-3 flex justify-between items-center">
                          <div>
                            <span className="text-xs font-mono font-bold text-[#8B5E3C]">ORDER ID: #{o._id.substring(12)}</span>
                            <p className="text-xs text-gray-500">Total: ${o.total} / Status: {o.status}</p>
                          </div>
                          <span className="text-[10px] font-bold text-[#2E1F16] uppercase bg-gray-100 py-1 px-2.5 rounded-full">
                            {o.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
