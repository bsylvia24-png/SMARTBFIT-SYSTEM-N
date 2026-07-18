import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Mail, Lock, User as UserIcon, Store, Shirt } from 'lucide-react';

export const LoginRegister: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSignUpParam = searchParams.get('signup') === 'true';

  const [isSignUp, setIsSignUp] = useState(isSignUpParam);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsSignUp(isSignUpParam);
  }, [isSignUpParam]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const payload: any = { name, email, password, role };
        if (role === 'seller') {
          payload.storeName = storeName;
          payload.description = description;
        }
        const res = await axios.post('http://localhost:5000/api/auth/register', payload);
        login(res.data.token, res.data.user);
      } else {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        login(res.data.token, res.data.user);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#2E1F16]">
      <div className="sm:mx-auto w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Shirt className="h-12 w-12 text-[#8B5E3C]" />
        </div>
        <h2 className="font-poppins text-3xl font-extrabold tracking-tight text-[#2E1F16]">
          {isSignUp ? 'Create your Smart Fit Account' : 'Sign in to Smart Fit'}
        </h2>
        <p className="mt-2 text-sm text-[#4A2C2A]/70">
          Or{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-semibold text-[#8B5E3C] hover:text-[#6F4E37] focus:outline-none transition-colors"
          >
            {isSignUp ? 'sign in to your existing account' : 'register a new account'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 border border-[#C4A484]/20 shadow-xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-[#2E1F16]">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-[#C4A484]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Olivia Laurence"
                    className="block w-full pl-10 pr-3 py-2.5 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/30 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#2E1F16]">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#C4A484]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@luxuryfit.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/30 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2E1F16]">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#C4A484]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/30 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 text-sm"
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#2E1F16] mb-2">Account Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('customer')}
                      className={`py-2 px-4 text-sm font-semibold border rounded-xl transition-all duration-200 ${
                        role === 'customer'
                          ? 'bg-[#2E1F16] text-white border-[#2E1F16]'
                          : 'bg-white border-[#C4A484]/30 text-[#2E1F16] hover:bg-[#F5F1EB]'
                      }`}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('seller')}
                      className={`py-2 px-4 text-sm font-semibold border rounded-xl transition-all duration-200 ${
                        role === 'seller'
                          ? 'bg-[#2E1F16] text-white border-[#2E1F16]'
                          : 'bg-white border-[#C4A484]/30 text-[#2E1F16] hover:bg-[#F5F1EB]'
                      }`}
                    >
                      Fashion Seller
                    </button>
                  </div>
                </div>

                {role === 'seller' && (
                  <div className="space-y-4 border-t border-[#F5F1EB] pt-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#2E1F16]">Store Name</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Store className="h-5 w-5 text-[#C4A484]" />
                        </div>
                        <input
                          type="text"
                          required
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          placeholder="E.g. Florence Atelier"
                          className="block w-full pl-10 pr-3 py-2.5 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/30 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2E1F16]">Store Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your boutique or garments portfolio..."
                        rows={3}
                        className="block w-full mt-1 p-3 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/30 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-md text-sm font-bold text-white bg-[#2E1F16] hover:bg-[#8B5E3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5E3C] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : isSignUp ? 'Create Luxury Profile' : 'Authenticate'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
