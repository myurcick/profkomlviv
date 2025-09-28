import React, { useState, useRef } from "react";
import { Mail, MapPin, Clock, User } from "lucide-react";

export interface FacultyUnion {
  id: number;
  name: string; // Змінено з faculty_name
  head: string; // Змінено з union_head_name
  imageUrl?: string | null; // Змінено з union_head_photo
  logoUrl?: string | null;
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

  return (
    <div
      className="bg-white rounded-xl transition-all duration-300 hover:-translate-y-2 shadow-sm hover:shadow-lg border border-gray-200 hover:border-blue-300 overflow-hidden"
      style={{
        transitionDelay: `${index * 40}ms`,
        animationDelay: `${index * 40}ms`,
      }}
    >
      {/* Top card - Clickable area */}
      <div
        className="flex items-center gap-4 md:gap-6"
        style={{ minHeight: "140px" }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Color line */}
        <div
          className={`w-3 bg-gradient-to-b ${getGradientColor(index)} flex-shrink-0`}
          style={{ minHeight: "140px" }}
        />

        {/* Photo */}
        <div className="relative flex-shrink-0 " style={{ width: "140px", height: "140px" }}>
          <div className="w-full h-full overflow-hidden">
            {union.logoUrl ? (
              <img
                src={union.logoUrl}
                alt={union.head}
                loading="lazy"
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
        <div className="flex-1 min-w-0 pr-4 md:pr-6 flex flex-col justify-center">
          <h3 className="font-bold text-lg md:text-xl text-[#1E2A5A] leading-tight">
            {union.name}
          </h3>
          {union.summary && (
            <p className={"text-[#1E2A5A] italic text-sm md:text-base leading-relaxed mt-1"}>
              {union.summary}
            </p>
          )}
        </div>
      </div>

      {/* Expanded card */}
      <div
        ref={contentRef}
        className={`overflow-hidden rounded-b-xl transition-all duration-700 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-100 bg-gray-50">
          <div className="text-[#1E2A5A] pt-4 md:pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm">Голова профбюро</p>
                  <p className="font-medium flex-shrink-0 italic">
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
                    <p className="text-sm">Електронна пошта</p>
                    <a
                      href={`mailto:${union.email}`}
                      className="font-medium hover:text-blue-600 transition-colors flex-shrink-0 italic"
                    >
                      {union.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {(union.adress || union.adress) && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm">Місцезнаходження</p>
                    <a
                      href={`http://maps.google.com/?q=${encodeURIComponent(union.adress || "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-blue-600 transition-colors italic"
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
                    <p className="text-sm">Години роботи</p>
                    <p className="font-medium italic">
                      {union.schedule}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;