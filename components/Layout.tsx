import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-xl shadow-sm transition-transform group-hover:scale-105">
              GL
            </div>
            <span className="font-bold text-xl tracking-tight text-neutral-900">Goose Lake</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors">Home</Link>
            <Link to="/order" className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-semibold hover:bg-[#c9a305] transition-colors">
              Place Order
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-neutral-200 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md"></div>
            <span className="font-semibold text-neutral-900">Goose Lake &copy; 2024</span>
          </div>
          <div className="flex gap-8 text-sm text-neutral-500">
            <a href="#" className="hover:text-primary transition-colors">Support</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <Link to="/admin/login" className="hover:text-primary transition-colors font-medium">Admin Panel</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};