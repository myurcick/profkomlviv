import React from 'react';
import { Edit, Trash2, Mail } from 'lucide-react';
import { FacultyUnion } from '../../types/faculty';

interface ProfTableProps {
  data: FacultyUnion[];
  loading: boolean;
  onEdit: (union: FacultyUnion) => void;
  onDelete: (id: number) => void;
}

const ProfTable: React.FC<ProfTableProps> = ({ data, loading, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
              Факультет
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
              Голова
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
              Email голови
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
              Локація
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
              Графік
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
              Посилання
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
              Статус
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">
              Дії
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-gray-900">
                Завантаження...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-gray-900">
                Профбюро поки не додані
              </td>
            </tr>
          ) : (
            data.map((union) => (
              <tr key={union.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {union.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {union.head ? (
                    <div className="flex items-center space-x-2">
                      <span>{union.head.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Не призначено</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {union.head?.email ? (
                    <a 
                      href={`mailto:${union.head.email}`}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-00"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{union.head.email}</span>
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {union.room ? `${union.room}, ${union.address || ''}` : union.address || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {union.schedule || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    {union.telegram_link && (
                      <a
                        href={union.telegram_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Telegram
                      </a>
                    )}
                    {union.instagram_link && (
                      <a
                        href={union.instagram_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:underline"
                      >
                        Instagram
                      </a>
                    )}
                    {!union.telegram_link && !union.instagram_link && '—'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      union.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {union.isActive ? 'Активне' : 'Неактивне'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(union)}
                      className="text-blue-600 hover:text-blue-900 p-1 transition-colors"
                      title="Редагувати"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(union.id)}
                      className="text-red-600 hover:text-red-900 p-1 transition-colors"
                      title="Видалити"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProfTable;