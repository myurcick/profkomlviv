import React, { useState, useCallback } from 'react';
import { Building, X } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import FacultyTable from './FacultyTable';
import FacultyModal from './FacultyModal';
import { Faculty, FacultyFormData } from '../../types/faculty';

interface FacultyManagerProps {
    data: Faculty[];
    loading: boolean;
    fetchData: () => Promise<void>;
}

const FacultyManager: React.FC<FacultyManagerProps> = ({ data, loading, fetchData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Faculty | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const getInitialFormData = (): FacultyFormData => ({
        name: '',
        headId: null,
        address: '',
        room: '',
        schedule: 'Пн-Пт: 10:00-16:00',
        summary: '',
        telegram_link: '',
        instagram_link: '',
        isActive: true,
        imageUrl: '',
    });

    const [formData, setFormData] = useState<FacultyFormData>(getInitialFormData());

    const handleOpenAddModal = useCallback(() => {
        setEditingItem(null);
        setFormData(getInitialFormData());
        setIsModalOpen(true);
    }, []);

    const handleEdit = useCallback((faculty: Faculty) => {
        setEditingItem(faculty);
        setFormData({
            name: faculty.name,
            headId: faculty.headId,
            address: faculty.address || '',
            room: faculty.room || '',
            schedule: faculty.schedule || 'Пн-Пт: 10:00-16:00',
            summary: faculty.summary || '',
            telegram_link: faculty.telegram_link || '',
            instagram_link: faculty.instagram_link || '',
            isActive: faculty.isActive,
            imageUrl: faculty.imageUrl || '',
        });
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingItem(null);
        setSelectedFile(null);
        setFormData(getInitialFormData());
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.headId) {
            alert('Будь ласка, оберіть голову профбюро');
            return;
        }

        const dataToSend = new FormData();
        dataToSend.append('Name', formData.name);
        dataToSend.append('HeadId', formData.headId.toString());
        dataToSend.append('Address', formData.address || '');
        dataToSend.append('Room', formData.room || '');
        dataToSend.append('Schedule', formData.schedule || '');
        dataToSend.append('Summary', formData.summary || '');
        dataToSend.append('Telegram_Link', formData.telegram_link || ''); // ВИПРАВЛЕНО
        dataToSend.append('Instagram_Link', formData.instagram_link || ''); // ВИПРАВЛЕНО
        dataToSend.append('IsActive', formData.isActive.toString());

        if (selectedFile) {
            dataToSend.append('Image', selectedFile);
        } else if (editingItem?.imageUrl) {
            dataToSend.append('ImageUrl', editingItem.imageUrl);
        }

        const headers = {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };

        try {
            if (editingItem) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/faculties/${editingItem.id}`, dataToSend, { headers }); // ВИПРАВЛЕНО
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/faculties`, dataToSend, { headers }); // ВИПРАВЛЕНО
            }
            await fetchData();
            handleCloseModal();
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            console.error('Помилка збереження профбюро:', axiosError.response?.data || axiosError.message);
            const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.title || 'Помилка збереження. Спробуйте ще раз.';
            alert(errorMessage);
        }
    }, [formData, selectedFile, editingItem, fetchData, handleCloseModal]);

    const handleDelete = useCallback(async (id: number) => {
        const faculty = data.find(f => f.id === id);
        const confirmMessage = faculty?.head
            ? `Ви впевнені, що хочете видалити профбюро "${faculty.name}"?\n\nГолова ${faculty.head.name} стане доступним для призначення.`
            : `Ви впевнені, що хочете видалити профбюро "${faculty?.name}"?`;

        if (window.confirm(confirmMessage)) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/faculties/${id}`, { // ВИПРАВЛЕНО
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                await fetchData();
            } catch (error) {
                const axiosError = error as AxiosError<any>;
                console.error('Помилка видалення профбюро:', axiosError.response?.data || axiosError.message);
                alert('Не вдалося видалити профбюро. Спробуйте ще раз.');
            }
        }
    }, [data, fetchData]);

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">Управління профбюро факультетів</h2>
                    <p className="text-sm text-gray-500 mt-1">Всього профбюро: {data.length}</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    <Building className="h-5 w-5" />
                    <span>Додати профбюро</span>
                </button>
            </div>

            <FacultyTable
                data={data}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {editingItem ? 'Редагувати профбюро' : 'Додати профбюро'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700" title="Закрити">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <FacultyModal
                            formData={formData}
                            setFormData={setFormData}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                            editingItem={editingItem}
                            onSubmit={handleSubmit}
                            onClose={handleCloseModal}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default FacultyManager;