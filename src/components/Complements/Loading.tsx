import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-black rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
};