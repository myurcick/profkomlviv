import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Star, Share2, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Типи даних
interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  is_important: boolean;
}

// Компонент картки новини для сайдбару
const RelatedNewsCard: React.FC<{ news: News; onClick: () => void; index: number; animate: boolean }> = ({ 
  news, 
  onClick, 
  index, 
  animate 
}) => {
  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer bg-white hover:bg-blue-50 rounded-xl p-4 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg border border-gray-200 hover:border-blue-300 ${
        animate 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        transitionDelay: animate ? `${index * 150}ms` : '0ms' 
      }}
    >
      {/* Image Section */}
      <div className="relative mb-3">
        {news.image_url ? (
          <div className="aspect-[4/3] rounded-lg overflow-hidden">
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-semibold">Новина</span>
          </div>
        )}

        {news.is_important && (
          <div className="absolute top-2 right-2 text-white bg-blue-600 p-1.5 rounded-full shadow-md">
            <Star className="h-3 w-3 fill-current" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 mb-2 min-h-[2.5rem]">
          {news.title}
        </h3>

        <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
          {news.content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDateShort(news.created_at)}
          </div>

          <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Читати →
          </span>
        </div>
      </div>
    </div>
  );
};

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const newsId = parseInt(id || '0');
  const [currentNews, setCurrentNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateRelated, setAnimateRelated] = useState(false);

  useEffect(() => {
    fetchCurrentNews();
    fetchRelatedNews();
  }, [newsId]);

  const fetchCurrentNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', newsId)
        .single();

      if (error) throw error;
      setCurrentNews(data as News);
    } catch (error) {
      console.error('Error fetching current news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .neq('id', newsId)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setRelatedNews((data as News[]) || []);
      
      setTimeout(() => setAnimateRelated(true), 300);
    } catch (error) {
      console.error('Error fetching related news:', error);
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
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(`${currentNews.title}\n\n${currentNews.content}`);
      alert("Новину скопійовано в буфер обміну!");
    }
  };

  const handleBackToNews = () => {
    navigate(-1);
  };

  const handleRelatedNewsClick = (news: News) => {
    navigate(`/news/${news.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <header className="bg-white shadow-sm h-16 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Skeleton */}
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

            {/* Sidebar Skeleton */}
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
      {/* Header */}
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
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-lg">
              {/* Article Header */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {currentNews.is_important && (
                        <div className="bg-blue-600 text-white p-2 rounded-full shadow-md">
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      )}
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(currentNews.created_at)}
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

              {/* Article Image */}
              <div className="px-6 pt-6">
                {currentNews.image_url ? (
                  <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-md">
                    <img
                      src={currentNews.image_url}
                      alt={currentNews.title}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                    <div className="text-center text-white">
                      <div className="text-8xl mb-4 opacity-90">📰</div>
                      <span className="text-2xl font-semibold opacity-90">Новина</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="p-6">
                <div className="prose prose-lg max-w-none text-gray-700">
                  {currentNews.content.split("\n").map((paragraph, index) =>
                    paragraph.trim() ? (
                      <p key={index} className="mb-6 text-lg leading-relaxed">
                        {paragraph}
                      </p>
                    ) : null
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-lg">
              <div className="flex items-center mb-6">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">Інші новини</h2>
                </div>

                <div className="space-y-4">
                  {relatedNews.slice(0, 4).map((news, index) => (
                    <RelatedNewsCard
                      key={news.id}
                      news={news}
                      onClick={() => handleRelatedNewsClick(news)}
                      index={index}
                      animate={animateRelated}
                    />
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