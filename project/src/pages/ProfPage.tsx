import React, { useState, useEffect } from "react";
import { Search, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/InfoCard";
import { Modal } from "../components/InfoModal";

interface FacultyUnion {
  id: number;
  faculty_name: string;
  union_head_name: string;
  union_head_photo?: string;
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

const ProfPage: React.FC = () => {
  const [facultyUnions, setFacultyUnions] = useState<FacultyUnion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnion, setSelectedUnion] = useState<FacultyUnion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFacultyUnions();
  }, []);

  const fetchFacultyUnions = async () => {
    try {
      const { data, error } = await supabase
        .from("faculty_unions")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setFacultyUnions(data || []);
    } catch (error) {
      console.error("Error fetching faculty unions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUnions = facultyUnions.filter((union) => {
    const matchesSearch =
      union.faculty_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      union.union_head_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (union.description &&
        union.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getFacultyColor = (index: number) => {
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
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Профбюро факультетів
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Профспілкові організації всіх факультетів та коледжу ЛНУ імені Івана
            Франка
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Пошук по факультету або голові профбюро..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600">
            Знайдено: {filteredUnions.length} профбюро
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(20)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredUnions.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm
                  ? "Профбюро не знайдено"
                  : "Профбюро поки не додані"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Спробуйте змінити критерії пошуку"
                  : "Інформація про профбюро буде додана найближчим часом"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUnions.map((union, idx) => (
                <Card
                  key={union.id}
                  topText={union.faculty_name}
                  bottomText={union.union_head_name}
                  imageUrl={union.union_head_photo}
                  fallbackInitials={getInitials(union.union_head_name)}
                  index={idx}
                  getGradientColor={getFacultyColor}
                  onClick={() => {
                    setSelectedUnion(union);
                    setSelectedIndex(union.order_index ?? union.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <Modal
        item={
          selectedUnion
            ? {
                topText: selectedUnion.faculty_name,
                bottomText: selectedUnion.union_head_name,
                imageUrl: selectedUnion.union_head_photo,
                description: selectedUnion.description,
                office_location: selectedUnion.office_location,
                building_location: selectedUnion.building_location,
                contact_email: selectedUnion.contact_email,
                working_hours: selectedUnion.working_hours,
                website_url: selectedUnion.website_url,
                index: selectedIndex,
                post: "Голова профбюро",
              }
            : null
        }
        getInitials={getInitials}
        getGradientColor={getFacultyColor}
        isOpen={!!selectedUnion}
        onClose={() => setSelectedUnion(null)}
      />
    </div>
  );
};

export default ProfPage;