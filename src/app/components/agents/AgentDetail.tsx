'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Agent {
  id: string;
  name: string;
  model: string;
  description: string;
  temperature: number;
  maxTokens: number;
}

interface Props {
  agentId: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
}
type Tab = 'details' | 'integrations' | 'metrics'|'clients';;

const AgentDetail: React.FC<Props> = ({ agentId }) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  useEffect(() => {
    async function fetchAgent() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/agents/${agentId}`);
        const data = await res.json();
        setAgent(data);
      } catch (error) {
        console.error('Error loading agent:', error);
      } finally {
        setLoading(false);
      }
    }

    if (agentId) fetchAgent();
  }, [agentId]);

    // Simular fetch de clientes cuando cambia el tab a "clients"
    useEffect(() => {
      async function fetchClients() {
        setLoadingClients(true);
        try {
          // Aquí pondrías tu endpoint real para obtener clientes del agente
          // const res = await fetch(`http://127.0.0.1:8000/agents/${agentId}/clients`);
          // const data = await res.json();
  
          // Simulación datos de clientes:
          const data: Client[] = [
            { id: '1', name: 'Barberia Michel', email: 'clientea@example.com', joinedAt: '2025-01-10' },
            { id: '2', name: 'Beauty Salon', email: 'clienteb@example.com', joinedAt: '2025-03-15' },
          ];
  
          setClients(data);
        } catch (error) {
          console.error('Error loading clients:', error);
        } finally {
          setLoadingClients(false);
        }
      }
  
      if (activeTab === 'clients') {
        fetchClients();
      }
    }, [activeTab, agentId]);

  if (loading) return <p>Loading...</p>;
  if (!agent) return <p>Agent not found.</p>;

  // Función para renderizar el contenido según tab activo
  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">Descripción</h3>
              <p className="text-gray-600">{agent.description || 'No hay descripción disponible.'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Cliente Integrado</h3>
              <p className="text-gray-600">Barberia Michell</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Parámetros del modelo</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Temperatura: {agent.temperature}</li>
                <li>Máxima longitud: {agent.maxTokens}</li>
              </ul>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Integraciones activas</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>WhatsApp API</li>
              <li>Google Sheets Sync</li>
            </ul>
            <p className="text-gray-500 text-sm mt-2">Próximas integraciones en desarrollo...</p>
          </div>
        );

      case 'metrics':
        return (
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Métricas del agente</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Consultas atendidas: 1,235</li>
              <li>Tiempo promedio de respuesta: 1.2s</li>
              <li>Tasa de error: 0.3%</li>
            </ul>
            <p className="text-gray-500 text-sm mt-2">Datos actualizados al último mes.</p>
          </div>
        );

        case 'clients':
          return (
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Clientes integrados</h3>
                <Link href={`/client/create-client`}
                  onClick={() => alert('Aquí iría la lógica para crear un nuevo cliente')}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                >
                  + Nuevo Cliente
                </Link>
              </div>
  
              {loadingClients ? (
                <p>Cargando clientes...</p>
              ) : clients.length === 0 ? (
                <p className="text-gray-500">No hay clientes integrados aún.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {clients.map((client) => (
                    <li key={client.id} className="py-3 flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <p className="font-medium text-gray-800">{client.name}</p>
                        <p className="text-gray-600 text-sm">{client.email}</p>
                      </div>
                      <div className="text-gray-500 text-sm">Desde: {new Date(client.joinedAt).toLocaleDateString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{agent.name}</h1>
          <p className="text-gray-500 mt-1">{agent.description}</p>
        </div>
        <Link href="/agents/1/config" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
          Configurar Agente
        </Link>
      </div>

      {/* Estado general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Status</h2>
          <p className="text-green-600 font-medium">Activo</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Model used</h2>
          <p className="text-gray-800">{agent.model}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Last activity</h2>
          <p className="text-gray-800">Hace 13 minutos</p>
        </div>
      </div>

      {/* Tabs (info seccionada) */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b flex space-x-4 px-6 pt-4">
          {(['details', 'integrations', 'metrics', 'clients'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm py-2 px-4 font-medium ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Contenido tab */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AgentDetail;
