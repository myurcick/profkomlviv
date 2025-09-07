import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Users, Building, HandCoins, CreditCard, TentTree } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

//hero section functions

    const heroSlides: HeroSlide[] = [
    {
      id: 1,
      image: 'https://lviv.travel/image/locations/ef/56/ef568b5e29ab5441bdb4db25428f531e91880ed7_1674562854.jpg?crop=2987%2C1607%2C4%2C72',
      title: 'Профком студентів',
      subtitle: 'Львівський національний університет імені Івана Франка',
      description: 'Захищаємо права студентів, надаємо підтримку та створюємо можливості для розвитку'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
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
      image: 'https://dw1.s81c.com/developer-static-pages/default/en/default_images/course.jpg',
      title: 'Освітні програми',
      subtitle: 'Додаткові можливості розвитку',
      description: 'Курси, тренінги та програми особистісного зростання'
    },
    {
      id: 5,
      image: 'https://www.fivb.com/wp-content/uploads/2025/04/101767.jpeg',
      title: 'Спортивне життя',
      subtitle: 'Змагання та спортивні секції',
      description: 'Підтримуємо здоровий спосіб життя та спортивні досягнення'
    },
    {
      id: 6,
      image: 'https://lnu.edu.ua/wp-content/uploads/2018/06/8.jpg',
      title: 'Студентські гуртожитки',
      subtitle: 'Комфортні умови проживання',
      description: 'Забезпечуємо якісні умови проживання для студентів'
    }
  ];

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  const startAutoPlay = () => {
    stopAutoPlay();
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startAutoPlay();
  };

 //service scrollbar functions

  const services = [
    {
      icon: <Building className="h-8 w-8" />,
      title: "Звільнення від оплати",
      subtitle: "Гуртожиток",
      description:
        "Профком студентів оформлює звільнення від оплати за проживання в гуртожитках для дітей-пільговиків",
      color: "from-blue-500 to-blue-700",
      url: "https://forms.office.com/e/enQBJqB4SN",
    },
    {
      icon: <HandCoins className="h-8 w-8" />,
      title: "Матеріальна допомога",
      subtitle: "Підтримка",
      description: "Надання матеріальної допомоги студентам у скрутних життєвих випадках",
      color: "from-pink-500 to-pink-700",
      url: "https://www.google.com/maps",
    },
    {
      icon: <TentTree className="h-8 w-8" />,
      title: "Відпочинок у таборі",
      subtitle: "Дозвілля",
      description: "Організований відпочинок у спортивно-оздоровчому таборі «Карпати» з активними іграми та спортивними заходами",
      color: "from-green-500 to-green-700",
      url: "https://forms.office.com/e/enQBJqB4SN",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Консультації та захист прав",
      subtitle: "Права",
      description:
        "Консультації щодо оформлення соціальних стипендій та захист прав студентів (звернення щодо корупції, харасменту та булінгу)",
      color: "from-red-500 to-red-700",
      url: "https://www.google.com/maps",
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Студентська смарт-картка",
      subtitle: "Леокарт",
      description: "Оформлення та виготовлення безконтактної смарт-картки для оплати у громадському транспорті Львова",
      color: "from-purple-500 to-purple-700",
      url: "https://forms.office.com/e/enQBJqB4SN",
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const stackArea = document.querySelector('.stack-area');
    const cards = document.querySelectorAll('.stack-card');
    
    if (!stackArea || !cards.length) return;

    // Adjust for header height (64px = h-16)
    const headerHeight = 64;
    const distance = window.innerHeight * 0.5;
    const topVal = stackArea.getBoundingClientRect().top - headerHeight;
    const index = Math.floor(-1 * (topVal / distance) - 1);

    cards.forEach((card, i) => {
      const cardElement = card as HTMLElement;
      if (i <= index) {
        cardElement.classList.add('away');
      } else {
        cardElement.classList.remove('away');
      }
    });

    let angle = 0;
    cards.forEach((card, i) => {
      const cardElement = card as HTMLElement;
      if (cardElement.classList.contains('away')) {
        cardElement.style.transform = `translateY(-120vh) rotate(-48deg)`;
      } else {
        cardElement.style.transform = `rotate(${angle}deg)`;
        cardElement.style.zIndex = `${cards.length - i}`;
        angle -= 10;
      }
    });
  }, [scrollY]);

  // news functions

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

  return (
    <div className="min-h-screen">

      {/* Hero Section with Slideshow */}
      <section className="relative overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-700/60" />
          </div>
        ))}

        {/* Slide Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div key={currentSlide} className="animate-fade-in-up">
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
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-800 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 backdrop-blur-sm"
                onClick={() => navigate('/about-us')}>
                Дізнатися більше
              </button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
          className="hidden sm:flex absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white/70 hover:text-white transition-all duration-200 p-2 rounded-full hover:bg-white/10 backdrop-blur-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => goToSlide((currentSlide + 1) % heroSlides.length)}
          className="hidden sm:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white/70 hover:text-white transition-all duration-200 p-2 rounded-full hover:bg-white/10 backdrop-blur-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="relative">
          {/* Stacked Cards Section - now takes full viewport minus header */}
            <div className="stack-area relative w-full bg-gray-50 flex" style={{ height: `calc(${services.length * 70}vh + 20vh)` }}>
              {/* Left side - Text content */}
                <div className="left sticky h-screen flex-1 flex items-center justify-center box-border px-8" style={{ top: '64px' }}>
                  <div className="max-w-lg">
                    <h2 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
                      Наші послуги
                    </h2>
                    <p className="text-gray-600 text-base mb-6">
                      Ми надаємо комплексну підтримку студентам у різних сферах життя. 
                      Від соціальної допомоги до правового захисту — завжди поруч з вами.
                    </p>
                    <div className="flex gap-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                        Дізнатися більше
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right side - Stacked cards */}
                <div className="right sticky h-screen flex-1 relative" style={{ top: '64px' }}>
                  {services.map((service, index) => (
                    <div
                      key={index}
                      className={`stack-card absolute w-80 h-80 rounded-3xl shadow-lg transition-all duration-500 ease-in-out cursor-pointer bg-gradient-to-br ${service.color}`}
                      style={{
                        top: 'calc(50% - 160px)',
                        left: 'calc(50% - 160px)',
                        transformOrigin: 'bottom left'
                      }}
                      onClick={() => window.open(service.url, "_blank")}
                    >
                      <div className="p-8 h-full flex flex-col justify-between text-white">
                        <div className="flex items-center mb-4">
                          {service.icon}
                          <span className="ml-3 text-lg font-semibold opacity-90">
                            {service.subtitle}
                          </span>
                        </div>
                      <div>
                        <h3 className="text-3xl font-bold leading-tight mb-4">
                          {service.title}
                        </h3>
                        <p className="text-sm opacity-90 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <style>{`
              .stack-card.away {
                transform-origin: bottom left;
              }
        
              .stack-card {
                transition: transform 0.5s ease-in-out;
              }
        
              /* Ensure smooth scrolling from the start */
              html {
                scroll-behavior: smooth;
              }
        
              /* Prevent initial jump by properly positioning sticky elements */
              .stack-area {
                margin-top: -64px;
                padding-top: 64px;
              }
            `}</style>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12 transform transition-transform duration-500 ease-in-out
                hover:-translate-y-2 hover:shadow-lg">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Останні новини
              </h2>
              <p className="text-lg text-gray-600">
                Будьте в курсі всіх новин нашого університету
              </p>
            </div>
            <Link
              to="/news"
              className="hidden sm:flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
            >
              Всі новини
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
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
              {news.slice(0, 3).map((article) => (
                <NewsCard key={article.id} news={article} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/news"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
            >
              Всі новини
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Section 
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
            {links.map((item, index) => (
              <div key={index} className="flex">
                <button
                  className="w-full bg-blue-800 hover:bg-blue-700 p-6 rounded-lg transition-colors duration-200 group flex flex-col items-center"
                    onClick={() => { navigate(item.path) }}>
                    <div className="flex items-center justify-center h-8">
                      <Star className="h-6 w-6 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span className="text-sm font-medium text-center mt-2 leading-tight">
                      {item.label}
                    </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

    </div>
  );
};

export default HomePage;