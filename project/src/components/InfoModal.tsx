import React, { useEffect, useRef, useState } from "react";
import { X, MapPin, Mail, Clock, Globe } from "lucide-react";

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

interface ModalProps {
  item: {
    topText: string;
    bottomText: string;
    imageUrl?: string;
    description?: string;
    office_location?: string;
    building_location?: string;
    contact_email?: string;
    working_hours?: string;
    website_url?: string;
    index?: number;
    post?: string;
  } | null;
  getInitials: (name: string) => string;
  getGradientColor?: (index: number) => string;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  item,
  getInitials,
  getGradientColor,
  isOpen,
  onClose,
}) => {
  const [animate, setAnimate] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isOpen) {
      setExpanded(false);
      requestAnimationFrame(() => setAnimate(true));
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (item?.description && descriptionRef.current && !expanded) {
      const element = descriptionRef.current;
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 5;
      
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';
      
      const fullHeight = element.scrollHeight;
      
      if (fullHeight > maxHeight) {
        setShowReadMore(true);
        element.style.maxHeight = `${maxHeight}px`;
        element.style.overflow = 'hidden';
      } else {
        setShowReadMore(false);
      }
    }
  }, [item?.description, expanded, isOpen]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
    if (descriptionRef.current) {
      if (!expanded) {
        descriptionRef.current.style.maxHeight = 'none';
        descriptionRef.current.style.overflow = 'visible';
      } else {
        const lineHeight = parseInt(window.getComputedStyle(descriptionRef.current).lineHeight);
        const maxHeight = lineHeight * 6;
        descriptionRef.current.style.maxHeight = `${maxHeight}px`;
        descriptionRef.current.style.overflow = 'hidden';
      }
    }
  };

  if (!item) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 p-2 sm:p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={handleClose}
    >
      {/* Upper Section */}
      <div
        className={`bg-white rounded-lg shadow-lg w-full max-w-[75vw] md:max-w-[55vw] lg:max-w-[45vw] xl:max-w-[25vw] max-h-[85vh] mx-auto transform transition-transform duration-300 ${animate ? "translate-y-0" : "translate-y-[100vh]"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <SimpleBar style={{ maxHeight: '80vh'}}>
        <div
          className={`relative p-4 text-white flex justify-center rounded-t-lg bg-gradient-to-r ${
            getGradientColor?.(item.index ?? 0) ?? "from-gray-500 to-gray-600"
          }`}
        >
          <div className="flex items-center space-x-2 text-center h-4">
            <h3 className="font-bold text-sm leading-tight">{item.topText}</h3>
          </div>
          <button
            onClick={handleClose}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border-2 border-white bg-white/20 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 transform-gpu origin-center hover:scale-110 hover:bg-white hover:text-blue-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Image Section */}
        <div className="relative aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.bottomText}
              className="w-full h-full object-cover loading=lazy"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
              <div className="text-3xl font-bold mb-1">
                {getInitials(item.bottomText)}
              </div>
              <div className="text-xs opacity-75 px-2 text-center">
                {item.bottomText}
              </div>
            </div>
          )}
        </div>

        {/* Lower Section */}
        <div className="flex flex-col items-start p-4 gap-3">
          <h4 className="text-sm">
            <span className="font-bold text-blue-600">{item.bottomText}</span>
            <span className="text-gray-600 block">{item.post}</span>
          </h4>
          {item.description && (
            <div className="w-full">
              <p 
                ref={descriptionRef}
                className={`text-gray-700 text-sm ${
                  !expanded ? 'relative' : ''
                }`}
                style={{
                  lineHeight: '1.4',
                  ...(showReadMore && !expanded ? {
                    display: '-webkit-box',
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  } : {})
                }}
              >
                {item.description}
              </p>
              {showReadMore && (
                <button
                  onClick={toggleExpanded}
                  className="text-gray-500 text-xs mt-1 flex items-center transition-all duration-300 transform hover:translate-x-1 hover:text-blue-600"
                >
                  {expanded ? 'приховати' : 'читати ще'}
                  <span className="ml-1 inline-block">
                    {expanded ? '↑' : '→'}
                  </span>
                </button>
              )}
            </div>
          )}
          {item.office_location && item.building_location && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.building_location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {item.office_location}
              </a>
            </div>
          )}      
          {item.contact_email && (
            <div className="flex items-center text-gray-600 text-sm">
              <Mail className="h-4 w-4 mr-2 text-blue-600" />
              <a href={`mailto:${item.contact_email}`} className="text-blue-600 hover:underline">
                {item.contact_email}
              </a>
            </div>
          )}
          {item.working_hours && (
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="h-4 w-4 mr-2" />
              {item.working_hours}
            </div>
          )}
          {item.website_url && (
            <div className="flex items-center text-gray-600 text-sm">
              <Globe className="h-4 w-4 mr-2" />
              <a
                href={item.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {item.website_url}
              </a>
            </div>
          )}
        </div>
        </SimpleBar>
      </div>
    </div>
  );
};