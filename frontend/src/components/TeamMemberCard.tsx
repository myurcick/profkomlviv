import React from "react";
import { TeamMember } from '../types/team';

interface TeamMemberCardProps {
  member: TeamMember;
}

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <div className="group flex flex-col overflow-visible bg-white hover:bg-blue-50 rounded-xl transition-all duration-300 hover:-translate-y-2 shadow-sm hover:shadow-lg border border-gray-200 hover:border-blue-300">
      {/* Фото або ініціали */}
      <div className="relative">
        {/* Контейнер із заокругленням */}
        <div className="aspect-[3/4] rounded-md overflow-hidden">
          {member.imageUrl ? (
            <div className="w-full h-full p-4">
              <img
                src={`${import.meta.env.VITE_API_URL}${member.imageUrl}`}
                alt={member.name}
                className="w-full h-full object-cover rounded-md"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-full h-full p-4">
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center rounded-lg">
                <span className="text-white text-xl font-semibold">
                  {getInitials(member.name)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col items-center justify-center text-center text-white px-4 pb-4 w-full">
        <h3 className="text-2xl font-bold text-[#1E2A5A] w-full truncate group-hover:text-blue-600">
          {member.name}
        </h3>
        <p className="mt-1 text-xl italic text-[#1E2A5A] w-full truncate">
          {member.position}
        </p>
      </div>
    </div>
  );
};

export default TeamMemberCard;