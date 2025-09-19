import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ArrowRight, Search, Users, Mail, Phone, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectFade } from "swiper/modules";
import TeamMemberCard from "../components/TeamMemberCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-md overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

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

const TeamPage: React.FC = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const teamSlides = useMemo(
    () => [
      {
        image:
          "https://s.dou.ua/CACHE/images/img/static/gallery/0I8A78701x/1f755a4577590f80b616f7e43cf209c3.jpg",
      },
      {
        image:
          "https://nashazabota.com.ua/wp-content/uploads/2024/02/IMG_20230711_110626.jpg",
      },
      { image: "/images/about-us-3.jpg" },
      { image: "/images/about-us-4.jpg" },
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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [teamSlides.length]);

  const filteredMembers = useMemo(() => {
    return teamMembers.filter(
      (teamMember) =>
        teamMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teamMember.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teamMember.description &&
          teamMember.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [teamMembers, searchTerm]);

  const filteredDepartments = useMemo(() => {
    return departments.filter(
      (department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (department.description &&
          department.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [departments, searchTerm]);

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMemberClick = useCallback((teamMember: TeamMember) => {
    setSelectedMember(teamMember);
  }, []);

  const handleDepartmentClick = useCallback((department: Department) => {
    setSelectedDepartment(department);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Наша команда</h1>
            <p className="mx-auto max-w-3xl text-xl text-blue-200">
              Познайомтеся з активними студентами, які працюють для захисту ваших прав та
              інтересів
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 md:flex-row">
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
              Знайдено: {filteredMembers.length}{" "}
              {filteredMembers.length === 1 ? "член" : "членів"} команди
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
    ) : filteredMembers.length === 0 ? (
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
        pagination={{ clickable: true }}
        className="team-swiper relative pb-12"
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        wrapperClass="items-stretch overflow-visible"
      >
        {filteredMembers.map((teamMember) => (
          <SwiperSlide key={teamMember.id} className="h-full overflow-visible">
            <TeamMemberCard member={teamMember} />
          </SwiperSlide>
        ))}
      </Swiper>
    )}
  </div>
</section>

      {/* Team Carousel Section */}
      <section className="relative h-screen overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/50 to-blue-700/40" />
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
          onClick={() =>
            setCurrentSlide((currentSlide - 1 + teamSlides.length) % teamSlides.length)
          }
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
          onClick={() => setCurrentSlide((currentSlide + 1) % teamSlides.length)}
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

      {/* Services Section */}
      <section className="bg-white py-12 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
            Наші відділи
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Щоб працювати ефективніше, наша команда була поділена на спеціалізовані
            відділи
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-6 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Пошук відділу..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-sm text-gray-600">
              Знайдено: {filteredDepartments.length}{" "}
              {filteredDepartments.length === 1 ? "відділ" : "відділів"}
            </div>
          </div>
        </div>
      </section>

      {/* Departments Swiper Section */}
      <section className="relative py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[300px] animate-pulse overflow-hidden rounded-lg bg-white shadow-md"
                />
              ))}
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="py-12 text-center">
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {searchTerm ? "Відділів не знайдено" : "Відділи ще не додані"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Спробуйте змінити критерії пошуку"
                  : "Інформація з'явиться найближчим часом"}
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
              pagination={{ clickable: true }}
              className="departments-swiper relative pb-12"
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {filteredDepartments.map((department) => (
                <SwiperSlide key={department.id}>
                  <div
                    onClick={() => handleDepartmentClick(department)}
                    className="mx-auto flex h-[300px] max-w-sm cursor-pointer flex-col items-center overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="h-4/5 w-full overflow-hidden bg-gray-200">
                      {department.icon_url ? (
                        <img
                          src={department.icon_url}
                          alt={department.name}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-blue-500 text-4xl font-bold text-white">
                          {department.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex h-1/5 items-center justify-center p-4 text-center">
                      <h3 className="text-lg font-bold text-gray-900">{department.name}</h3>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <Modal isOpen={!!selectedDepartment} onClose={() => setSelectedDepartment(null)}>
          <div className="relative w-full overflow-hidden bg-gray-200">
            {selectedDepartment?.icon_url ? (
              <img
                src={selectedDepartment.icon_url}
                alt={selectedDepartment.name}
                className="h-auto max-h-64 w-full object-cover"
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center bg-blue-500 text-4xl font-bold text-white">
                {selectedDepartment && selectedDepartment.name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => setSelectedDepartment(null)}
              className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white/20 text-xl font-bold text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:text-blue-800"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-4 text-left overflow-y-auto">
            <h2 className="mb-2 text-2xl font-bold">{selectedDepartment?.name}</h2>
            {selectedDepartment?.description && (
              <p className="text-gray-700">{selectedDepartment.description}</p>
            )}
          </div>
        </Modal>
      </section>
    </div>
  );
};

export default TeamPage;