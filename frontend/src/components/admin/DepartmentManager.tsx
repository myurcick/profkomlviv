import React, { useState } from 'react';
import { Layers, X } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import DepartmentTable from './DepartmentTable';
import DepartmentModal from './DepartmentModal';

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

interface DepartmentManagerProps {
  data: Department[];
  loading: boolean;
  fetchData: () => Promise<void>;
}

const DepartmentManager: React.FC<DepartmentManagerProps> = ({ data, loading, fetchData }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [departmentFormData, setDepartmentFormData] = useState({
    name: '',
    content: '',
    orderInd: 0,
    isActive: true
  });

  const handleDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = editingDepartment?.imageUrl || '';
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/uploads`, uploadFormData, {
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
        formData.append('Image', selectedFile);
      } else {
        formData.append('ImageUrl', imageUrl);
      }

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      if (editingDepartment) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/unit/${editingDepartment.id}`, formData, { headers });
      } else {
        if (departmentFormData.orderInd === 0) {
          const maxOrder = Math.max(...data.map(d => d.orderInd), 0);
          formData.set('OrderInd', (maxOrder + 1).toString());
        }
        await axios.post(`${import.meta.env.VITE_API_URL}/api/unit`, formData, { headers });
      }
      await fetchData();
      handleCloseModal();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error saving department:', axiosError.response?.data || axiosError.message);
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цей відділ?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/unit/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        await fetchData();
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error deleting department:', axiosError.response?.data || axiosError.message);
      }
    }
  };

  const handleEditDepartment = (dep: Department) => {
    setEditingDepartment(dep);
    setDepartmentFormData({
      name: dep.name,
      content: dep.content || '',
      orderInd: dep.orderInd,
      isActive: dep.isActive
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingDepartment(null);
    setSelectedFile(null);
    setDepartmentFormData({
      name: '',
      content: '',
      orderInd: 0,
      isActive: true
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Управління відділами</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Layers className="h-5 w-5" />
          <span>Додати відділ</span>
        </button>
      </div>

      <DepartmentTable
        data={data}
        loading={loading}
        onEdit={handleEditDepartment}
        onDelete={handleDeleteDepartment}
      />

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingDepartment ? 'Редагувати відділ' : 'Додати відділ'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <DepartmentModal
              formData={departmentFormData}
              setFormData={setDepartmentFormData}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              editingItem={editingDepartment}
              onSubmit={handleDepartmentSubmit}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentManager;