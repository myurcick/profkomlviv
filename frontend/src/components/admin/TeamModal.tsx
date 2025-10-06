import React, { useEffect } from 'react';
import { TeamMember, TeamFormData } from '../../types/team';

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
  setSelectedFile,
  editingItem,
  onSubmit,
  onClose
}) => {
  // Автоматично встановлюємо посаду для Голови Профбюро та Відділу
  useEffect(() => {
    if (formData.type === 1) {
      // Профбюро
      setFormData(prev => ({ ...prev, position: 'Голова Профбюро' }));
    } else if (formData.type === 2) {
      // Відділ
      setFormData(prev => ({ ...prev, position: 'Голова Відділу' }));
    }
    // Для Апарату (type === 0) нічого не робимо - користувач вводить сам
  }, [formData.type]);

  const showPositionInput = formData.type === 0; // Показуємо тільки для Апарату

  return (
    <form onSubmit={onSubmit} className="p-6 space-y-6">
      {/* Ім'я */}
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
            setFormData({ ...formData, name: lettersOnly });
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Іван Франко"
        />
      </div>

      {/* Тип члена команди */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Тип члена команди *
        </label>
        <select
          required
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={0}>Член Апарату Профкому</option>
          <option value={1}>Голова Профбюро</option>
          <option value={2}>Голова Відділу</option>
        </select>
      </div>

      {/* Посада - показуємо тільки для Апарату */}
      {showPositionInput ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Посада *
          </label>
          <input
            type="text"
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="Голова профкому"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Посада:</span> {formData.position}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Посада встановлюється автоматично для обраного типу
          </p>
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ivanfranko@lnu.edu.ua"
        />
      </div>

      {/* Фото */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Фото
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        {editingItem && editingItem.imageUrl && (
          <p className="mt-2 text-sm text-gray-500">
            Поточне: <a href={editingItem.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">переглянути</a>
          </p>
        )}
      </div>

      {/* Порядок відображення та Активність */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Порядок відображення
          </label>
          <input
            type="number"
            min={0}
            value={formData.orderInd}
            onChange={(e) => setFormData({ ...formData, orderInd: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
          <p className="mt-1 text-xs text-gray-500">
            Індекс для сортування в межах типу
          </p>
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

      {/* Кнопки */}
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