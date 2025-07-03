import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Mail, Phone, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.description && member.description.toLowerCase().includes(searchTerm.toLowerCase()));
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Наша команда
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Познайомтеся з активними студентами, які працюють для захисту ваших прав та інтересів
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
                placeholder="Пошук по імені або посаді..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="text-sm text-gray-600">
              Знайдено: {filteredMembers.length} {filteredMembers.length === 1 ? 'член' : 'членів'} команди
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Членів команди не знайдено' : 'Команда поки не сформована'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Спробуйте змінити критерії пошуку' 
                  : 'Інформація про команду буде додана найближчим часом'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
                  {/* Photo Section */}
                  <div className="relative h-64 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback initials display */}
                    <div 
                      className={`absolute inset-0 flex items-center justify-center text-white ${
                        member.photo_url ? 'hidden' : 'flex'
                      }`}
                      style={{ display: member.photo_url ? 'none' : 'flex' }}
                    >
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">
                          {getInitials(member.name)}
                        </div>
                        <div className="text-sm opacity-90">
                          {member.name}
                        </div>
                      </div>
                    </div>
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    
                    <p className="text-blue-600 font-medium mb-4">
                      {member.position}
                    </p>
                    
                    {member.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {member.description}
                      </p>
                    )}
                    
                    {/* Contact Information */}
                    <div className="space-y-2">
                      {member.email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-2 text-blue-500" />
                          <a 
                            href={`mailto:${member.email}`}
                            className="hover:text-blue-600 transition-colors duration-200"
                          >
                            {member.email}
                          </a>
                        </div>
                      )}
                      
                      {member.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-2 text-blue-500" />
                          <a 
                            href={`tel:${member.phone}`}
                            className="hover:text-blue-600 transition-colors duration-200"
                          >
                            {member.phone}
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

      {/* Contact Section */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Хочете приєднатися до нашої команди?
          </h2>
          <p className="text-gray-600 mb-6">
            Ми завжди шукаємо активних студентів, готових працювати для покращення студентського життя
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Зв'язатися з нами
            </button>
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Дізнатися більше
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;