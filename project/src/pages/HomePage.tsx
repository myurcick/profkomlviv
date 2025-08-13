/*import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Users, FileText, Phone, Star } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import { supabase } from '../lib/supabase';

interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  is_important: boolean;
}

const HomePage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Соціальна підтримка",
      description: "Матеріальна допомога студентам у складних життєвих ситуаціях"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Юридичні консультації",
      description: "Безкоштовні консультації з правових питань для студентів"
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Гаряча лінія",
      description: "Цілодобова підтримка студентів у критичних ситуаціях"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section /}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Профком студентів
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-blue-100">
              Львівський національний університет імені Івана Франка
            </p>
            <p className="text-lg md:text-xl mb-8 text-blue-200 max-w-2xl mx-auto">
              Захищаємо права студентів, надаємо підтримку та створюємо можливості для розвитку
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
                Подати заяву
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-800 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Дізнатися більше
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section /}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Наші послуги
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ми надаємо широкий спектр послуг для підтримки студентів під час навчання
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center p-8 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group">
                <div className="text-blue-600 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-200">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section /}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Останні новини
              </h2>
              <p className="text-lg text-gray-600">
                Будьте в курсі всіх важливих подій та оголошень
              </p>
            </div>
            <a
              href="/news"
              className="hidden sm:flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
            >
              Всі новини
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article) => (
                <NewsCard key={article.id} news={article} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <a
              href="/news"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
            >
              Всі новини
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Quick Links Section /}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Швидкі посилання
            </h2>
            <p className="text-lg text-blue-200">
              Найчастіше використовувані ресурси
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Заява на матеріальну допомогу",
              "Розклад прийому",
              "Документи",
              "Контакти"
            ].map((item, index) => (
              <div key={index} className="text-center">
                <button className="w-full bg-blue-800 hover:bg-blue-700 p-6 rounded-lg transition-colors duration-200 group">
                  <div className="text-yellow-400 mb-2 flex justify-center">
                    <Star className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;*/
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Users, FileText, Phone, Star } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import { supabase } from '../lib/supabase';

interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  is_important: boolean;
}

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Слайди для hero галереї
  const heroSlides: HeroSlide[] = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
      title: 'Профком студентів',
      subtitle: 'Львівський національний університет імені Івана Франка',
      description: 'Захищаємо права студентів, надаємо підтримку та створюємо можливості для розвитку'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      title: 'Соціальна підтримка',
      subtitle: 'Матеріальна допомога та стипендії',
      description: 'Надаємо фінансову підтримку студентам у складних життєвих ситуаціях'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
      title: 'Культурне життя',
      subtitle: 'Фестивалі та творчі заходи',
      description: 'Організовуємо яскраві культурно-освітні події для всіх студентів'
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      title: 'Освітні програми',
      subtitle: 'Додаткові можливості розвитку',
      description: 'Курси, тренінги та програми особистісного зростання'
    },
    {
      id: 5,
      image: 'https://images.pexels.com/photos/918281/pexels-photo-918281.jpeg',
      title: 'Спортивне життя',
      subtitle: 'Змагання та спортивні секції',
      description: 'Підтримуємо здоровий спосіб життя та спортивні досягнення'
    },
    {
      id: 6,
      image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
      title: 'Студентські гуртожитки',
      subtitle: 'Комфортні умови проживання',
      description: 'Забезпечуємо якісні умови проживання для студентів'
    }
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  // Автоматична зміна слайдів кожні 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const services = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Соціальна підтримка",
      description: "Матеріальна допомога студентам у складних життєвих ситуаціях"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Юридичні консультації",
      description: "Безкоштовні консультації з правових питань для студентів"
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Гаряча лінія",
      description: "Цілодобова підтримка студентів у критичних ситуаціях"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slideshow */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Images */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-700/60" />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            {/* Animated Content */}
            <div 
              key={currentSlide}
              className="animate-fade-in-up"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-blue-100 font-medium">
                {heroSlides[currentSlide].subtitle}
              </p>
              <p className="text-lg md:text-xl mb-8 text-blue-200 max-w-3xl mx-auto leading-relaxed">
                {heroSlides[currentSlide].description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center transform hover:scale-105 shadow-lg">
                Подати заяву
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-800 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 backdrop-blur-sm">
                Дізнатися більше
              </button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <div 
            className="h-full bg-yellow-500 transition-all duration-300 ease-linear"
            style={{ 
              width: `${((currentSlide + 1) / heroSlides.length) * 100}%` 
            }}
          />
        </div>

        {/* Slide Navigation Arrows */}
        <button
          onClick={() => goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white/70 hover:text-white transition-all duration-200 p-2 rounded-full hover:bg-white/10 backdrop-blur-sm"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => goToSlide((currentSlide + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white/70 hover:text-white transition-all duration-200 p-2 rounded-full hover:bg-white/10 backdrop-blur-sm"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Наші послуги
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ми надаємо широкий спектр послуг для підтримки студентів під час навчання
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center p-8 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group">
                <div className="text-blue-600 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-200">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Останні новини
              </h2>
              <p className="text-lg text-gray-600">
                Будьте в курсі всіх важливих подій та оголошень
              </p>
            </div>
            <a
              href="/news"
              className="hidden sm:flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
            >
              Всі новини
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article) => (
                <NewsCard key={article.id} news={article} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <a
              href="/news"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
            >
              Всі новини
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Швидкі посилання
            </h2>
            <p className="text-lg text-blue-200">
              Найчастіше використовувані ресурси
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Заява на матеріальну допомогу",
              "Розклад прийому",
              "Документи",
              "Контакти"
            ].map((item, index) => (
              <div key={index} className="text-center">
                <button className="w-full bg-blue-800 hover:bg-blue-700 p-6 rounded-lg transition-colors duration-200 group">
                  <div className="text-yellow-400 mb-2 flex justify-center">
                    <Star className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;