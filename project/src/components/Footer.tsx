/*import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Контактна інформація</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">
                  вул. Університетська, 1<br />
                  м. Львів, 79000
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <p className="text-gray-300">+38 (032) 239-41-32</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <p className="text-gray-300">profkom@lnu.edu.ua</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Режим роботи</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-400" />
                <div className="text-gray-300">
                  <p>Пн-Пт: 9:00 - 18:00</p>
                  <p>Сб-Нд: вихідні</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Про нас</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Профспілкова організація студентів ЛНУ імені Івана Франка захищає права та інтереси студентів, 
              надає соціальну підтримку та організовує культурно-освітні заходи.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Профком студентів ЛНУ імені Івана Франка. Всі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;*/
import React from 'react';
import { MapPin, Phone, Mail, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Контактна інформація</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">
                  вул. Університетська, 1<br />
                  м. Львів, 79000
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <p className="text-gray-300">+38 (032) 239-41-32</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <p className="text-gray-300">profkom@lnu.edu.ua</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Режим роботи</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-400" />
                <div className="text-gray-300">
                  <p>Пн-Пт: 9:00 - 18:00</p>
                  <p>Сб-Нд: вихідні</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Про нас</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Профспілкова організація студентів ЛНУ імені Івана Франка захищає права та інтереси студентів, 
              надає соціальну підтримку та організовує культурно-освітні заходи.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center space-x-1 text-sm text-blue-400 hover:underline transition"
            >
              <User className="h-4 w-4" />
              <span>Перейти до адмін панелі</span>
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Профком студентів ЛНУ імені Івана Франка. Всі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
