import React from 'react';
import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className="text-gray-400">{icon}</div>
    </div>
    <div className="text-3xl font-light mb-1">{value}</div>
    <div className="text-sm text-gray-500">{title}</div>
  </div>
);