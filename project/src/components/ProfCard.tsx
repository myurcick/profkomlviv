import React, { useState, useRef, useLayoutEffect } from "react";
import { Mail, MapPin, Clock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FacultyUnion {
  id: number;
  name: string; // Змінено з faculty_name
  head: string; // Змінено з union_head_name
  imageUrl?: string | null; // Змінено з union_head_photo
  email?: string; // Змінено з contact_email
  adress?: string; // Змінено з office_location/building_location
  schedule?: string | null; // Змінено з working_hours
  summary?: string; // Змінено з description
  facultyURL?: string; // Змінено з website_url
  link?: string; // Змінено з social_links
  orderInd: number; // Змінено з order_index
  isActive: boolean; // Змінено з is_active
}

interface CardProps {
  union: FacultyUnion;
  index: number;
}

const Card: React.FC<CardProps> = ({ union, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState<number | "auto">(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGradientColor = (i: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-red-500 to-red-600",
      "from-yellow-500 to-yellow-600",
      "from-indigo-500 to-indigo-600",
      "from-pink-500 to-pink-600",
      "from-teal-500 to-teal-600",
    ];
    return colors[i % colors.length];
  };

  const toggle = () => {
    if (!isExpanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
    setIsExpanded((v) => !v);
  };

  useLayoutEffect(() => {
    if (isExpanded && contentRef.current) {
      const timeout = setTimeout(() => setHeight("auto"), 300);
      return () => clearTimeout(timeout);
    }
  }, [isExpanded]);

  return (
    <motion.div
      layout="size"
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
      style={{ minHeight: "140px" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={{
        y: -2,
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {/* Top card */}
      <div
        className="flex items-center cursor-pointer"
        style={{ height: "140px" }}
        onClick={toggle}
      >
        {/* Color line */}
        <div
          className={`w-3 bg-gradient-to-b ${getGradientColor(index)} flex-shrink-0`}
          style={{ minHeight: "140px" }}
        />

        {/* Photo */}
        <div className="relative flex-shrink-0" style={{ width: "140px", height: "140px" }}>
          <div className="w-full h-full bg-gray-100 overflow-hidden">
            {union.imageUrl && union.imageUrl !== "" ? (
              <img
                src={`http://localhost:5068${union.imageUrl}`} // Додано базовий URL
                alt={union.head}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${getGradientColor(
                  index
                )} flex items-center justify-center text-white font-bold text-2xl`}
              >
                {getInitials(union.head)}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="flex-1 min-w-0 p-4 md:p-6 flex flex-col justify-center">
          <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-2 leading-tight">
            {union.name}
          </h3>
          {union.summary && (
            <p
              className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3"
            >
              {union.summary}
            </p>
          )}
        </div>
      </div>

      {/* Expanded card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            ref={contentRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-100 bg-gray-50">
              <div className="pt-4 md:pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Голова профбюро</p>
                      <p className="font-medium text-gray-900 flex-shrink-0">
                        {union.head}
                      </p>
                    </div>
                  </div>

                  {union.email && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Електронна пошта</p>
                        <a
                          href={`mailto:${union.email}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors flex-shrink-0"
                        >
                          {union.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {union.adress && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Місцезнаходження</p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(union.adress)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {union.adress}
                        </a>
                      </div>
                    </div>
                  )}

                  {union.schedule && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Години роботи</p>
                        <p className="font-medium text-gray-900">
                          {union.schedule}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {union.facultyURL && (
                <div className="pt-4">
                  <a
                    href={union.facultyURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Вебсайт факультету
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Card;