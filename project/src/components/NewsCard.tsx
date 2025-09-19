import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  onClick?: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate(`/news/${news.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md border overflow-hidden cursor-pointer transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Image Section */}
      <div className="relative">
        {news.image_url ? (
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="relative aspect-[4/3] bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">Новина</span>
          </div>
        )}

        {news.is_important && (
          <div className="absolute top-2 right-2 text-white bg-blue-600 p-2 rounded-full shadow-md">
            <Star className="h-3 w-3" fill="white" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight min-h-[3rem]">
          {news.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {news.content}
        </p>

        <div className="flex justify-between items-center mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl font-medium text-sm transition-colors duration-200"
          >
            Читати далі →
          </button>

          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(news.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;