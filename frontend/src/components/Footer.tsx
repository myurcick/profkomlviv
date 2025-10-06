import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SiFacebook, SiInstagram, SiYoutube, SiTelegram, SiTiktok, SiLinktree } from 'react-icons/si';

const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/pposlnu', icon: SiFacebook, color: 'hover:bg-blue-600' },
    { name: 'Instagram', href: 'https://instagram.com/profkom_lnu', icon: SiInstagram, color: 'hover:bg-blue-600' },
    { name: 'YouTube', href: 'https://www.youtube.com/channel/UC-q4zCHeNdLGN9XV166LPkw', icon: SiYoutube, color: 'hover:bg-blue-600' },
    { name: 'Telegram', href: 'https://t.me/profkom_lnu', icon: SiTelegram, color: 'hover:bg-blue-600' },
    { name: 'TikTok', href: 'https://tiktok.com/@profkom_lnu', icon: SiTiktok, color: 'hover:bg-blue-600' },
    { name: 'Linktree', href: 'https://linktr.ee/profkom_lnu?fbclid=PAZXh0bgNhZW0CMTEAAae26D-DnoPLqxjtnCE6zvdowWD2_ASv2tcuDnfqkkuJtmJnKcLi-ecf_W-YTQ_aem_jBGPBwPhE8bONl0wqVDWdg', icon: SiLinktree, color: 'hover:bg-blue-600' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden">
      {/* Decorative background elements */}

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* About */}
            <div className="lg:col-span-1 flex">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex-1 flex flex-col justify-center transform transition-transform duration-500 ease-in-out
                hover:-translate-y-2 hover:shadow-lg">
                <h3 className="text-xl font-bold mb-6 text-blue-600">
                  Про організацію
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Профспілкова організація студентів ЛНУ імені Івана Франка працює з 1957 року. 
                  Ми захищаємо права та інтереси студентів, надаємо соціальну підтримку, 
                  організовуємо культурно-освітні заходи та сприяємо розвитку студентської спільноти.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1 flex">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex-1 flex flex-col justify-center transform transition-transform duration-500 ease-in-out
                hover:-translate-y-2 hover:shadow-lg">
                <h3 className="text-xl font-bold mb-6 text-blue-600">
                  Контактна інформація
                </h3>
                <div className="grid xs:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                  <div className="group">
                    <div className="flex items-start space-x-2">
                      <div className="bg-blue-600/20 p-2 rounded-lg group-hover:bg-blue-600/30 transition-colors">
                        <MapPin className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('вул. Університетська, 1, м. Львів')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 hover:text-blue-600 transition-colors block"
                        >
                          м. Львів<br />
                          вул. Університетська, 1
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-start space-x-2">
                      <div className="bg-orange-600/20 p-2 rounded-lg group-hover:bg-orange-600/30 transition-colors">
                        <Clock className="h-5 w-5 text-orange-400" />
                      </div>
                      <div className="text-gray-300">
                        <p>Пн-Пт: 10:00–16:00</p>
                        <p>Сб-Нд: вихідні</p>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-600/20 p-2 rounded-lg group-hover:bg-green-600/30 transition-colors">
                        <Phone className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <a 
                          href="tel:+380322394132" 
                          className="text-gray-300 hover:text-blue-600 transition-colors"
                        >
                          +380 32 239-41-32
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-center space-x-2">
                      <div className="bg-purple-600/20 p-2 rounded-lg group-hover:bg-purple-600/30 transition-colors">
                        <Mail className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <a 
                          href="mailto:profkom@lnu.edu.ua" 
                          className="text-gray-300 hover:text-blue-600 transition-colors"
                        >
                          profkom@lnu.edu.ua
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-t-2 border-white/10"></div>
          </div>
            
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 
            flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Текст (великий екран) */}
            <p className="hidden text-gray-300 text-sm text-center sm:text-left sm:block">
              © {new Date().getFullYear()} Профком студентів ЛНУ імені Івана Франка. Всі права захищені.
            </p>
            
            {/* Іконки */}
            <div className="flex gap-3 justify-center sm:justify-start">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-500 hover:scale-105 hover:border-white/20 ${social.color} flex items-center justify-center w-10 h-10`}
                  >
                    <IconComponent className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-200" />
                  </a>
                );
              })}
            </div>

            {/* Текст (малий екран) */}
            <p className="text-gray-300 text-sm text-center sm:hidden">
              © {new Date().getFullYear()} Профком студентів ЛНУ імені Івана Франка. Всі права захищені.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;