import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref
}) => {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="w-16 h-16 mx-auto text-gray-300 mb-4" />}
      <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-6">{description}</p>}
      {actionText && actionHref && (
        <a 
          href={actionHref}
          className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          {actionText}
        </a>
      )}
    </div>
  );
};