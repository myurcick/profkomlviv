import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';

const ClassicEditor = ClassicEditorBuild as any;

interface NewsFormData {
  title: string;
  content: string;
  isImportant: boolean;
}

interface News {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  isImportant: boolean;
  publishedAt: string;
}

interface NewsModalProps {
  formData: NewsFormData;
  setFormData: React.Dispatch<React.SetStateAction<NewsFormData>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  editingItem: News | null;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({
  formData,
  setFormData,
  setSelectedFile,
  editingItem,
  onSubmit,
  onClose
}) => {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-6">
      <style> 
        {`
          .ck-editor__editable_inline {
          min-height: 160px; /* відповідає rows={8} */}
        `}
      </style>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Заголовок *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Введіть заголовок новини"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Зображення (необов’язково)
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
          Контент *
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={formData.content}
          onChange={(_, editor: any) => {
            const data = editor.getData();
            setFormData({ ...formData, content: data });
          }}
          config={{
            toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'undo', 'redo']
          }}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isImportant"
          checked={formData.isImportant}
          onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="isImportant" className="ml-2 text-sm font-medium text-gray-700">
          Важлива новина
        </label>
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
          {editingItem ? 'Зберегти зміни' : 'Створити новину'}
        </button>
      </div>
    </form>
  );
};

export default NewsModal;