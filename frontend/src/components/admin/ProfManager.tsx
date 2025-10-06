import React, { useState } from 'react';
import { Building, X } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import ProfTable from './ProfTable';
import ProfModal from './ProfModal';
import { FacultyUnion } from '../../types/faculty';

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
    headId: null as number | null,
    address: '',
    room: '',
    schedule: 'Пн-Пт: 10:00-16:00',
    summary: '',
    telegram_link: '',
    instagram_link: '',
    isActive: true,
  });

  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!facultyFormData.headId) {
      alert('Будь ласка, оберіть голову профбюро');
      return;
    }

    try {
      const formData = new FormData();
      
      // Основні поля
      formData.append('Name', facultyFormData.name);
      formData.append('HeadId', facultyFormData.headId.toString());
      formData.append('Address', facultyFormData.address || '');
      formData.append('Room', facultyFormData.room || '');
      formData.append('Schedule', facultyFormData.schedule || '');
      formData.append('Summary', facultyFormData.summary || '');
      formData.append('Telegram_link', facultyFormData.telegram_link || '');
      formData.append('Instagram_link', facultyFormData.instagram_link || '');
      formData.append('IsActive', facultyFormData.isActive.toString());

      // Якщо є новий файл лого
      if (selectedFile) {
        formData.append('Image', selectedFile);
      } else if (editingFacultyUnion?.imageUrl) {
        formData.append('ImageUrl', editingFacultyUnion.imageUrl);
      }

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      if (editingFacultyUnion) {
        // Редагування існуючого профбюро
        await axios.put(
          `http://localhost:5068/api/prof/${editingFacultyUnion.id}`, 
          formData, 
          { headers }
        );
      } else {
        // Створення нового профбюро
        await axios.post(
          'http://localhost:5068/api/prof', 
          formData, 
          { headers }
        );
      }

      await fetchData();
      handleCloseModal();
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      console.error('Помилка збереження профбюро:', axiosError.response?.data || axiosError.message);
      
      // Показуємо повідомлення користувачу
      const errorMessage = axiosError.response?.data?.message || 
                          axiosError.response?.data?.title ||
                          'Помилка збереження. Спробуйте ще раз.';
      alert(errorMessage);
    }
  };

  const handleDeleteFacultyUnion = async (id: number) => {
    const union = data.find(u => u.id === id);
    const confirmMessage = union?.head 
      ? `Ви впевнені, що хочете видалити профбюро "${union.name}"?\n\nГолова ${union.head.name} стане доступним для призначення в інші профбюро.`
      : `Ви впевнені, що хочете видалити це профбюро?`;

    if (confirm(confirmMessage)) {
      try {
        await axios.delete(`http://localhost:5068/api/prof/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        await fetchData();
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        console.error('Помилка видалення профбюро:', axiosError.response?.data || axiosError.message);
        alert('Не вдалося видалити профбюро. Спробуйте ще раз.');
      }
    }
  };

  const handleEditFacultyUnion = (union: FacultyUnion) => {
    setEditingFacultyUnion(union);
    setFacultyFormData({
      name: union.name,
      headId: union.headId,
      address: union.address || '',
      room: union.room || '',
      schedule: union.schedule || 'Пн-Пт: 9:00-17:00',
      summary: union.summary || '',
      telegram_link: union.telegram_link || '',
      instagram_link: union.instagram_link || '',
      isActive: union.isActive,
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingFacultyUnion(null);
    setSelectedFile(null);
    setFacultyFormData({
      name: '',
      headId: null,
      address: '',
      room: '',
      schedule: 'Пн-Пт: 9:00-17:00',
      summary: '',
      telegram_link: '',
      instagram_link: '',
      isActive: true,
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Управління профбюро факультетів
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Всього профбюро: {data.length}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingFacultyUnion ? 'Редагувати профбюро' : 'Додати профбюро'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                title="Закрити"
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