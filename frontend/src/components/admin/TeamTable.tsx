import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { TeamMember, MemberType, MemberTypeDisplay } from '../../types/team';

interface TeamTableProps {
  data: TeamMember[];
  loading: boolean;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: number) => void;
}

// Мапа числа (з бекенду) на MemberType
const typeMap: Record<number, MemberType> = {
  0: "Aparat",
  1: "Profburo",
  2: "Viddil",
};

const TeamTable: React.FC<TeamTableProps> = ({ data, loading, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Ім'я</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Посада</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Тип</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Порядок</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Статус</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">Дії</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Завантаження...</td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Членів команди поки немає</td>
            </tr>
          ) : (
            data.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.position}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {MemberTypeDisplay[typeMap[Number(member.type)] ?? "Aparat"]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.orderInd}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {member.isActive ? 'Активний' : 'Неактивний'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => onEdit(member)} className="text-blue-600 hover:text-blue-900 p-1">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(member.id)} className="text-red-600 hover:text-red-900 p-1">
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

export default TeamTable;