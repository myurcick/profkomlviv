import React, { useState } from 'react';
import { Calendar, Star, X } from 'lucide-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
        <div className="relative">
          {news.image_url ? (
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Новина</span>
            </div>
          )}
          {news.is_important && (
            <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
              <Star className="h-4 w-4" />
            </div>
          )}
        </div>
        
        <div className="p-6" onClick={() => setIsModalOpen(true)}>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(news.created_at)}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
            {news.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3">
            {truncateContent(news.content, 120)}
          </p>
          
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-3 inline-flex items-center transition-colors duration-200">
            Читати далі →
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Новина</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {news.image_url && (
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(news.created_at)}
                {news.is_important && (
                  <div className="ml-4 flex items-center text-red-500">
                    <Star className="h-4 w-4 mr-1" />
                    Важливо
                  </div>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {news.title}
              </h1>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {news.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsCard;