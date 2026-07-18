import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Ruler, ClipboardList, Heart, Bell, Settings, LogOut, CheckCircle } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { token, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'measurements' | 'orders' | 'wishlist' | 'notifications' | 'settings'>('profile');
  
  // State variables
  const [profileName, setProfileName] = useState('');
  const [measurements, setMeasurements] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token, activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setMsg('');
    try {
      if (activeTab === 'profile') {
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileName(res.data.user.name);
      } else if (activeTab === 'measurements') {
        const res = await axios.get('http://localhost:5000/api/measurements', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMeasurements(res.data);
      } else if (activeTab === 'orders') {
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } else if (activeTab === 'wishlist') {
        const res = await axios.get('http://localhost:5000/api/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist(res.data.products || []);
      } else if (activeTab === 'notifications') {
        const res = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard tab:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('http://localhost:5000/api/auth/profile', { name: profileName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Profile updated successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeasurements = async () => {
    if (!confirm('Are you sure you want to delete your measurements?')) return;
    setLoading(true);
    try {
      await axios.delete('http://localhost:5000/api/measurements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeasurements(null);
      setMsg('Measurements removed.');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F5F1EB] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-[#2E1F16]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="bg-white border border-[#C4A484]/20 rounded-2xl p-6 shadow-sm h-fit space-y-6">
          <div className="text-center pb-6 border-b border-[#F5F1EB]">
            <div className="h-16 w-16 bg-[#2E1F16] text-white rounded-full flex items-center justify-center font-poppins font-bold text-xl mx-auto mb-3 shadow-md">
              {user?.name.charAt(0)}
            </div>
            <h3 className="font-poppins font-bold text-base">{user?.name}</h3>
            <span className="text-xs text-[#8B5E3C] font-semibold tracking-wider uppercase">{user?.role}</span>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                activeTab === 'profile' ? 'bg-[#2E1F16] text-white' : 'hover:bg-[#F5F1EB] text-[#2E1F16]'
              }`}
            >
              <User className="h-4 w-4" /> Profile
            </button>
            <button
              onClick={() => setActiveTab('measurements')}
              className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                activeTab === 'measurements' ? 'bg-[#2E1F16] text-white' : 'hover:bg-[#F5F1EB] text-[#2E1F16]'
              }`}
            >
              <Ruler className="h-4 w-4" /> Saved Sizes
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                activeTab === 'orders' ? 'bg-[#2E1F16] text-white' : 'hover:bg-[#F5F1EB] text-[#2E1F16]'
              }`}
            >
              <ClipboardList className="h-4 w-4" /> Orders
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                activeTab === 'wishlist' ? 'bg-[#2E1F16] text-white' : 'hover:bg-[#F5F1EB] text-[#2E1F16]'
              }`}
            >
              <Heart className="h-4 w-4" /> Wishlist
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                activeTab === 'notifications' ? 'bg-[#2E1F16] text-white' : 'hover:bg-[#F5F1EB] text-[#2E1F16]'
              }`}
            >
              <Bell className="h-4 w-4" /> Notifications
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                activeTab === 'settings' ? 'bg-[#2E1F16] text-white' : 'hover:bg-[#F5F1EB] text-[#2E1F16]'
              }`}
            >
              <Settings className="h-4 w-4" /> Settings
            </button>
          </nav>
        </div>

        {/* Content Pane */}
        <div className="md:col-span-3 bg-white border border-[#C4A484]/20 rounded-2xl p-8 shadow-sm min-h-[500px]">
          {msg && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" /> {msg}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-poppins text-xl font-bold border-b border-[#F5F1EB] pb-3">Account Details</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#2E1F16]">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="mt-1 block w-full p-2.5 border border-[#C4A484]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#2E1F16]/50">Email Address (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email}
                    className="mt-1 block w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2.5 px-6 bg-[#2E1F16] hover:bg-[#8B5E3C] text-white font-bold rounded-xl transition-all"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'measurements' && (
            <div className="space-y-6">
              <h2 className="font-poppins text-xl font-bold border-b border-[#F5F1EB] pb-3">Saved Body Silhouette</h2>
              {measurements ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-[#F5F1EB]/50 border border-[#C4A484]/20 rounded-xl text-center">
                      <span className="block text-[10px] font-bold text-[#8B5E3C] uppercase">Height</span>
                      <span className="font-poppins font-extrabold text-xl">{measurements.height} cm</span>
                    </div>
                    <div className="p-4 bg-[#F5F1EB]/50 border border-[#C4A484]/20 rounded-xl text-center">
                      <span className="block text-[10px] font-bold text-[#8B5E3C] uppercase">Weight</span>
                      <span className="font-poppins font-extrabold text-xl">{measurements.weight} kg</span>
                    </div>
                    <div className="p-4 bg-[#F5F1EB]/50 border border-[#C4A484]/20 rounded-xl text-center">
                      <span className="block text-[10px] font-bold text-[#8B5E3C] uppercase">Chest</span>
                      <span className="font-poppins font-extrabold text-xl">{measurements.chest} in</span>
                    </div>
                    <div className="p-4 bg-[#F5F1EB]/50 border border-[#C4A484]/20 rounded-xl text-center">
                      <span className="block text-[10px] font-bold text-[#8B5E3C] uppercase">Waist</span>
                      <span className="font-poppins font-extrabold text-xl">{measurements.waist} in</span>
                    </div>
                  </div>

                  <button
                    onClick={handleDeleteMeasurements}
                    className="py-2 px-4 border border-red-200 text-red-700 hover:bg-red-50 text-sm font-semibold rounded-xl transition-all"
                  >
                    Delete Silhouette Data
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-[#C4A484]/30 rounded-xl">
                  <p className="text-sm text-[#4A2C2A]/70 mb-4">No saved silhouette measurements found.</p>
                  <a href="/fit-recommendation" className="px-5 py-2.5 bg-[#2E1F16] text-white text-sm font-bold rounded-xl hover:bg-[#8B5E3C] transition-all">
                    Configure AI Sizer
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-poppins text-xl font-bold border-b border-[#F5F1EB] pb-3">Purchase History</h2>
              {orders.length === 0 ? (
                <p className="text-sm text-[#4A2C2A]/60">You have not placed any orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((o: any) => (
                    <div key={o._id} className="p-5 border border-[#C4A484]/20 rounded-xl flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-[#8B5E3C]">ORDER #{o._id.substring(12)}</span>
                        <h4 className="font-poppins text-base font-semibold mt-1">Total: ${o.total}</h4>
                        <p className="text-xs text-[#2E1F16]/75 mt-0.5">Status: <span className="uppercase font-bold text-[#8B5E3C]">{o.status}</span></p>
                      </div>
                      {o.trackingNumber && (
                        <div className="text-sm bg-[#F5F1EB] p-2.5 rounded-lg border border-[#C4A484]/15">
                          <span className="block text-[10px] font-bold">TRACKING NUMBER</span>
                          <span className="font-mono text-xs">{o.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="font-poppins text-xl font-bold border-b border-[#F5F1EB] pb-3">Wishlist Products</h2>
              {wishlist.length === 0 ? (
                <p className="text-sm text-[#4A2C2A]/60">Your wishlist is currently empty.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mock wishlist items */}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="font-poppins text-xl font-bold border-b border-[#F5F1EB] pb-3">System Notifications</h2>
              {notifications.length === 0 ? (
                <p className="text-sm text-[#4A2C2A]/60">No new messages or notifications.</p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n: any) => (
                    <div key={n._id} className="p-4 bg-[#F5F1EB]/55 border border-[#C4A484]/15 rounded-xl flex justify-between items-center">
                      <p className="text-sm text-[#2E1F16]">{n.message}</p>
                      <span className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="font-poppins text-xl font-bold border-b border-[#F5F1EB] pb-3">Configuration & Settings</h2>
              <div className="space-y-4">
                <button
                  onClick={logout}
                  className="py-2.5 px-6 border border-red-700 text-red-700 hover:bg-red-50 font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
