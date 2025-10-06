import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Головна', href: '/' },
    { name: 'Про нас', href: '/about-us' },
    { name: 'Документи', href: '/documents' },
    { name: 'Профбюро', href: '/fuck' },
    { name: 'Новини', href: '/news' },
    { name: 'Контакти', href: '/contacts' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Хедер */}
      <header className="relative bg-white/60 backdrop-blur-md border-b border-gray-200 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Логотип */}
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Логотип профкому студентів ЛНУ"
                className="h-14 w-14 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden h-10 w-10 bg-white rounded-lg items-center justify-center text-[#1E2A5A] font-bold text-lg">
                ЛНУ
              </div>
              <div className="hidden xxs:block">
                <h1 className="text-md font-bold text-[#1E2A5A]">Профком студентів</h1>
                <p className="text-sm text-[#1E2A5A]">ЛНУ імені Івана Франка</p>
              </div>
            </Link>

            {/* Десктоп-навігація */}
            <nav className="hidden lg:flex space-x-6">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-1 rounded-2xl text-sm font-medium transition-all duration-300 border hover:-translate-y-0.5
                      ${active
                        ? 'text-blue-600 bg-white shadow-md border-gray-300'
                        : 'text-[#1E2A5A] border-transparent hover:border-gray-300 hover:shadow-md'
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Кнопка меню */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-[#1E2A5A] transition-all duration-300"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`absolute inset-0 h-6 w-6 transform transition-all duration-300 ${
                      isMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                    }`}
                  />
                  <X
                    className={`absolute inset-0 h-6 w-6 transform hover:text-blue-600 transition-all duration-300 ${
                      isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Мобільне меню */}
      <div
        className={`lg:hidden fixed top-16 left-0 w-full bg-white/60 backdrop-blur-md border-t border-gray-200 shadow-md overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out z-40 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-3 pb-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-300 border hover:-translate-y-0.5 ${
                isActive(item.href)
                  ? 'text-blue-600 bg-white shadow-md border-gray-300'
                  : 'text-[#1E2A5A] border-transparent hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;