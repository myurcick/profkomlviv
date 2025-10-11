import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ArrowRight, Search } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import TeamMemberCard from "../components/TeamMemberCard";
import { TeamMember, PROFBURO_HEAD_TYPE, VIDDIL_HEAD_TYPE, APARAT_TYPE } from "../types/team";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface Department {
  id: number;
  name: string;
  content?: string | null;
  imageUrl?: string | null;
  orderInd: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

const TeamPage: React.FC = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedType, setSelectedType] = useState<number>(APARAT_TYPE);
  const swiperRef = useRef<any>(null);

  const teamSlides = useMemo(
    () => [
      { image: "/about_us/about-us-1.JPG" },
      { image: "/about_us/about-us-2.JPG" },
      { image: "/about_us/about-us-3.JPG" },
      { image: "/about_us/about-us-4.jpg" },
      { image: "/about_us/about-us-5.jpg" },
      { image: "/about_us/about-us-6.jpg" }
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const membersResponse = await axios.get<TeamMember[]>(`${import.meta.env.VITE_API_URL}/api/team`);
        console.log('Team Members:', membersResponse.data);
        
        // Фільтруємо тільки активних і сортуємо по orderInd
        const activeMembers = membersResponse.data
          .filter(member => member.isActive)
          .sort((a, b) => a.orderInd - b.orderInd);
        
        setTeamMembers(activeMembers);

        const departmentsResponse = await axios.get<Department[]>(`${import.meta.env.VITE_API_URL}/api/unit`);
        console.log('Departments:', departmentsResponse.data);
        setDepartments(
          departmentsResponse.data
            .filter(dept => dept.is_active)
            .sort((a, b) => a.orderInd - b.orderInd)
        );
      } catch (error) {
        console.error("Помилка при отриманні даних:", error);
        if (axios.isAxiosError(error)) {
          console.error("Деталі помилки:", error.response?.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Фільтруємо членів команди по типу та пошуку
  const displayMembers = useMemo(() => {
    return teamMembers
      .filter(member => member.type === selectedType)
      .filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [teamMembers, selectedType, searchTerm]);

  // Назви типів для відображення
  const typeNames: Record<number, string> = {
    [APARAT_TYPE]: "Апарат Профкому",
    [PROFBURO_HEAD_TYPE]: "Голови Профбюро",
    [VIDDIL_HEAD_TYPE]: "Голови Відділів",
  };

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamSlides.length);
    }, 5000);
  }, [teamSlides.length]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const goNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamSlides.length);
    startAutoPlay();
  };

  const goPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + teamSlides.length) % teamSlides.length);
    startAutoPlay();
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  const filteredDepartments = useMemo(() => {
    return departments.filter(
      (department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (department.content &&
          department.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [departments, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Наша команда</h1>
            <p className="mx-auto max-w-3xl text-xl text-blue-200">
              Познайомтеся зі студентами, які об'єдналися, щоб робити життя університетської спільноти яскравішим, справедливішим і насиченим новими можливостями.
              Ми працюємо разом, щоб підтримувати, надихати та створювати простір, де кожен може реалізувати свої ідеї.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(Number(e.target.value));
                setSearchTerm("");
                if (swiperRef.current) {
                  swiperRef.current.slideTo(0, 0);
                }
              }}
              className="rounded-lg border border-gray-300 py-2 px-4 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={APARAT_TYPE}>Апарат Профкому</option>
              <option value={PROFBURO_HEAD_TYPE}>Голови Профбюро</option>
              <option value={VIDDIL_HEAD_TYPE}>Голови Відділів</option>
            </select>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Пошук членів команди`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-sm text-gray-600 whitespace-nowrap">
              Знайдено: <span className="font-semibold">{displayMembers.length}</span>{" "}
              {displayMembers.length === 0 ? "людей" : displayMembers.length === 1 ? "людину" : displayMembers.length < 5 ? "людини" : "людей"}
            </div>
          </div>
        </div>
      </section>

      {/* Team Swiper Section */}
      <section className="relative py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[450px] animate-pulse rounded-lg bg-white shadow-md"
                />
              ))}
            </div>
          ) : displayMembers.length === 0 ? (
            <div className="py-12 text-center">
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {searchTerm 
                  ? `Не знайдено результатів у категорії "${typeNames[selectedType]}"` 
                  : `Команда у категорії "${typeNames[selectedType]}" ще не сформована`
                }
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Спробуйте змінити критерії пошуку або оберіть іншу категорію"
                  : "Інформація буде додана найближчим часом"}
              </p>
            </div>
          ) : (
            <>
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={20}
                slidesPerView={3}
                loop={displayMembers.length > 3}
                speed={800}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                pagination={{ clickable: true }}
                className="team-swiper relative pb-12 pt-4"
                breakpoints={{
                  0: { slidesPerView: 1 },
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                wrapperClass="items-stretch overflow-visible"
              >
                {displayMembers.map((member) => (
                  <SwiperSlide key={member.id}>
                    <TeamMemberCard member={member} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )}
        </div>
      </section>

      {/* Team Carousel Section */}
      <section className="relative overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
        {teamSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/60 to-blue-700/50" />
          </div>
        ))}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Хочете приєднатися до нашої команди?
          </h2>
          <p className="mb-8 max-w-3xl text-lg text-blue-100 md:text-xl">
            Ми завжди шукаємо активних студентів, готових працювати для покращення
            студентського життя
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              className="flex transform items-center justify-center rounded-lg bg-yellow-500 px-8 py-3 font-semibold text-blue-900 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-yellow-600"
              onClick={() => window.open("https://forms.office.com/e/enQBJqB4SN")}
            >
              Подати заяву <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              className="transform rounded-lg border-2 border-white px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:text-blue-800"
              onClick={() => {
                navigate("/contacts");
              }}
            >
              Зв'язатися з нами
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 transform space-x-3">
          {teamSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "scale-125 bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
        <button
          onClick={goPrevSlide}
          className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 transform rounded-full p-2 text-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:text-white sm:flex"
        >
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={goNextSlide}
          className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 transform rounded-full p-2 text-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:text-white sm:flex"
        >
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </section>
    </div>
  );
};

export default TeamPage;