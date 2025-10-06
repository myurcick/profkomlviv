import React, { useEffect, useState } from "react";
import { Search, Users, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import axios from 'axios';
import Card from "../components/ProfCard";
import { FacultyUnion } from '../types/faculty';

const ProfPage: React.FC = () => {
  const [facultyUnions, setFacultyUnions] = useState<FacultyUnion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchFacultyUnions = async () => {
      try {
        const response = await axios.get<FacultyUnion[]>('http://localhost:5068/api/prof', {
          params: {
            isActive: true,
            orderBy: 'orderInd',
            order: 'asc',
          },
        });
        console.log('Faculty Unions:', response.data); // Логування для діагностики
        setFacultyUnions(response.data || []);
      } catch (err) {
        console.error("Помилка при отриманні профбюро:", err);
        if (axios.isAxiosError(err)) {
          console.error('Деталі помилки:', err.response?.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyUnions();
  }, []);

  const filteredUnions = facultyUnions.filter((union) => {
    const q = searchTerm.toLowerCase();
    return (
      union.name.toLowerCase().includes(q) ||
      union.head?.name.toLowerCase().includes(q) ||
      (union.summary && union.summary.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filteredUnions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUnions = filteredUnions.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;
    const maxVisibleButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // Left Buttons
    const leftButtons = (
      <div key="left" className="flex gap-1">
        {totalPages > 5 && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex justify-center items-center rounded-lg border border-gray-300 text-gray-700 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}
        {totalPages > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex justify-center items-center rounded-lg border border-gray-300 text-gray-700 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>
    );

    // Center Buttons
    const centerButtons = (
      <div key="center" className="flex gap-1">
        {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
          const page = startPage + idx;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 flex justify-center items-center rounded-lg border font-medium transition-colors duration-200 ${
                page === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>
    );

    // Right Buttons
    const rightButtons = (
      <div key="right" className="flex gap-1">
        {totalPages > 1 && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex justify-center items-center rounded-lg border border-gray-300 text-gray-700 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {totalPages > 5 && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex justify-center items-center rounded-lg border border-gray-300 text-gray-700 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        )}
      </div>
    );

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        {leftButtons}
        {centerButtons}
        {rightButtons}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... (Header and Search sections are the same) ... */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Профбюро факультетів
          </h1>
          <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto">
            Профспілкові організації всіх факультетів та коледжу ЛНУ імені Івана Франка
          </p>
        </div>
      </section>
      <section className="bg-white py-6 md:py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Пошук по факультету або голові профбюро..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Знайдено: {filteredUnions.length} профбюро
            </div>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                >
                  <div className="flex items-center h-36">
                    <div className="w-3 h-full bg-gray-300 flex-shrink-0" />
                    <div className="w-36 h-36 bg-gray-300 flex-shrink-0" />
                    <div className="flex-1 p-6">
                      <div className="h-6 bg-gray-300 rounded mb-2 w-3/4" />
                      <div className="h-4 bg-gray-300 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : currentUnions.length === 0 ? (
            <div className="text-center py-16">
              <Users className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm ? "Профбюро не знайдено" : "Профбюро поки не додані"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm
                  ? "Спробуйте змінити критерії пошуку або перевірте правильність написання"
                  : "Інформація про профбюро буде додана найближчим часом"}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 will-change: transform">
                {currentUnions.map((union, idx) => (
                  <Card key={union.id} union={union} index={idx} />
                ))}
              </div>
              {renderPaginationButtons()}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfPage;