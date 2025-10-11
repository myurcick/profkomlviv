import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { News, NewsFormData } from '../../types/news';

const ClassicEditor = ClassicEditorBuild as any;

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
                {`.ck-editor__editable_inline { min-height: 200px; }`}
            </style>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок *</label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Введіть заголовок новини"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Зображення</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {editingItem?.imageUrl && (
                    <p className="mt-2 text-sm text-gray-500">
                        Поточне:
                        <a href={`${import.meta.env.VITE_API_URL}${editingItem.imageUrl}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:underline">
                            переглянути
                        </a>
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Контент *</label>
                <CKEditor
                    editor={ClassicEditor}
                    data={formData.content}
                    onChange={(_, editor: any) => {
                        const data = editor.getData();
                        setFormData(prev => ({ ...prev, content: data }));
                    }}
                    config={{
                        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
                    }}
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isImportant"
                    checked={formData.isImportant}
                    onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="isImportant" className="ml-2 text-sm font-medium text-gray-700">Важлива новина</label>
            </div>

            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    Скасувати
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    {editingItem ? 'Зберегти зміни' : 'Створити новину'}
                </button>
            </div>
        </form>
    );
};

export default React.memo(NewsModal);