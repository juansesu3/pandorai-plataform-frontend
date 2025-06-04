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
  status,
  lastUpdate,
  id,
  onManage,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="bg-gray-100 text-gray-700 rounded-full p-2">
          {icon}
        </div>
        <h3 className="ml-3 text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="text-sm text-gray-500 mb-4">
        <span className="font-medium text-gray-700">Estado:</span> {status} <br />
        <span className="font-medium text-gray-700">Última actualización:</span> {lastUpdate}
      </div>
      {onManage && (
        <Link 
          href={`/agents/${id}`}
          onClick={onManage}
          className="mt-2 inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Gestionar Agente
        </Link>
      )}
    </div>
  );
};

export default AgentCard;
