import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, Star } from 'lucide-react';
import DOMPurify from 'dompurify';
import NewsCard from '../components/NewsCard';
import axios from 'axios';

interface News {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  publishedAt: string; // Змінено з createdAt
  isImportant: boolean;
}

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const newsId = parseInt(id || '0');
  const [currentNews, setCurrentNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentNews();
    fetchRelatedNews();
  }, [newsId]);

  const fetchCurrentNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get<News>(`${import.meta.env.VITE_API_URL}/api/news/${newsId}`);
      console.log('Current News:', response.data); // Логування для діагностики
      setCurrentNews(response.data);
    } catch (error) {
      console.error('Помилка при отриманні поточної новини:', error);
      if (axios.isAxiosError(error)) {
        console.error('Деталі помилки:', error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async () => {
  try {
    const response = await axios.get<News[]>(`${import.meta.env.VITE_API_URL}/api/news`, {
      params: { excludeId: newsId },
    });
    const filteredNews = (response.data || []).filter(n => n.id !== newsId);
    setRelatedNews(filteredNews.slice(0, 3)); // беремо максимум 3 різні новини
  } catch (error) {
    console.error('Помилка при отриманні пов’язаних новин:', error);
  }
};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleShare = async () => {
    if (!currentNews) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentNews.title,
          text: currentNews.content.substring(0, 100) + "...",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Помилка при спробі поділитися:", err);
      }
    } else {
      navigator.clipboard.writeText(`${currentNews.title}\n\n${currentNews.content}`);
      alert("Новину скопійовано в буфер обміну!");
    }
  };

  const handleBackToNews = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm h-16 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="p-6 border-b bg-gray-50">
                  <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
                <div className="p-6">
                  <div className="aspect-[16/9] bg-gray-300 rounded-lg mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-6 w-1/2"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4">
                      <div className="aspect-[4/3] bg-gray-300 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentNews) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Новина не знайдена</h2>
          <p className="text-gray-600 mb-4">Можливо, новина була видалена або переміщена</p>
          <button
            onClick={handleBackToNews}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Повернутися до новин
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="shadow-sm h-16 flex items-center sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <button
            onClick={handleBackToNews}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Назад</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="border bg-white rounded-lg shadow-sm overflow-hidden transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-lg">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {currentNews.isImportant && (
                        <div className="bg-blue-600 text-white p-2 rounded-full shadow-md">
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      )}
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(currentNews.publishedAt)}
                      </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                      {currentNews.title}
                    </h1>
                  </div>
                  <button
                    onClick={handleShare}
                    className="ml-4 p-3 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 transform hover:scale-105"
                    title="Поділитися"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="px-6 pt-6">
                {currentNews.imageUrl ? (
                  <div className="rounded-lg aspect-[4/5] overflow-hidden shadow-md">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${currentNews.imageUrl}`}
                      alt={currentNews.title}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/5] bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                    <div className="text-center text-white">
                      <div className="text-8xl mb-4 opacity-90">📰</div>
                      <span className="text-2xl font-semibold opacity-90">Новина</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div
                  className="prose prose-lg max-w-none text-gray-700 news-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                    currentNews.content,
                    {ADD_ATTR: ['target', 'rel'],}
                    ).replace(
                      /<a /g,
                      '<a target="_blank" rel="noopener noreferrer" '
                    )
                  }}
                />
              </div>
            </article>
          </div>

          <div className="lg:col-span-1">
            <div className="border bg-white rounded-lg shadow-sm p-6 transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-lg">
              <div className="flex items-center mb-6">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Інші новини</h2>
              </div>
              <div className="space-y-4">
                {relatedNews.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
              {relatedNews.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Інші новини завантажуються...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;