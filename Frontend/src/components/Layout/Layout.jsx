import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: '📊', path: '/dashboard' },
  { text: 'Items Management', icon: '📦', path: '/items' },
  { text: 'Add Sale', icon: '➕', path: '/sales/add' },
  { text: 'Sales Records', icon: '📋', path: '/sales/records' },
  { text: 'Transport Tracker', icon: '🚛', path: '/transport' },
  { text: 'Reports', icon: '📈', path: '/reports' },
];

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={handleDrawerToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">Brick Business</h1>
        </div>
        
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 border-r-4 border-blue-600 text-blue-600'
                  : 'text-gray-700'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="font-medium">{item.text}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={handleDrawerToggle}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              Admin Dashboard - Block Cement Bricks Business
            </h2>
            <div className="w-8 md:w-auto"></div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
