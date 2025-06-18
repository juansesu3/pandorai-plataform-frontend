'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Professional {
  _id: string;
  name: string;
  specialty: string;
  nextAppointment?: string; // ISO string
  shifts: {
    day: string;
    enabled: boolean;
    shifts: { start: string; end: string }[];
  }[];
}

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
  const [professionals, setProfessionals] = useState<Professional[]>([]); // 👈 Nuevo estado


  useEffect(() => {
    async function fetchData() {
      const [clientRes, metricRes, agentsRes, prosRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/clients/${clientId}`),
        fetch(`http://127.0.0.1:8000/clients/${clientId}/metrics`),
        fetch(`http://127.0.0.1:8000/clients/${clientId}/agents`),
        fetch(`http://127.0.0.1:8000/clients/${clientId}/professionals`),
      ]);
      setClient(await clientRes.json());
      setMetrics(await metricRes.json());
      setAgents(await agentsRes.json());
      setProfessionals(await prosRes.json()); // 👈 Agregamos profesionales
    }

    fetchData();
  }, [clientId]);

  if (!client) return <div className="p-6">Cargando cliente...</div>;

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <div className="w-full min-h-screen mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
          {getInitials(client.companyName || 'N/A')}
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

      {/* 🚀 Colaboradores */}
      <div className="border-t border-gray-300 pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">
            Colaboradores / Profesionales ({professionals.length})
          </h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Agregar Colaborador
          </button>
        </div>

        {professionals.length === 0 ? (
          <p className="text-sm text-gray-500">No hay colaboradores aún.</p>
        ) : (
          <ul className="divide-y divide-gray-200 text-gray-800 flex flex-col gap-2">
            {professionals.map((pro) => (
              <li key={pro.id} className="p-4 space-y-1 hover:bg-gray-50 transition rounded flex justify-between items-center">

                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                        {getInitials(pro.name)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{pro.name}</h4>
                        <p className="text-sm text-gray-500">{pro.specialty}</p>
                      </div>
                    </div>
                    {pro.nextAppointment && (
                      <span className="text-sm text-green-600">
                        Próxima cita: {formatTime(pro.nextAppointment)}
                      </span>
                    )}
                  </div>

                  {/* Turnos habilitados */}
                  <div className="mt-2 ml-12 text-sm text-gray-600">
                    {pro.shifts
                      .filter((d) => d.enabled)
                      .map((d) => (
                        <p key={d.day}>
                          <strong className="capitalize">{d.day}:</strong>{' '}
                          {d.shifts.map(s => `${s.start}–${s.end}`).join(', ')}
                        </p>
                      ))}
                  </div>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <Link
                    href={`/client/${client?.id}/agents/${pro.id}/config`}
                    className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded"
                  >
                    ⚙️ Configuración
                  </Link>

                  <Link
                    href={`/client/${client?.id}/agents/${pro.id}/calendar`}
                    className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded"
                  >
                    📅 Ver Agenda
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Agentes */}
      <div className="border-t border-gray-300 pt-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">
          Agentes Integrados ({agents.length})
        </h3>

        <ul className="text-gray-700 divide-y divide-gray-200">
          {agents.map(agent => (
            <li key={agent.id} className="py-3 space-y-1 p-4 shadow-sm rounded hover:bg-gray-50 transition">


              {/* Configuración individual */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="font-medium text-gray-800">{agent.name}</span> — {agent.model}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/client/${client?.id}/agents/${agent.id}/config`}
                    className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded"
                  >
                    ⚙️ Configuración
                  </Link>

                  <Link
                    href={`/client/${client?.id}/agents/${agent.id}/calendar`}
                    className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded"
                  >
                    📅 Ver Agenda
                  </Link>

                  <Link
                    href={`/client/${client?.id}/agents/${agent.id}/interactions`}
                    className="text-sm bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded"
                  >
                    💬 Interacciones
                  </Link>
                </div>
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
