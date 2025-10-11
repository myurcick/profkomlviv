import React from 'react';

interface DepartmentFormData {
  name: string;
  content: string;
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

interface DepartmentModalProps {
  formData: DepartmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<DepartmentFormData>>;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  editingItem: Department | null;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Назва відділу *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => {
            const lettersOnly = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ ЇїІіЄєҐґ\s]/g, '');
            setFormData({ ...formData, name: lettersOnly })
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
        {editingItem && editingItem.imageUrl && (
          <p className="mt-2 text-sm text-gray-500">Поточне: {editingItem.imageUrl}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Опис діяльності *</label>
        <textarea
          rows={4}
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Короткий опис діяльності відділу"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Порядок</label>
        <input
          type="number"
          min="0"
          value={formData.orderInd}
          onChange={(e) => setFormData({ ...formData, orderInd: parseInt(e.target.value) || 0 })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label className="ml-2 text-sm font-medium text-gray-700">Активний відділ</label>
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
          {editingItem ? 'Зберегти зміни' : 'Додати відділ'}
        </button>
      </div>
    </form>
  );
};

export default DepartmentModal;