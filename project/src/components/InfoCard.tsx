import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  topText: string;
  bottomText: string;
  imageUrl?: string;
  fallbackInitials?: string;
  index?: number;
  getGradientColor?: (index: number) => string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  topText,
  bottomText,
  imageUrl,
  fallbackInitials,
  index = 0,
  getGradientColor,
  onClick,
}) => {
  return (
    <motion.div
      className="bg-white shadow-md overflow-hidden border border-gray-300 rounded-md cursor-pointer group"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{
        y: -4,
        scale: 1.03,
        boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
        transition: { type: "spring", stiffness: 300, damping: 20 } 
      }}
      style={{ willChange: "transform, opacity" }}
    >
        
      {/* Upper Section */}
      <div
        className={`p-4 text-white flex justify-center bg-gradient-to-r ${
          getGradientColor?.(index) ?? "from-gray-500 to-gray-600"
        }`}
      >
        <div className="flex items-center space-x-2 h-4 text-center">
          <span className="font-bold text-sm leading-tight">{topText}</span>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={bottomText}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300" // без group-hover:scale-105
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
            <div className="text-3xl font-bold mb-1">{fallbackInitials}</div>
            <div className="text-xs opacity-75 px-2 text-center">{bottomText}</div>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center justify-center p-4 text-center h-12">
        <p className="text-blue-600 font-bold text-sm leading-tight">{bottomText}</p>
      </div>
    </motion.div>
  );
};