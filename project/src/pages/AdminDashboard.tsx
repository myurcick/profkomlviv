import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, LogOut, Eye, Users, FileText, Star, X, UserPlus, Building, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios, { AxiosError } from 'axios'; // Import AxiosError

interface News {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  isImportant: boolean;
  publishedAt: string;
}

interface TeamMember {
  id: number;
  name: string;
  position: string;
  content?: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  orderInd: number;
  isActive: boolean;
  createdAt: string;
}

interface FacultyUnion {
  id: number;
  name: string;
  head: string;
  imageUrl?: string;
  email?: string;
  address?: string;
  schedule?: string;
  summary?: string;
  facultyURL?: string;
  link?: string;
  orderInd: number;
  isActive: boolean;
}

interface Department {
  id: number;
  name: string;
  content?: string;
  imageUrl?: string;
  orderInd: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'news' | 'team' | 'faculties' | 'departments'>('news');
  const [news, setNews] = useState<News[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [facultyUnions, setFacultyUnions] = useState<FacultyUnion[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [editingFacultyUnion, setEditingFacultyUnion] = useState<FacultyUnion | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [newsFormData, setNewsFormData] = useState({
    title: '',
    content: '',
    isImportant: false
  });

  const [teamFormData, setTeamFormData] = useState({
    name: '',
    position: '',
    content: '',
    email: '',
    phone: '',
    orderInd: 0,
    isActive: true
  });

  const [facultyFormData, setFacultyFormData] = useState({
    name: '',
    head: '',
    email: '',
    address: '',
    schedule: 'Пн-Пт: 10:00-16:00',
    summary: '',
    facultyURL: '',
    link: '',
    orderInd: 0,
    isActive: true
  });

  const [departmentFormData, setDepartmentFormData] = useState({
    name: '',
    content: '',
    orderInd: 0,
    isActive: true
  });

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      await Promise.all([fetchNews(), fetchTeamMembers(), fetchFacultyUnions(), fetchDepartments()]);
    } catch (error) {
      console.error('Error fetching data:', (error as Error).message || error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await axios.get('http://localhost:5068/api/news');
      setNews(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching news:', axiosError.response?.data || axiosError.message);
      setNews([]);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const res = await axios.get('http://localhost:5068/api/team');
      setTeamMembers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching team members:', axiosError.response?.data || axiosError.message);
      setTeamMembers([]);
    }
  };

  const fetchFacultyUnions = async () => {
    try {
      const res = await axios.get('http://localhost:5068/api/prof');
      setFacultyUnions(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching faculty unions:', axiosError.response?.data || axiosError.message);
      setFacultyUnions([]);
    }
  };
const fetchDepartments = async () => {
  try {
    const res = await axios.get('http://localhost:5068/api/unit');
    console.log('Raw API response for departments:', JSON.stringify(res.data, null, 2));

    const mappedDepartments = Array.isArray(res.data)
      ? res.data.map((dep: any) => {
          console.log('Processing department:', JSON.stringify(dep, null, 2));
          
          return {
            id: dep.id || dep.Id,
            name: dep.name || dep.Name,
            content: dep.content || dep.Content || '',
            imageUrl: dep.imageUrl || dep.ImageUrl || null,
            orderInd: dep.orderInd || dep.OrderInd || 0,
            isActive: typeof dep.is_active === 'boolean' ? dep.is_active : false, // Map is_active to isActive
            createdAt: dep.createdAt || dep.CreatedAt,
            updatedAt: dep.updatedAt || dep.UpdatedAt || null
          };
        })
      : [];

    console.log('Mapped departments:', JSON.stringify(mappedDepartments, null, 2));
    setDepartments(mappedDepartments);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching departments:', axiosError.response?.data || axiosError.message);
    setDepartments([]);
  }
};

const handleNewsSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    let imageUrl = editingNews?.imageUrl || '';

    // Якщо є файл — спочатку заливаємо його
    if (selectedFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);

      const uploadRes = await axios.post('http://localhost:5068/api/uploads', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      imageUrl = uploadRes.data.path;
    }

    // Формуємо правильні ключі для бекенду (PascalCase)
    const formData = new FormData();

    if (editingNews) {
      formData.append('Id', editingNews.id.toString()); // 👈 важливо для PUT
    }

    formData.append('Title', newsFormData.title);
    formData.append('Content', newsFormData.content);
    formData.append('IsImportant', newsFormData.isImportant.toString());

    if (selectedFile) {
      formData.append('Image', selectedFile); // 👈 якщо файл
    } else {
      formData.append('ImageUrl', imageUrl); // 👈 якщо url
    }

    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    console.log('FormData payload:', Array.from(formData.entries())); // дебаг

    if (editingNews) {
      // PUT
      const response = await axios.put(
        `http://localhost:5068/api/news/${editingNews.id}`,
        formData,
        { headers }
      );
      console.log('PUT response:', response.data);
    } else {
      // POST
      const response = await axios.post(
        'http://localhost:5068/api/news',
        formData,
        { headers }
      );
      console.log('POST response:', response.data);
    }

    fetchNews();
    handleCloseModal();
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error saving news:', {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
      headers: axiosError.response?.headers,
    });
  }
};

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = editingTeamMember?.imageUrl || '';
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        const uploadRes = await axios.post('http://localhost:5068/api/uploads', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        imageUrl = uploadRes.data.path;
      }
      const formData = new FormData();
      formData.append('Name', teamFormData.name);
      formData.append('Position', teamFormData.position);
      formData.append('Content', teamFormData.content || '');
      formData.append('Email', teamFormData.email || '');
      formData.append('Phone', teamFormData.phone || '');
      formData.append('OrderInd', teamFormData.orderInd.toString());
      formData.append('IsActive', teamFormData.isActive.toString());
  
 if (selectedFile) {
      formData.append('Image', selectedFile); // 👈 якщо файл
    } else {
      formData.append('ImageUrl', imageUrl); // 👈 якщо url
    }
      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      if (editingTeamMember) {
        await axios.put(`http://localhost:5068/api/team/${editingTeamMember.id}`, formData, { headers });
      } else {
        if (teamFormData.orderInd === 0) {
          const maxOrder = Math.max(...teamMembers.map(m => m.orderInd), 0);
          formData.set('OrderInd', (maxOrder + 1).toString());
        }
        await axios.post('http://localhost:5068/api/team', formData, { headers });
      }
      fetchTeamMembers();
      handleCloseModal();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error saving team member:', axiosError.response?.data || axiosError.message);
    }
  };

  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = editingFacultyUnion?.imageUrl || '';
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        const uploadRes = await axios.post('http://localhost:5068/api/uploads', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        imageUrl = uploadRes.data.path;
      }
      const formData = new FormData();
      formData.append('Name', facultyFormData.name);
      formData.append('Head', facultyFormData.head);
      formData.append('Email', facultyFormData.email || '');
      formData.append('Address', facultyFormData.address || '');
      formData.append('Schedule', facultyFormData.schedule || '');
      formData.append('Summary', facultyFormData.summary || '');
      formData.append('FacultyURL', facultyFormData.facultyURL || '');
      formData.append('Link', facultyFormData.link || '');
      formData.append('OrderInd', facultyFormData.orderInd.toString());
      formData.append('IsActive', facultyFormData.isActive.toString());
  
 if (selectedFile) {
      formData.append('Image', selectedFile); // 👈 якщо файл
    } else {
      formData.append('ImageUrl', imageUrl); // 👈 якщо url
    }
      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      if (editingFacultyUnion) {
        await axios.put(`http://localhost:5068/api/prof/${editingFacultyUnion.id}`, formData, { headers });
      } else {
        if (facultyFormData.orderInd === 0) {
          const maxOrder = Math.max(...facultyUnions.map(f => f.orderInd), 0);
          formData.set('OrderInd', (maxOrder + 1).toString());
        }
        await axios.post('http://localhost:5068/api/prof', formData, { headers });
      }
      fetchFacultyUnions();
      handleCloseModal();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error saving faculty union:', axiosError.response?.data || axiosError.message);
    }
  };

  const handleDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = editingDepartment?.imageUrl || '';
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        const uploadRes = await axios.post('http://localhost:5068/api/uploads', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        imageUrl = uploadRes.data.path;
      }
      const formData = new FormData();
      formData.append('Name', departmentFormData.name);
      formData.append('Content', departmentFormData.content || '');
      formData.append('OrderInd', departmentFormData.orderInd.toString());
      formData.append('IsActive', departmentFormData.isActive.toString());
    if (selectedFile) {
      formData.append('Image', selectedFile); // 👈 якщо файл
    } else {
      formData.append('ImageUrl', imageUrl); // 👈 якщо url
    }

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      if (editingDepartment) {
        await axios.put(`http://localhost:5068/api/unit/${editingDepartment.id}`, formData, { headers });
      } else {
        if (departmentFormData.orderInd === 0) {
          const maxOrder = Math.max(...departments.map(d => d.orderInd), 0);
          formData.set('OrderInd', (maxOrder + 1).toString());
        }
        await axios.post('http://localhost:5068/api/unit', formData, { headers });
      }
      fetchDepartments();
      handleCloseModal();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error saving department:', axiosError.response?.data || axiosError.message);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цю новину?')) {
      try {
        await axios.delete(`http://localhost:5068/api/news/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchNews();
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error deleting news:', axiosError.response?.data || axiosError.message);
      }
    }
  };

  const handleDeleteTeamMember = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цього члена команди?')) {
      try {
        await axios.delete(`http://localhost:5068/api/team/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchTeamMembers();
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error deleting team member:', axiosError.response?.data || axiosError.message);
      }
    }
  };

  const handleDeleteFacultyUnion = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити це профбюро?')) {
      try {
        await axios.delete(`http://localhost:5068/api/prof/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchFacultyUnions();
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error deleting faculty union:', axiosError.response?.data || axiosError.message);
      }
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цей відділ?')) {
      try {
        await axios.delete(`http://localhost:5068/api/unit/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchDepartments();
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error deleting department:', axiosError.response?.data || axiosError.message);
      }
    }
  };

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem);
    setNewsFormData({
      title: newsItem.title,
      content: newsItem.content,
      isImportant: newsItem.isImportant
    });
    setActiveTab('news');
    setShowAddModal(true);
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamFormData({
      name: member.name,
      position: member.position,
      content: member.content || '',
      email: member.email || '',
      phone: member.phone || '',
      orderInd: member.orderInd,
      isActive: member.isActive
    });
    setActiveTab('team');
    setShowAddModal(true);
  };

  const handleEditFacultyUnion = (union: FacultyUnion) => {
    setEditingFacultyUnion(union);
    setFacultyFormData({
      name: union.name,
      head: union.head,
      email: union.email || '',
      address: union.address || '',
      schedule: union.schedule || 'Пн-Пт: 9:00-17:00',
      summary: union.summary || '',
      facultyURL: union.facultyURL || '',
      link: union.link || '',
      orderInd: union.orderInd,
      isActive: union.isActive
    });
    setActiveTab('faculties');
    setShowAddModal(true);
  };

  const handleEditDepartment = (dep: Department) => {
    setEditingDepartment(dep);
    setDepartmentFormData({
      name: dep.name,
      content: dep.content || '',
      orderInd: dep.orderInd,
      isActive: dep.isActive
    });
    setActiveTab('departments');
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingNews(null);
    setEditingTeamMember(null);
    setEditingFacultyUnion(null);
    setEditingDepartment(null);
    setSelectedFile(null);
    setNewsFormData({
      title: '',
      content: '',
      isImportant: false
    });
    setTeamFormData({
      name: '',
      position: '',
      content: '',
      email: '',
      phone: '',
      orderInd: 0,
      isActive: true
    });
    setFacultyFormData({
      name: '',
      head: '',
      email: '',
      address: '',
      schedule: 'Пн-Пт: 9:00-17:00',
      summary: '',
      facultyURL: '',
      link: '',
      orderInd: 0,
      isActive: true
    });
    setDepartmentFormData({
      name: '',
      content: '',
      orderInd: 0,
      isActive: true
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

  if (!user) { return null; }

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
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Членів команди</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {teamMembers.filter(m => m.isActive).length}
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
                  {facultyUnions.filter(f => f.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Layers className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Всього відділів</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {departments.filter(f => f.isActive).length}
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
              <button
                onClick={() => setActiveTab('departments')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'departments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Layers className="h-5 w-5 inline mr-2" />
                Управління відділами
              </button>
            </nav>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {activeTab === 'news' && 'Управління новинами'}
                {activeTab === 'team' && 'Управління командою'}
                {activeTab === 'faculties' && 'Управління профбюро факультетів'}
                {activeTab === 'departments' && 'Управління відділами'}
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
                {activeTab === 'departments' && (
                  <>
                    <Layers className="h-5 w-5" />
                    <span>Додати відділ</span>
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
                              {item.isImportant && (
                                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                              )}
                              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                {item.title}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.publishedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.isImportant 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {item.isImportant ? 'Важлива' : 'Звичайна'}
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
                            <div className="text-sm text-gray-500">{member.orderInd}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              member.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {member.isActive ? 'Активний' : 'Неактивний'}
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
                    ) : !Array.isArray(facultyUnions) || facultyUnions.length === 0 ? (
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
                              {union.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{union.head}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{union.email || 'Не вказано'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              union.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {union.isActive ? 'Активне' : 'Неактивне'}
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

            {activeTab === 'departments' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Назва</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Порядок</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Дії</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Завантаження...</td>
                      </tr>
                    ) : !Array.isArray(departments) || departments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Відділів поки немає</td>
                      </tr>
                    ) : (
                      departments.map(dep => (
                        <tr key={dep.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{dep.name}</td>
                          <td className="px-6 py-4">{dep.orderInd}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              dep.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {dep.isActive ? 'Активний' : 'Неактивний'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <button onClick={() => handleEditDepartment(dep)} className="text-blue-600 hover:text-blue-900 p-1">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDeleteDepartment(dep.id)} className="text-red-600 hover:text-red-900 p-1">
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
                {activeTab === 'departments' && (editingDepartment ? 'Редагувати відділ' : 'Додати відділ')}
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
                    Заголовок *
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
                    Зображення (необов’язково)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  {editingNews && editingNews.imageUrl && (
                    <p className="mt-2 text-sm text-gray-500">Поточне: {editingNews.imageUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Контент *
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
                    id="isImportant"
                    checked={newsFormData.isImportant}
                    onChange={(e) => setNewsFormData({ ...newsFormData, isImportant: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="isImportant" className="ml-2 text-sm font-medium text-gray-700">
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
                      onChange={(e) => {
                        const lettersOnly = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ\s]/g, '');
                        setTeamFormData({ ...teamFormData, name: lettersOnly })
                      }}
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
                      onChange={(e) => {
                        const lettersOnly = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ\s]/g, '');
                        setTeamFormData({ ...teamFormData, position: lettersOnly })
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Голова профкому"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Фото (необов’язково)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  {editingTeamMember && editingTeamMember.imageUrl && (
                    <p className="mt-2 text-sm text-gray-500">Поточне: {editingTeamMember.imageUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Опис/Біографія *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={teamFormData.content}
                    onChange={(e) => setTeamFormData({ ...teamFormData, content: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Короткий опис діяльності та досвіду"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={teamFormData.email}
                      onChange={(e) => setTeamFormData({ ...teamFormData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@lnu.edu.ua"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      required
                      value={teamFormData.phone}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^0-9+()\-\s]/g, '');
                        setTeamFormData({ ...teamFormData, phone: cleaned })
                      }}
                      pattern="\+38\d{10}"
                      maxLength={13}
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
                      value={teamFormData.orderInd}
                      onChange={(e) => setTeamFormData({ ...teamFormData, orderInd: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="isActive_member"
                      checked={teamFormData.isActive}
                      onChange={(e) => setTeamFormData({ ...teamFormData, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="isActive_member" className="ml-2 text-sm font-medium text-gray-700">
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
                      value={facultyFormData.name}
                      onChange={(e) => {
                        const lettersOnly = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ\s]/g, '');
                        setFacultyFormData({ ...facultyFormData, name: lettersOnly })
                      }}
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
                      value={facultyFormData.head}
                      onChange={(e) => {
                        const lettersOnly = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ\s]/g, '');
                        setFacultyFormData({ ...facultyFormData, head: lettersOnly })
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Оксана Литвиненко"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Фото голови профбюро (необов’язково)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  {editingFacultyUnion && editingFacultyUnion.imageUrl && (
                    <p className="mt-2 text-sm text-gray-500">Поточне: {editingFacultyUnion.imageUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Опис діяльності *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={facultyFormData.summary}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, summary: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Короткий опис діяльності профбюро факультету"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={facultyFormData.email}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="profkom.faculty@lnu.edu.ua"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Розташування офісу *
                    </label>
                    <input
                      type="text"
                      required
                      value={facultyFormData.address}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Головний корпус, кімната 301"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Години роботи *
                    </label>
                    <input
                      type="text"
                      value={facultyFormData.schedule}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, schedule: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Пн-Пт: 9:00-17:00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Сайт факультету
                    </label>
                    <input
                      type="url"
                      value={facultyFormData.facultyURL}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, facultyURL: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://faculty.lnu.edu.ua"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Соціальні посилання
                  </label>
                  <input
                    type="text"
                    value={facultyFormData.link}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, link: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://facebook.com/group"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Порядок відображення
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={facultyFormData.orderInd}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, orderInd: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive_faculty"
                    checked={facultyFormData.isActive}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive_faculty" className="ml-2 text-sm font-medium text-gray-700">
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

            {activeTab === 'departments' && (
              <form onSubmit={handleDepartmentSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Назва відділу *</label>
                  <input
                    type="text"
                    required
                    value={departmentFormData.name}
                    onChange={(e) => {
                      const lettersOnly = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ\s]/g, '');
                      setDepartmentFormData({ ...departmentFormData, name: lettersOnly })
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Відділ цифровізації"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Зображення (необов’язково)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  {editingDepartment && editingDepartment.imageUrl && (
                    <p className="mt-2 text-sm text-gray-500">Поточне: {editingDepartment.imageUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Опис діяльності *</label>
                  <textarea
                    rows={4}
                    required
                    value={departmentFormData.content}
                    onChange={(e) => setDepartmentFormData({ ...departmentFormData, content: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Короткий опис діяльності відділу"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Порядок</label>
                  <input
                    type="number"
                    min="0"
                    value={departmentFormData.orderInd}
                    onChange={(e) => setDepartmentFormData({ ...departmentFormData, orderInd: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={departmentFormData.isActive}
                    onChange={(e) => setDepartmentFormData({ ...departmentFormData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">Активний відділ</label>
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
                    {editingDepartment ? 'Зберегти зміни' : 'Додати відділ'}
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