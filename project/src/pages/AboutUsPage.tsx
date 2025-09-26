import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ArrowRight, Search } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import TeamMemberCard from "../components/TeamMemberCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  description?: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

interface Department {
  id: number;
  name: string;
  description?: string;
  icon_url?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FacultyUnion {
  id: number;
  faculty_name: string;
  union_head_name: string;
  union_head_photo?: string;
  faculty_logo?: string;
  contact_email?: string;
  office_location?: string;
  building_location?: string;
  working_hours?: string;
  description?: string;
  website_url?: string;
  social_links?: any;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

const TeamPage: React.FC = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [viewMode, setViewMode] = useState<"team" | "union">("team");
  const [unionMembers, setUnionMembers] = useState<any[]>([]);
  const swiperRef = useRef<any>(null);

  const teamSlides = useMemo(
    () => [
      { image: "/about_us/about-us-1.JPG" },
      { image:"/about_us/about-us-2.JPG" },
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
        const { data: membersData, error: membersError } = await supabase
          .from("team_members")
          .select("*")
          .eq("is_active", true)
          .order("order_index", { ascending: true });

        if (membersError) throw membersError;
        setTeamMembers(membersData || []);

        const { data: departmentsData, error: departmentsError } = await supabase
          .from("departments")
          .select("*")
          .eq("is_active", true)
          .order("order_index", { ascending: true });

        if (departmentsError) throw departmentsError;
        setDepartments(departmentsData || []);

        const { data: unionData, error: unionError } = await supabase
          .from("faculty_unions")
          .select("*")
          .eq("is_active", true)
          .order("order_index", { ascending: true });

        if (unionError) throw unionError;
        setUnionMembers(unionData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayMembers = useMemo(() => {
    if (viewMode === "team") {
      return teamMembers.filter(
        (m) =>
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (m.description &&
            m.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } else {
      return unionMembers
        .filter((u) =>
          u.union_head_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((u) => ({
          id: u.id,
          name: u.union_head_name,
          position: "Профспілковий організатор",
          description: u.faculty_name || u.description || "",
          photo_url: u.union_head_photo || null,
          email: u.contact_email || null,
          order_index: u.order_index || 0,
          is_active: true,
          created_at: u.created_at,
        }));
    }
  }, [viewMode, teamMembers, unionMembers, searchTerm]);

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
        (department.description &&
          department.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
              Познайомтеся зі студентами, які об’єдналися, щоб робити життя університетської спільноти яскравішим, справедливішим і насиченим новими можливостями.
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
              value={viewMode}
              onChange={(e) => {
                setViewMode(e.target.value as "team" | "union");
                if (swiperRef.current) {
                  swiperRef.current.slideTo(0, 0);
                }
              }}
              className="rounded-lg border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500"
            >
              <option value="team">Апарат Профкому</option>
              <option value="union">Профспілкові Організатори</option>
            </select>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Пошук учасника..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-sm text-gray-600">
              Знайдено: {displayMembers.length}{" "}
              {displayMembers.length === 1 ? "член" : "членів"} команди
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
                {searchTerm ? "Учасників не знайдено" : "Команда ще не сформована"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Спробуйте змінити критерії пошуку"
                  : "Інформація про команду буде додана найближчим часом"}
              </p>
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={3}
              loop
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