import React from 'react';
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
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('вул. Університетська, 1, м. Львів')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  вул. Університетська, 1<br />
                  м. Львів, 79000
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <a href="tel:+380322394132" className="text-blue-400 hover:underline">
                  +38 (032) 239-41-32
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                  <a href={`mailto:${'profkom@lnu.edu.ua'}`} className="text-blue-400 hover:underline">
                    profkom@lnu.edu.ua
                  </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Режим роботи</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-400" />
                <div className="text-gray-300">
                  <p>Пн-Пт: 10:00 - 16:00</p>
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
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Профком студентів Університету імені Івана Франка. Всі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
