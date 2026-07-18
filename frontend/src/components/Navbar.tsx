import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Shirt, LogOut, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/#features' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'About', path: '/#about' },
    { label: 'Contact', path: '/#contact' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#F5F1EB]/85 backdrop-blur-md border-b border-[#C4A484]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <Shirt className="h-8 w-8 text-[#8B5E3C] group-hover:rotate-6 transition-transform duration-300" />
              <span className="font-poppins text-2xl font-bold tracking-widest text-[#2E1F16]">
                SMART<span className="text-[#8B5E3C]">FIT</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.path}
                className="font-inter text-sm font-medium text-[#2E1F16] hover:text-[#8B5E3C] transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={
                    user.role === 'admin'
                      ? '/admin'
                      : user.role === 'seller'
                      ? '/seller'
                      : '/dashboard'
                  }
                  className="px-4 py-2 border border-[#8B5E3C]/30 text-[#8B5E3C] rounded-full text-sm font-medium hover:bg-[#8B5E3C] hover:text-white transition-all duration-300 flex items-center gap-1.5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#2E1F16]/70 hover:text-red-700 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth"
                  className="px-5 py-2 text-sm font-semibold text-[#2E1F16] hover:text-[#8B5E3C] transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/auth?signup=true"
                  className="px-6 py-2 text-sm font-semibold text-white bg-[#2E1F16] hover:bg-[#4A2C2A] rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#2E1F16] hover:text-[#8B5E3C] focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#F5F1EB] border-b border-[#C4A484]/20 px-4 pt-2 pb-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-[#2E1F16] hover:bg-[#C4A484]/10 hover:text-[#8B5E3C]"
            >
              {item.label}
            </a>
          ))}
          <hr className="border-[#C4A484]/20 my-2" />
          {isAuthenticated && user ? (
            <div className="space-y-2">
              <Link
                to={
                  user.role === 'admin'
                    ? '/admin'
                    : user.role === 'seller'
                    ? '/seller'
                    : '/dashboard'
                }
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#8B5E3C] text-[#8B5E3C] rounded-full text-base font-medium"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-700 text-white rounded-full text-base font-medium"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center px-4 py-2 text-base font-semibold text-[#2E1F16] hover:text-[#8B5E3C]"
              >
                Login
              </Link>
              <Link
                to="/auth?signup=true"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center px-4 py-2 text-base font-semibold text-white bg-[#2E1F16] hover:bg-[#4A2C2A] rounded-full"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
