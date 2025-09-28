import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import TeamTable from './TeamTable';
import TeamModal from './TeamModal';

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

interface TeamManagerProps {
  data: TeamMember[];
  loading: boolean;
  fetchData: () => Promise<void>;
}

const TeamManager: React.FC<TeamManagerProps> = ({ data, loading, fetchData }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    position: '',
    content: '',
    email: '',
    phone: '',
    orderInd: 0,
    isActive: true
  });

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
        formData.append('Image', selectedFile);
      } else {
        formData.append('ImageUrl', imageUrl);
      }
      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      if (editingTeamMember) {
        await axios.put(`http://localhost:5068/api/team/${editingTeamMember.id}`, formData, { headers });
      } else {
        if (teamFormData.orderInd === 0) {
          const maxOrder = Math.max(...data.map(m => m.orderInd), 0);
          formData.set('OrderInd', (maxOrder + 1).toString());
        }
        await axios.post('http://localhost:5068/api/team', formData, { headers });
      }
      await fetchData();
      handleCloseModal();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error saving team member:', axiosError.response?.data || axiosError.message);
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
        await fetchData();
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error deleting team member:', axiosError.response?.data || axiosError.message);
      }
    }
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
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingTeamMember(null);
    setSelectedFile(null);
    setTeamFormData({
      name: '',
      position: '',
      content: '',
      email: '',
      phone: '',
      orderInd: 0,
      isActive: true
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Управління командою</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <UserPlus className="h-5 w-5" />
          <span>Додати члена команди</span>
        </button>
      </div>

      <TeamTable
        data={data}
        loading={loading}
        onEdit={handleEditTeamMember}
        onDelete={handleDeleteTeamMember}
      />

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingTeamMember ? 'Редагувати члена команди' : 'Додати члена команди'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <TeamModal
              formData={teamFormData}
              setFormData={setTeamFormData}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              editingItem={editingTeamMember}
              onSubmit={handleTeamSubmit}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TeamManager;