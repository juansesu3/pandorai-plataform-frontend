// components/AgentCard.tsx
import Link from 'next/link';
import React from 'react';

type AgentCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: string;
  lastUpdate: string;
  id: string;
  onManage?: () => void;
};

const AgentCard: React.FC<AgentCardProps> = ({
  title,
  description,
  icon,
  id,

}) => {
  return (
    <Link href={`/agents/${id}/`} className="bg-white shadow-md rounded-lg p-6 max-w-md w-full border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="bg-gray-100 text-gray-700 rounded-full p-2">
          {icon}
        </div>
        <h3 className="ml-3 text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="text-sm text-gray-500 mb-4">
      </div>
    </Link>
  );
};

export default AgentCard;
