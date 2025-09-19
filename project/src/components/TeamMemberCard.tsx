import React from "react";

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
    <div
      className="bg-white rounded-lg shadow-md border transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col overflow-visible">
      {/* Фото або ініціали */}
      <div className="relative">
  {/* Контейнер із заокругленням і overflow */}
  <div className="aspect-[3/4] rounded-md overflow-hidden">
    {member.photo_url ? (
      <div className="w-full h-full p-4">
        <img
          src={member.photo_url}
          alt={member.name}
          className="w-full h-full object-cover rounded-md"
          loading="lazy"
        />
      </div>
    ) : (
      <div className="w-full h-full p-4">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center rounded-md">
          <span className="text-white text-xl font-semibold">
            {getInitials(member.name)}
          </span>
        </div>
      </div>
    )}
  </div>
</div>

      {/* Ім’я + посада */}
      <div className="flex flex-col items-center justify-center text-center text-white px-4 pb-4 w-full">
  <h3 className="text-2xl font-bold text-gray-900 w-full truncate">
    {member.name}
  </h3>
  <p className="mt-1 text-xl italic text-gray-600 w-full truncate">
    {member.position}
  </p>
</div>
    </div>
  );
};

export default TeamMemberCard;