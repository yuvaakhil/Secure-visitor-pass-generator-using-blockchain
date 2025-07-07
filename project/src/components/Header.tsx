import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, Upload, QrCode, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-300" />
            <div>
              <h1 className="text-xl font-bold">SecurePass</h1>
              <p className="text-xs text-blue-200">Digital Gate Pass System</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isActive('/') ? 'bg-blue-800' : 'hover:bg-blue-800'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/upload" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isActive('/upload') ? 'bg-blue-800' : 'hover:bg-blue-800'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Link>
            <Link 
              to="/verify" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isActive('/verify') ? 'bg-blue-800' : 'hover:bg-blue-800'
              }`}
            >
              <QrCode className="h-4 w-4" />
              <span>Verify</span>
            </Link>
            <Link 
              to="/admin" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isActive('/admin') ? 'bg-blue-800' : 'hover:bg-blue-800'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </nav>
          
          <div className="md:hidden">
            <button className="text-white hover:text-blue-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;