import React, { useEffect, useState } from "react";
import { X, Calendar, Star, Share2 } from "lucide-react";

interface News {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  created_at: string;
  is_important: boolean;
}

interface NewsModalProps {
  news: News | null;
  isOpen: boolean;
  onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ news, isOpen, onClose }) => {
  const [animate, setAnimate] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!news) return null;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => setAnimate(true), 50);
    } else {
      setAnimate(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Скидання стану зображення при зміні новини
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [news.id]);

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
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.content.substring(0, 100) + "...",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(`${news.title}\n\n${news.content}`);
      alert("Новину скопійовано в буфер обміну!");
    }
  };

  // Покращена логіка для URL зображення
  const getImageUrl = (imageUrl: string | null | undefined): string | null => {
    if (!imageUrl) return null;
    
    // Якщо це вже повний URL
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Якщо URL починається з '/', видаляємо його для уникнення подвоєння
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
    
    // Формуємо повний URL
    return `http://localhost:5068/${cleanPath}`;
  };

  const imageSrc = getImageUrl(news.imageUrl);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', imageSrc);
    console.error('Original imageUrl:', news.imageUrl);
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-start bg-black/60 p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto my-8 transform transition-all duration-500 ${
          animate ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-2 border-b bg-gray-50 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3 mb-3">
                {news.is_important && (
                  <div className="bg-blue-600 text-white p-2 rounded-full shadow-md">
                    <Star className="h-4 w-4" />
                  </div>
                )}
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(news.created_at)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200 transform hover:scale-110"
                title="Поділитися"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200 transform hover:scale-110"
                title="Закрити"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
            {news.title}
          </h1>

          {/* Image Section */}
          <div className="w-full mb-4">
            {imageSrc && !imageError ? (
              <div className="relative">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
                <img
                  src={imageSrc}
                  alt={news.title}
                  className="w-full max-h-[500px] object-cover rounded-lg"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
              </div>
            ) : (
              <div className="w-full h-[300px] bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl rounded-lg">
                {imageError ? "Помилка завантаження зображення" : "Новина"}
              </div>
            )}
          </div>

          {/* Debug info - можете видалити після налагодження */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
              <div>Original imageUrl: {news.imageUrl || 'null'}</div>
              <div>Generated imageSrc: {imageSrc || 'null'}</div>
              <div>Image error: {imageError ? 'true' : 'false'}</div>
            </div>
          )}

          {/* Text */}
          <div className="prose prose-lg max-w-none text-gray-700">
            {news.content.split("\n").map(
              (paragraph, index) =>
                paragraph.trim() && (
                  <p key={index} className="mb-4 text-base md:text-md leading-tight">
                    {paragraph}
                  </p>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;