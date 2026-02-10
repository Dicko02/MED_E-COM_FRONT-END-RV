import React from 'react';
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white border border-gray-100 rounded-lg p-6 ${hover ? 'hover:shadow-lg transition-shadow' : ''} ${className}`}>
      {children}
    </div>
  );
};