import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import NewsTable from './NewsTable';
import NewsModal from './NewsModal';

interface News {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  isImportant: boolean;
  publishedAt: string;
}

interface NewsManagerProps {
  data: News[];
  loading: boolean;
  fetchData: () => Promise<void>;
}

const NewsManager: React.FC<NewsManagerProps> = ({ data, loading, fetchData }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newsFormData, setNewsFormData] = useState({
    title: '',
    content: '',
    isImportant: false
  });

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = editingNews?.imageUrl || '';

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

      if (editingNews) {
        formData.append('Id', editingNews.id.toString());
      }

      formData.append('Title', newsFormData.title);
      formData.append('Content', newsFormData.content);
      formData.append('IsImportant', newsFormData.isImportant.toString());

      if (selectedFile) {
        formData.append('Image', selectedFile);
      } else {
        formData.append('ImageUrl', imageUrl);
      }

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      if (editingNews) {
        await axios.put(`http://localhost:5068/api/news/${editingNews.id}`, formData, { headers });
      } else {
        await axios.post('http://localhost:5068/api/news', formData, { headers });
      }

      await fetchData();
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

  const handleDeleteNews = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цю новину?')) {
      try {
        await axios.delete(`http://localhost:5068/api/news/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        await fetchData();
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error deleting news:', axiosError.response?.data || axiosError.message);
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
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingNews(null);
    setSelectedFile(null);
    setNewsFormData({
      title: '',
      content: '',
      isImportant: false
    });
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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Управління новинами</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Додати новину</span>
        </button>
      </div>

      <NewsTable
        data={data}
        loading={loading}
        onEdit={handleEditNews}
        onDelete={handleDeleteNews}
        formatDate={formatDate}
      />

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingNews ? 'Редагувати новину' : 'Додати новину'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <NewsModal
              formData={newsFormData}
              setFormData={setNewsFormData}
              setSelectedFile={setSelectedFile}
              editingItem={editingNews}
              onSubmit={handleNewsSubmit}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default NewsManager;