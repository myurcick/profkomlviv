import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star } from 'lucide-react';

interface News {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  publishedAt: string;
  isImportant: boolean;
}

interface NewsCardProps {
  news: News;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const imageSrc = news.imageUrl
    ? `${import.meta.env.VITE_API_URL}${news.imageUrl}`
    : undefined;

  return (
    <Link
      to={`/news/${news.id}`}
      className="group relative flex flex-col p-4 bg-white hover:bg-blue-50 rounded-xl transition-all duration-300 hover:-translate-y-2 shadow-sm hover:shadow-lg border border-gray-200 hover:border-blue-300"
    >
      {/* Image Section */}
      <div className="relative mb-3 aspect-[4/5] rounded-md overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={news.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">Новина</span>
          </div>
        )}
      </div>

      {/* Star Icon */}
      {news.isImportant && (
        <div className="absolute top-6 right-6 text-white bg-blue-600 p-1.5 rounded-full shadow-md">
          <Star className="h-3 w-3 fill-current" />
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col flex-1">
        <h3 className="text-xl font-semibold text-[#1E2A5A] group-hover:text-blue-600 mb-3 leading-tight min-h-[3rem] line-clamp-2">
          {news.title}
        </h3>
        <p className="text-[#1E2A5A] text-sm line-clamp-3 mb-4 leading-relaxed italic" dangerouslySetInnerHTML={{ __html: news.content }} />
        <div className="flex justify-between items-center mt-auto pt-2">
          <div className="flex items-center text-[#1E2A5A] text-sm font-semibold">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(news.publishedAt)}
          </div>
          <span className="text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Читати →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
