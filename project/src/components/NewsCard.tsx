import React from 'react';
import { Calendar, Star } from 'lucide-react';

interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  is_important: boolean;
}

interface NewsCardProps {
  news: News;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
  <div className="bg-white rounded-lg shadow-md border overflow-hidden cursor-pointer transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-lg flex flex-col">
  {/* Фото */}
  <div className="relative p-3">
    {news.image_url ? (
      <div className="aspect-[4/3] overflow-hidden rounded-md border">
        <img
          src={news.image_url}
          alt={news.title}
          className="w-full h-full object-cover"
        />
      </div>
    ) : (
      <div className="relative aspect-[4/3] overflow-hidden rounded-md w-full h-full object-cover bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
        <span className="text-white text-lg font-semibold">Новина</span>
      </div>
    )}
    {news.is_important && (
      <div className="absolute top-1 right-1 text-white bg-blue-600 p-2 rounded-full shadow-md">
        <Star className="h-3 w-3" fill="white"/>
      </div>
    )}
  </div>

  {/* Контент і кнопка */}
  <div className="p-6 flex flex-col flex-1 justify-between">
    {/* Текстова частина */}
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
        {news.title}
      </h3>

      <div className="flex items-center text-gray-500 text-sm mb-3">
        <Calendar className="h-4 w-4 mr-2" />
        {formatDate(news.created_at)}
      </div>

      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
        {news.content}
      </p>
    </div>

    {/* Кнопка завжди внизу */}
    <div className="flex justify-start mt-2">
      <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl font-medium text-sm inline-flex items-center transition-colors duration-200">
        Читати далі →
      </button>
    </div>
  </div>
  </div>
  );
};

export default NewsCard;