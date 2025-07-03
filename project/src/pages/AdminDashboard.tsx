import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  LogOut, 
  Eye, 
  Calendar,
  Users,
  FileText,
  Star,
  X,
  UserPlus,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  is_important: boolean;
}

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

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'news' | 'team' | 'faculties'>('news');
  const [news, setNews] = useState<News[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [facultyUnions, setFacultyUnions] = useState<FacultyUnion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [editingFacultyUnion, setEditingFacultyUnion] = useState<FacultyUnion | null>(null);
  
  const [newsFormData, setNewsFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    is_important: false
  });

  const [teamFormData, setTeamFormData] = useState({
    name: '',
    position: '',
    description: '',
    photo_url: '',
    email: '',
    phone: '',
    order_index: 0,
    is_active: true
  });

  const [facultyFormData, setFacultyFormData] = useState({
    faculty_name: '',
    union_head_name: '',
    union_head_photo: '',
    contact_email: '',
    contact_phone: '',
    office_location: '',
    working_hours: 'Пн-Пт: 9:00-17:00',
    description: '',
    website_url: '',
    order_index: 0,
    is_active: true
  });

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    await Promise.all([fetchNews(), fetchTeamMembers(), fetchFacultyUnions()]);
    setLoading(false);
  };

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchFacultyUnions = async () => {
    try {
      const { data, error } = await supabase
        .from('faculty_unions')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFacultyUnions(data || []);
    } catch (error) {
      console.error('Error fetching faculty unions:', error);
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update(newsFormData)
          .eq('id', editingNews.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('news')
          .insert([newsFormData]);
        
        if (error) throw error;
      }
      
      fetchNews();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTeamMember) {
        const { error } = await supabase
          .from('team_members')
          .update(teamFormData)
          .eq('id', editingTeamMember.id);
        
        if (error) throw error;
      } else {
        if (teamFormData.order_index === 0) {
          const maxOrder = Math.max(...teamMembers.map(m => m.order_index), 0);
          teamFormData.order_index = maxOrder + 1;
        }
        
        const { error } = await supabase
          .from('team_members')
          .insert([teamFormData]);
        
        if (error) throw error;
      }
      
      fetchTeamMembers();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingFacultyUnion) {
        const { error } = await supabase
          .from('faculty_unions')
          .update(facultyFormData)
          .eq('id', editingFacultyUnion.id);
        
        if (error) throw error;
      } else {
        if (facultyFormData.order_index === 0) {
          const maxOrder = Math.max(...facultyUnions.map(f => f.order_index), 0);
          facultyFormData.order_index = maxOrder + 1;
        }
        
        const { error } = await supabase
          .from('faculty_unions')
          .insert([facultyFormData]);
        
        if (error) throw error;
      }
      
      fetchFacultyUnions();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving faculty union:', error);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цю новину?')) {
      try {
        const { error } = await supabase
          .from('news')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        fetchNews();
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const handleDeleteTeamMember = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цього члена команди?')) {
      try {
        const { error } = await supabase
          .from('team_members')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        fetchTeamMembers();
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const handleDeleteFacultyUnion = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити це профбюро?')) {
      try {
        const { error } = await supabase
          .from('faculty_unions')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        fetchFacultyUnions();
      } catch (error) {
        console.error('Error deleting faculty union:', error);
      }
    }
  };

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem);
    setNewsFormData({
      title: newsItem.title,
      content: newsItem.content,
      image_url: newsItem.image_url || '',
      is_important: newsItem.is_important
    });
    setActiveTab('news');
    setShowAddModal(true);
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamFormData({
      name: member.name,
      position: member.position,
      description: member.description || '',
      photo_url: member.photo_url || '',
      email: member.email || '',
      phone: member.phone || '',
      order_index: member.order_index,
      is_active: member.is_active
    });
    setActiveTab('team');
    setShowAddModal(true);
  };

  const handleEditFacultyUnion = (union: FacultyUnion) => {
    setEditingFacultyUnion(union);
    setFacultyFormData({
      faculty_name: union.faculty_name,
      union_head_name: union.union_head_name,
      union_head_photo: union.union_head_photo || '',
      contact_email: union.contact_email || '',
      contact_phone: union.contact_phone || '',
      office_location: union.office_location || '',
      working_hours: union.working_hours || 'Пн-Пт: 9:00-17:00',
      description: union.description || '',
      website_url: union.website_url || '',
      order_index: union.order_index,
      is_active: union.is_active
    });
    setActiveTab('faculties');
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingNews(null);
    setEditingTeamMember(null);
    setEditingFacultyUnion(null);
    setNewsFormData({
      title: '',
      content: '',
      image_url: '',
      is_important: false
    });
    setTeamFormData({
      name: '',
      position: '',
      description: '',
      photo_url: '',
      email: '',
      phone: '',
      order_index: 0,
      is_active: true
    });
    setFacultyFormData({
      faculty_name: '',
      union_head_name: '',
      union_head_photo: '',
      contact_email: '',
      contact_phone: '',
      office_location: '',
      working_hours: 'Пн-Пт: 9:00-17:00',
      description: '',
      website_url: '',
      order_index: 0,
      is_active: true
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Адмін панель</h1>
              <p className="text-sm text-gray-600">Ласкаво просимо, {user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <Eye className="h-5 w-5" />
                <span>Переглянути сайт</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Вийти</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Всього новин</p>
                <p className="text-2xl font-semibold text-gray-900">{news.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Важливі новини</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {news.filter(n => n.is_important).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Членів команди</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {teamMembers.filter(m => m.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Профбюро факультетів</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {facultyUnions.filter(f => f.is_active).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('news')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'news'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-5 w-5 inline mr-2" />
                Управління новинами
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'team'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Управління командою
              </button>
              <button
                onClick={() => setActiveTab('faculties')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'faculties'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building className="h-5 w-5 inline mr-2" />
                Профбюро факультетів
              </button>
            </nav>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {activeTab === 'news' && 'Управління новинами'}
                {activeTab === 'team' && 'Управління командою'}
                {activeTab === 'faculties' && 'Управління профбюро факультетів'}
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {activeTab === 'news' && (
                  <>
                    <PlusCircle className="h-5 w-5" />
                    <span>Додати новину</span>
                  </>
                )}
                {activeTab === 'team' && (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Додати члена команди</span>
                  </>
                )}
                {activeTab === 'faculties' && (
                  <>
                    <Building className="h-5 w-5" />
                    <span>Додати профбюро</span>
                  </>
                )}
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'news' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Заголовок
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата створення
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дії
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          Завантаження...
                        </td>
                      </tr>
                    ) : news.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          Новин поки немає
                        </td>
                      </tr>
                    ) : (
                      news.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {item.is_important && (
                                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                              )}
                              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                {item.title}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.is_important 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {item.is_important ? 'Важлива' : 'Звичайна'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditNews(item)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNews(item.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ім'я
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Посада
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Порядок
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дії
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Завантаження...
                        </td>
                      </tr>
                    ) : teamMembers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Членів команди поки немає
                        </td>
                      </tr>
                    ) : (
                      teamMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {member.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{member.position}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{member.order_index}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              member.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {member.is_active ? 'Активний' : 'Неактивний'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditTeamMember(member)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTeamMember(member.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'faculties' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Факультет
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Голова профбюро
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Контакт
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дії
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Завантаження...
                        </td>
                      </tr>
                    ) : facultyUnions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Профбюро поки не додані
                        </td>
                      </tr>
                    ) : (
                      facultyUnions.map((union) => (
                        <tr key={union.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {union.faculty_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{union.union_head_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{union.contact_email || union.contact_phone || 'Не вказано'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              union.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {union.is_active ? 'Активне' : 'Неактивне'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditFacultyUnion(union)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFacultyUnion(union.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'news' && (editingNews ? 'Редагувати новину' : 'Додати новину')}
                {activeTab === 'team' && (editingTeamMember ? 'Редагувати члена команди' : 'Додати члена команди')}
                {activeTab === 'faculties' && (editingFacultyUnion ? 'Редагувати профбюро' : 'Додати профбюро')}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {activeTab === 'news' && (
              <form onSubmit={handleNewsSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    required
                    value={newsFormData.title}
                    onChange={(e) => setNewsFormData({ ...newsFormData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введіть заголовок новини"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Зображення URL (необов'язково)
                  </label>
                  <input
                    type="url"
                    value={newsFormData.image_url}
                    onChange={(e) => setNewsFormData({ ...newsFormData, image_url: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Контент
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={newsFormData.content}
                    onChange={(e) => setNewsFormData({ ...newsFormData, content: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введіть текст новини"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_important"
                    checked={newsFormData.is_important}
                    onChange={(e) => setNewsFormData({ ...newsFormData, is_important: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="is_important" className="ml-2 text-sm font-medium text-gray-700">
                    Важлива новина
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    {editingNews ? 'Зберегти зміни' : 'Створити новину'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'team' && (
              <form onSubmit={handleTeamSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ім'я та прізвище *
                    </label>
                    <input
                      type="text"
                      required
                      value={teamFormData.name}
                      onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Іван Петренко"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Посада *
                    </label>
                    <input
                      type="text"
                      required
                      value={teamFormData.position}
                      onChange={(e) => setTeamFormData({ ...teamFormData, position: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Голова профкому"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Фото URL (необов'язково)
                  </label>
                  <input
                    type="url"
                    value={teamFormData.photo_url}
                    onChange={(e) => setTeamFormData({ ...teamFormData, photo_url: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Опис/Біографія
                  </label>
                  <textarea
                    rows={4}
                    value={teamFormData.description}
                    onChange={(e) => setTeamFormData({ ...teamFormData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Короткий опис діяльності та досвіду"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={teamFormData.email}
                      onChange={(e) => setTeamFormData({ ...teamFormData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@lnu.edu.ua"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={teamFormData.phone}
                      onChange={(e) => setTeamFormData({ ...teamFormData, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+38 (067) 123-45-67"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Порядок відображення
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={teamFormData.order_index}
                      onChange={(e) => setTeamFormData({ ...teamFormData, order_index: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="is_active_member"
                      checked={teamFormData.is_active}
                      onChange={(e) => setTeamFormData({ ...teamFormData, is_active: e.target.checked })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="is_active_member" className="ml-2 text-sm font-medium text-gray-700">
                      Активний член команди
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    {editingTeamMember ? 'Зберегти зміни' : 'Додати члена команди'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'faculties' && (
              <form onSubmit={handleFacultySubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Назва факультету *
                    </label>
                    <input
                      type="text"
                      required
                      value={facultyFormData.faculty_name}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, faculty_name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Філологічний факультет"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Голова профбюро *
                    </label>
                    <input
                      type="text"
                      required
                      value={facultyFormData.union_head_name}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, union_head_name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Оксана Литвиненко"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Фото голови профбюро (необов'язково)
                  </label>
                  <input
                    type="url"
                    value={facultyFormData.union_head_photo}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, union_head_photo: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Опис діяльності
                  </label>
                  <textarea
                    rows={3}
                    value={facultyFormData.description}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Короткий опис діяльності профбюро факультету"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={facultyFormData.contact_email}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, contact_email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="profkom.faculty@lnu.edu.ua"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={facultyFormData.contact_phone}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, contact_phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+38 (032) 239-42-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Розташування офісу
                    </label>
                    <input
                      type="text"
                      value={facultyFormData.office_location}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, office_location: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Головний корпус, кімната 301"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Години роботи
                    </label>
                    <input
                      type="text"
                      value={facultyFormData.working_hours}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, working_hours: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Пн-Пт: 9:00-17:00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Сайт факультету
                    </label>
                    <input
                      type="url"
                      value={facultyFormData.website_url}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, website_url: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://faculty.lnu.edu.ua"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Порядок відображення
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={facultyFormData.order_index}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, order_index: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active_faculty"
                    checked={facultyFormData.is_active}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="is_active_faculty" className="ml-2 text-sm font-medium text-gray-700">
                    Активне профбюро
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    {editingFacultyUnion ? 'Зберегти зміни' : 'Додати профбюро'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;