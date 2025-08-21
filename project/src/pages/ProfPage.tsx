import React, { useState, useEffect } from 'react';
import { Search, Users, Mail, Phone, MapPin, Clock, Globe, Building } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface FacultyUnion {
  id: number;
  faculty_name: string;
  union_head_name: string;
  union_head_photo?: string;
  contact_email?: string;
  contact_phone?: string;
  office_location?: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFacultyUnions();
  }, []);

  const fetchFacultyUnions = async () => {
    try {
      const { data, error } = await supabase
        .from('faculty_unions')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFacultyUnions(data || []);
    } catch (error) {
      console.error('Error fetching faculty unions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUnions = facultyUnions.filter(union => {
    const matchesSearch = union.faculty_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         union.union_head_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (union.description && union.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getFacultyColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Профбюро факультетів
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Профспілкові організації всіх факультетів та коледжу ЛНУ імені Івана Франка
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
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
              Знайдено: {filteredUnions.length} {filteredUnions.length === 1 ? 'профбюро' : 'профбюро'}
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Unions Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(20)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
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
                {searchTerm ? 'Профбюро не знайдено' : 'Профбюро поки не додані'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Спробуйте змінити критерії пошуку' 
                  : 'Інформація про профбюро буде додана найближчим часом'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUnions.map((union, index) => (
                <div key={union.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 group">
                  {/* Header with Faculty Name */}
                  <div className={`bg-gradient-to-r ${getFacultyColor(index)} p-4 text-white`}>
                    <div className="flex items-center space-x-2">
                      <Building className="h-5 w-5 flex-shrink-0" />
                      <h3 className="font-bold text-sm leading-tight">
                        {union.faculty_name}
                      </h3>
                    </div>
                  </div>

                  {/* Union Head Photo Section */}
                  <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    {union.union_head_photo ? (
                      <img
                        src={union.union_head_photo}
                        alt={union.union_head_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback initials display */}
                    <div 
                      className={`absolute inset-0 flex items-center justify-center text-gray-600 ${
                        union.union_head_photo ? 'hidden' : 'flex'
                      }`}
                      style={{ display: union.union_head_photo ? 'none' : 'flex' }}
                    >
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">
                          {getInitials(union.union_head_name)}
                        </div>
                        <div className="text-xs opacity-75 px-2 text-center">
                          {union.union_head_name}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        Голова профбюро:
                      </h4>
                      <p className="text-blue-600 font-medium text-sm">
                        {union.union_head_name}
                      </p>
                    </div>
                    
                    {union.description && (
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                        {union.description}
                      </p>
                    )}
                    
                    {/* Contact Information */}
                    <div className="space-y-2 text-xs">
                      {union.office_location && (
                        <div className="flex items-start text-gray-500">
                          <MapPin className="h-3 w-3 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                          <span className="leading-tight">{union.office_location}</span>
                        </div>
                      )}
                      
                      {union.working_hours && (
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-3 w-3 mr-2 text-blue-500 flex-shrink-0" />
                          <span>{union.working_hours}</span>
                        </div>
                      )}
                      
                      {union.contact_email && (
                        <div className="flex items-center text-gray-500">
                          <Mail className="h-3 w-3 mr-2 text-blue-500 flex-shrink-0" />
                          <a 
                            href={`mailto:${union.contact_email}`}
                            className="hover:text-blue-600 transition-colors duration-200 truncate"
                          >
                            {union.contact_email}
                          </a>
                        </div>
                      )}
                      
                      {union.contact_phone && (
                        <div className="flex items-center text-gray-500">
                          <Phone className="h-3 w-3 mr-2 text-blue-500 flex-shrink-0" />
                          <a 
                            href={`tel:${union.contact_phone}`}
                            className="hover:text-blue-600 transition-colors duration-200"
                          >
                            {union.contact_phone}
                          </a>
                        </div>
                      )}

                      {union.website_url && (
                        <div className="flex items-center text-gray-500">
                          <Globe className="h-3 w-3 mr-2 text-blue-500 flex-shrink-0" />
                          <a 
                            href={union.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors duration-200 truncate"
                          >
                            Сайт факультету
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Профспілкова мережа ЛНУ
            </h2>
            <p className="text-gray-600">
              Об'єднуємо студентів всіх факультетів для захисту їхніх прав та інтересів
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">19</div>
              <div className="text-gray-600">Факультетів</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">1</div>
              <div className="text-gray-600">Коледж</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">20</div>
              <div className="text-gray-600">Профбюро</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Потрібна допомога від профбюро вашого факультету?
          </h2>
          <p className="text-gray-600 mb-6">
            Зв'яжіться з представниками профбюро або з головним профкомом студентів, щоб отримати консультацію та підтримку.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
             onClick={() => { navigate('/contacts');}}>
              Зв'язатися з нами
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfPage;