import React from 'react';

interface TeamFormData {
  name: string;
  position: string;
  content: string;
  email: string;
  phone: string;
  orderInd: number;
  isActive: boolean;
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

interface TeamModalProps {
  formData: TeamFormData;
  setFormData: React.Dispatch<React.SetStateAction<TeamFormData>>;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  editingItem: TeamMember | null;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const TeamModal: React.FC<TeamModalProps> = ({
  formData,
  setFormData,
  selectedFile,
  setSelectedFile,
  editingItem,
  onSubmit,
  onClose
}) => {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ім'я та прізвище *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => {
              const lettersOnly = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ ЇїІіЄєҐґ\s]/g, '');
              setFormData({ ...formData, name: lettersOnly })
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
            value={formData.position}
            onChange={(e) => {
              const lettersOnly = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ ЇїІіЄєҐґ\s]/g, '');
              setFormData({ ...formData, position: lettersOnly })
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
        {editingItem && editingItem.imageUrl && (
          <p className="mt-2 text-sm text-gray-500">Поточне: {editingItem.imageUrl}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Опис/Біографія *
        </label>
        <textarea
          rows={4}
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            value={formData.phone}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9+()\-\s]/g, '');
              setFormData({ ...formData, phone: cleaned })
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
            value={formData.orderInd}
            onChange={(e) => setFormData({ ...formData, orderInd: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>

        <div className="flex items-center pt-6">
          <input
            type="checkbox"
            id="isActive_member"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
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
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Скасувати
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          {editingItem ? 'Зберегти зміни' : 'Додати члена команди'}
        </button>
      </div>
    </form>
  );
};

export default TeamModal;