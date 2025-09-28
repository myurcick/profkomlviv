import React, { useState } from 'react';
import { Building, X } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import ProfTable from './ProfTable';
import ProfModal from './ProfModal';

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

interface ProfManagerProps {
  data: FacultyUnion[];
  loading: boolean;
  fetchData: () => Promise<void>;
}

const ProfManager: React.FC<ProfManagerProps> = ({ data, loading, fetchData }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFacultyUnion, setEditingFacultyUnion] = useState<FacultyUnion | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
        formData.append('Image', selectedFile);
      } else {
        formData.append('ImageUrl', imageUrl);
      }
      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      if (editingFacultyUnion) {
        await axios.put(`http://localhost:5068/api/prof/${editingFacultyUnion.id}`, formData, { headers });
      } else {
        if (facultyFormData.orderInd === 0) {
          const maxOrder = Math.max(...data.map(f => f.orderInd), 0);
          formData.set('OrderInd', (maxOrder + 1).toString());
        }
        await axios.post('http://localhost:5068/api/prof', formData, { headers });
      }
      await fetchData();
      handleCloseModal();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error saving faculty union:', axiosError.response?.data || axiosError.message);
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
        await fetchData();
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error deleting faculty union:', axiosError.response?.data || axiosError.message);
      }
    }
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
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingFacultyUnion(null);
    setSelectedFile(null);
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
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Управління профбюро факультетів</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Building className="h-5 w-5" />
          <span>Додати профбюро</span>
        </button>
      </div>

      <ProfTable
        data={data}
        loading={loading}
        onEdit={handleEditFacultyUnion}
        onDelete={handleDeleteFacultyUnion}
      />

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingFacultyUnion ? 'Редагувати профбюро' : 'Додати профбюро'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <ProfModal
              formData={facultyFormData}
              setFormData={setFacultyFormData}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              editingItem={editingFacultyUnion}
              onSubmit={handleFacultySubmit}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfManager;