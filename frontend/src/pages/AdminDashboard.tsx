import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Eye, Users, FileText, Building, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios, { AxiosError } from 'axios';

import NewsManager from '../components/admin/NewsManager';
import { News } from '../types/news';

import TeamManager from '../components/admin/TeamManager';
import { TeamMember } from '../types/team';

import FacultyManager from '../components/admin/FacultyManager';
import { Faculty } from '../types/faculty';

import DepartmentManager from '../components/admin/DepartmentManager';

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
    const [facultyUnions, setFacultyUnions] = useState<Faculty[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/admin/login');
        } else {
            fetchAllData();
        }
    }, [user, navigate]);

    const fetchDataFor = async <T,>(endpoint: string, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/${endpoint}`);
            setter(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error(`Error fetching ${endpoint}:`, axiosError.response?.data || axiosError.message);
            setter([]);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/unit`);
            const mappedDepartments = Array.isArray(res.data)
                ? res.data.map((dep: any) => ({
                    id: dep.id || dep.Id,
                    name: dep.name || dep.Name,
                    content: dep.content || dep.Content || '',
                    imageUrl: dep.imageUrl || dep.ImageUrl || null,
                    orderInd: dep.orderInd || dep.OrderInd || 0,
                    isActive: typeof dep.isActive === 'boolean' ? dep.isActive : (typeof dep.is_active === 'boolean' ? dep.is_active : false),
                    createdAt: dep.createdAt || dep.CreatedAt,
                    updatedAt: dep.updatedAt || dep.UpdatedAt || null
                }))
                : [];
            setDepartments(mappedDepartments);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching departments:', axiosError.response?.data || axiosError.message);
            setDepartments([]);
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchDataFor<News>('news', setNews),
                fetchDataFor<TeamMember>('team', setTeamMembers),
                fetchDataFor<Faculty>('faculty', setFacultyUnions),
                fetchDepartments()
            ]);
        } catch (error) {
            console.error('Error fetching data:', (error as Error).message || error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    if (!user) return null;

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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-lg"><FileText className="h-6 w-6 text-blue-600" /></div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Всього новин</p>
                                <p className="text-2xl font-semibold text-gray-900">{news.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-lg"><Users className="h-6 w-6 text-green-600" /></div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Членів команди</p>
                                <p className="text-2xl font-semibold text-gray-900">{teamMembers.filter(m => m.isActive).length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-lg"><Building className="h-6 w-6 text-purple-600" /></div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Профбюро факультетів</p>
                                <p className="text-2xl font-semibold text-gray-900">{facultyUnions.filter(f => f.isActive).length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="bg-orange-100 p-3 rounded-lg"><Layers className="h-6 w-6 text-orange-600" /></div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Всього відділів</p>
                                <p className="text-2xl font-semibold text-gray-900">{departments.filter(d => d.isActive).length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs & Content */}
                <div className="bg-white rounded-lg shadow">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex flex-wrap">
                            <button onClick={() => setActiveTab('news')} className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'news' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <FileText className="h-5 w-5 inline mr-2" /> Управління новинами
                            </button>
                            <button onClick={() => setActiveTab('team')} className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'team' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <Users className="h-5 w-5 inline mr-2" /> Управління командою
                            </button>
                            <button onClick={() => setActiveTab('faculties')} className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'faculties' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <Building className="h-5 w-5 inline mr-2" /> Профбюро факультетів
                            </button>
                            <button onClick={() => setActiveTab('departments')} className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'departments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                <Layers className="h-5 w-5 inline mr-2" /> Управління відділами
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'news' && <NewsManager data={news} loading={loading} fetchData={() => fetchDataFor<News>('news', setNews)} />}
                        {activeTab === 'team' && <TeamManager data={teamMembers} loading={loading} fetchData={() => fetchDataFor<TeamMember>('team', setTeamMembers)} />}
                        {activeTab === 'faculties' && <FacultyManager data={facultyUnions} loading={loading} fetchData={() => fetchDataFor<Faculty>('faculties', setFacultyUnions)} />}
                        {activeTab === 'departments' && <DepartmentManager data={departments} loading={loading} fetchData={fetchDepartments} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;