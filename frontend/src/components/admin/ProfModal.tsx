import React, { useEffect, useState ,useRef } from 'react';
import axios from 'axios';
import { FacultyUnion, FacultyFormData } from '../../types/faculty';
import { TeamMember, PROFBURO_HEAD_TYPE } from '../../types/team';

interface ProfModalProps {
  formData: FacultyFormData;
  setFormData: React.Dispatch<React.SetStateAction<FacultyFormData>>;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  editingItem: FacultyUnion | null;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const ProfModal: React.FC<ProfModalProps> = ({
  formData,
  setFormData,
  selectedFile,
  setSelectedFile,
  editingItem,
  onSubmit,
  onClose
}) => {
  const [availableHeads, setAvailableHeads] = useState<TeamMember[]>([]);
  const [loadingHeads, setLoadingHeads] = useState(true);

  // Завантажуємо вільних голів при відкритті модалки
  useEffect(() => {
    fetchAvailableHeads();
  }, [editingItem]);

  const fetchAvailableHeads = async () => {
    try {
      setLoadingHeads(true);
      const response = await axios.get('http://localhost:5068/api/team', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const allMembers: TeamMember[] = response.data;
      
      // Фільтруємо: тільки голови профбюро (type = 1), які вільні або це поточний голова
      const freeHeads = allMembers.filter(member => 
        member.type === PROFBURO_HEAD_TYPE && 
        member.isActive && !member.isChoosed
      );

      if (editingItem?.headId) {
        const currentHead = allMembers.find(h => h.id === editingItem.headId);
        if (currentHead && !freeHeads.some(h => h.id === currentHead.id)) {
          freeHeads.push(currentHead);
        }
      }

      setAvailableHeads(freeHeads);
    } catch (error) {
      console.error('Помилка завантаження голів:', error);
      setAvailableHeads([]);
    } finally {
      setLoadingHeads(false);
    }
  };

  const selectedHead = availableHeads.find(h => h.id === formData.headId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={onSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Назва факультету *
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
            placeholder="Факультет електроніки та КТ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Голова профбюро *
          </label>
          {loadingHeads ? (
            <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500">
              Завантаження...
            </div>
          ) : availableHeads.length === 0 ? (
            <div className="w-full border border-red-300 rounded-lg px-3 py-2 bg-red-50 text-red-600">
              Немає вільних голів профбюро
            </div>
          ) : (
            <select
              required
              value={formData.headId || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                headId: e.target.value ? Number(e.target.value) : null 
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Оберіть голову</option>
                {availableHeads.map(head => (
                  <option key={head.id} value={head.id}>
                    {head.name}
                  </option>
                ))}
            </select>
          )}
          {selectedHead && selectedHead.email && (
            <p className="mt-1 text-xs text-gray-900">
              Email: {selectedHead.email}
            </p>
          )}
        </div>
      </div>

     <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Лого профбюро
      </label>
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          Обрати файл
        </button>
        <span className="text-sm text-gray-600">
          {selectedFile ? selectedFile.name : editingItem?.imageUrl ? "Файл вибрано" : "Файл не вибрано"}
        </span>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        className="hidden"
      />
    </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Опис діяльності *
        </label>
        <textarea
          rows={3}
          required
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Короткий опис діяльності профбюро факультету"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Адреса *
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="вул. Університетська, 1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Додаткова адреса
          </label>
          <input
            type="text"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="2 поверх, аудиторія 125"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Телеграм
          </label>
          <input
            type="url"
            value={formData.telegram_link}
            onChange={(e) => setFormData({ ...formData, telegram_link: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://t.me/electronics_lnu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Інстаграм
          </label>
          <input
            type="url"
            value={formData.instagram_link}
            onChange={(e) => setFormData({ ...formData, instagram_link: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://instagram.com/electronics_lnu"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Години роботи *
          </label>
          <input
            type="text"
            required
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Пн-Пт: 9:00-17:00"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive_faculty"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="isActive_faculty" className="ml-2 text-sm font-medium text-gray-700">
            Активне профбюро
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
          disabled={loadingHeads || availableHeads.length === 0}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {editingItem ? 'Зберегти зміни' : 'Додати профбюро'}
        </button>
      </div>
    </form>
  );
};

export default ProfModal;