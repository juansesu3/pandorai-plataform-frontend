'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Client {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  status: 'active' | 'inactive';
  location?: string;
  company?: string;
  sector?: string;
  companyName?: string;
  contactName?: string;
}

interface Metrics {
  totalQueries: number;
  avgResponseTime: number;
  errorRate: number;
  lastActivity: string;
}

interface AgentSummary {
  id: string;
  name: string;
  model: string;
}

export default function ClientProfile({ clientId }: { clientId: string }) {
  const [client, setClient] = useState<Client | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [agents, setAgents] = useState<AgentSummary[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [clientRes, metricRes, agentsRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/clients/${clientId}`),
        fetch(`http://127.0.0.1:8000/clients/${clientId}/metrics`),
        fetch(`http://127.0.0.1:8000/clients/${clientId}/agents`),
      ]);
      setClient(await clientRes.json());
      setMetrics(await metricRes.json());
      setAgents(await agentsRes.json());
    }

    fetchData();
  }, [clientId]);

  if (!client) return <div className="p-6">Cargando cliente...</div>;

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="w-full min-h-screen mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
          {getInitials(client.companyName)}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{client.companyName}</h2>
          <p className="text-gray-500">{client.companyName || 'Empresa no especificada'}</p>
        </div>
      </div>

      {/* Info básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p><strong>✉️ Email:</strong> {client.email}</p>
        <p><strong>🗓️ Ingresó:</strong> {new Date(client.joinedAt).toLocaleDateString()}</p>
        <p><strong>🌍 Ubicación:</strong> {client.location || 'No especificada'}</p>
        <p>
          <strong>🔄 Estado:</strong>{' '}
          <span className={client.status === 'active' ? 'text-green-600' : 'text-red-600'}>
            {client.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
        </p>
        <p><strong>🏢 Sector:</strong> {client.sector || 'No definido'}</p>
      </div>

      {/* Métricas y Agentes */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">Resumen de uso</h3>
        {metrics ? (
          <ul className="text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
            <li>📈 Consultas totales: {metrics.totalQueries}</li>
            <li>⏱️ Tiempo promedio de respuesta: {metrics.avgResponseTime}</li>
            <li>⚠️ Tasa de error: {metrics.errorRate}%</li>
            <li>🕒 Última actividad: {metrics.lastActivity}</li>
          </ul>
        ) : (
          <p className="text-sm text-gray-400">Cargando métricas...</p>
        )}
      </div>

      {/* Agentes */}
      <div className="border-t pt-4 space-y-2">
  <h3 className="text-lg font-semibold text-gray-700">
    Agentes Integrados ({agents.length})
  </h3>

  <ul className="text-gray-700 divide-y divide-gray-200">
    {agents.map(agent => (
      <li key={agent.id} className="py-3 space-y-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-medium text-gray-800">{agent.name}</span> — {agent.model}
          </div>

          {/* Configuración individual */}
          <Link
            href={`/client/${client?.id}/agents/${agent.id}/config`}
            className="mt-2 md:mt-0 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded"
          >
            ⚙️ Settings
          </Link>
        </div>
      </li>
    ))}
  </ul>

  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
    + Asignar nuevo agente
  </button>
</div>


      {/* Acciones */}
      <div className="flex space-x-4 pt-4 border-t">
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Editar</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Eliminar</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          {client.status === 'active' ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    </div>
  );
}
