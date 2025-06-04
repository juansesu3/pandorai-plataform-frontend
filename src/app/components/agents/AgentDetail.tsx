// pages/AgentDetail.tsx
import Link from 'next/link';
import React from 'react';

const AgentDetail: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agente de Recomendación</h1>
          <p className="text-gray-500 mt-1">Personaliza productos usando comportamiento del usuario</p>
        </div>
        <Link href="/agents/1/config" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
          Configurar Agente
        </Link>
      </div>

      {/* Estado general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Estado</h2>
          <p className="text-green-600 font-medium">Activo</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Modelo utilizado</h2>
          <p className="text-gray-800">OpenAI GPT-4-turbo</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Última actividad</h2>
          <p className="text-gray-800">Hace 13 minutos</p>
        </div>
      </div>

      {/* Tabs (info seccionada) */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b flex space-x-4 px-6 pt-4">
          <button className="text-sm py-2 px-2 font-medium text-blue-600 border-b-2 border-blue-600">Detalles</button>
          <button className="text-sm py-2 px-2 text-gray-600 hover:text-blue-600">Integraciones</button>
          <button className="text-sm py-2 px-2 text-gray-600 hover:text-blue-600">Métricas</button>
          <button className="text-sm py-2 px-2 text-gray-600 hover:text-blue-600">Logs</button>
        </div>

        {/* Detalles */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700">Descripción</h3>
            <p className="text-gray-600">
              Este agente analiza sesiones de navegación y patrones de compra para ofrecer productos relevantes en tiempo real.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Cliente Integrado</h3>
            <p className="text-gray-600">TiendaOnlineXYZ</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Parámetros del modelo</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Temperatura: 0.7</li>
              <li>Top P: 0.9</li>
              <li>Máxima longitud: 2048 tokens</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;
