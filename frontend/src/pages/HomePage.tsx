import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Users, Building, HandCoins, CreditCard, TentTree } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import  axios  from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  publishedAt: string;
  isImportant: boolean;
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
  const [showBackground, setShowBackground] = useState(false);
  const navigate = useNavigate();

//hero section functions

    const heroSlides: HeroSlide[] = [
    {
      id: 1,
      image: "/home_page/university.JPG",
      title: 'Профком студентів',
      subtitle: 'Львівський національний університет імені Івана Франка',
      description: 'Захищаємо права студентів, надаємо підтримку та створюємо можливості для розвитку'
    },
    {
      id: 2,
      image: '/home_page/social.JPG',
      title: 'Соціальна підтримка',
      subtitle: 'Матеріальна допомога та стипендії',
      description: 'Надаємо фінансову підтримку студентам у складних життєвих ситуаціях'
    },
    {
      id: 3,
      image: '/home_page/entertainment.jpg',
      title: 'Культурне життя',
      subtitle: 'Фестивалі та творчі заходи',
      description: 'Організовуємо яскраві культурно-освітні події для всіх студентів'
    },
    {
      id: 4,
      image: '/home_page/education.JPG',
      title: 'Освітні програми',
      subtitle: 'Додаткові можливості розвитку',
      description: 'Курси, тренінги та програми особистісного зростання'
    },
    {
      id: 5,
      image: '/home_page/sport.png',
      title: 'Спортивне життя',
      subtitle: 'Змагання та спортивні секції',
      description: 'Підтримуємо здоровий спосіб життя та спортивні досягнення'
    },
    {
      id: 6,
      image: '/home_page/hostel.jpg',
      title: 'Студентські гуртожитки',
      subtitle: 'Комфортні умови проживання',
      description: 'Забезпечуємо якісні умови проживання для студентів'
    }
  ];

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  useEffect(() => {
    stopAutoPlay();
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => stopAutoPlay();
  }, [currentSlide]);

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
    let visibleCount = 0;
    cards.forEach((card, i) => {
      const cardElement = card as HTMLElement;
      if (cardElement.classList.contains('away')) {
        cardElement.style.transform = `translateY(-120vh) rotate(-48deg)`;
      } else {
        cardElement.style.transform = `rotate(${angle}deg)`;
        cardElement.style.zIndex = `${cards.length - i}`;
        angle -= 10;
        visibleCount++;
      }
    });

    if (visibleCount === 0) {
      setShowBackground(true);
    } else if (visibleCount === 1 && showBackground) {
      setTimeout(() => {
        setShowBackground(false);
      }, 500);
    }
  }, [scrollY]);

  // news functions

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news`);
      setNews(response.data.slice(0, 6)); // Обмежуємо до 6 новин
    } catch (error) {
      console.error('Помилка при отриманні новин:', error);
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
               style={{ 
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                maxWidth: '1920px', // обмеження максимальної ширини
                width: '100%',
                height: '100%',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/60 to-blue-700/50" />
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
          className="hidden mdl:flex absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white/70 hover:text-white transition-all duration-200 p-2 rounded-full hover:bg-white/10 backdrop-blur-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => goToSlide((currentSlide + 1) % heroSlides.length)}
          className="hidden mdl:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white/70 hover:text-white transition-all duration-200 p-2 rounded-full hover:bg-white/10 backdrop-blur-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Services Section */}
      <section className="hidden xl:block py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {/* Stacked Cards Section */}
            <div className="stack-area relative w-full bg-gray-50 flex" style={{ height: `calc(${services.length * 70}vh + 20vh)` }}>
              {/* Left side - Text content */}
              <div className="left sticky h-screen flex-1 flex items-center justify-center box-border" style={{ top: '64px' }}>
                <div className="max-w-lg">
                  <h2 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
                    Наші сервіси
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
              <div className="right sticky h-screen flex-1 flex items-center justify-end relative ml-20" style={{ top: '64px' }}>
                {showBackground && (
                  <img 
                    src="/under_cards.png" 
                    alt="background"
                    className="absolute left-1/2 -translate-x-1/2 w-80 h-80 pointer-events-none"
                  />
                )}

                {services.map((service, index) => (
                  <div
                    key={index}
                    className={`stack-card absolute w-80 h-80 rounded-3xl shadow-md transition-all duration-500 ease-in-out cursor-pointer bg-gradient-to-br ${service.color}`}
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
        </div>
      </section>

      {/* News Section */}
      {/* News Section */}
<section className="bg-gray-50 py-12 sm:py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Останні новини
        </h2>
        <p className="text-base sm:text-lg text-gray-600">
          Будьте в курсі всіх подій нашого університету
        </p>
      </div>

      <Link
        to="/news"
        className="hidden sm:inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
      >
        Всі новини
        <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
    </div>

    {/* Loader / News */}
    {loading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-40 bg-gray-200"></div>
            <div className="p-5">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        loop
        speed={700}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="pb-4"
      >
        {news.slice(0, 6).map((article, index) => (
          <SwiperSlide key={article.id}>
            <div
              className="cursor-pointer h-full"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => navigate(`/news/${article.id}`)}
            >
              <NewsCard news={article} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    )}

    {/* Mobile link */}
    <div className="text-center mt-6 sm:hidden">
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

      <style>{`
        /* News Cards Animation */
        .news-card-animated {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
          animation: newsCardSlideIn 0.6s ease-out forwards;
        }

        @keyframes newsCardSlideIn {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Enhanced hover effects for news cards */
        .news-card-animated:hover {
          transform: translateY(-5px) scale(1.02);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .news-card-animated:hover .news-card-shadow {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Staggered animation for news cards on scroll */
        @media (prefers-reduced-motion: no-preference) {
          .news-card-animated {
            animation-fill-mode: both;
          }
        }

        /* Loading animation improvements */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Smooth transitions for all interactive elements */
        .news-card-animated * {
          transition: all 0.2s ease-in-out;
        }
      `}</style>

    </div>
  );
};

export default HomePage;