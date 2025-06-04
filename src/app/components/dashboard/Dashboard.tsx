// pages/Dashboard.tsx
import React from 'react';
import AgentCard from '../agents/AgentCard';
// ya lo creamos

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
          + Crear Nuevo Agente
        </button>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard title="Agentes Totales" value={2} />
        <SummaryCard title="Activos" value={2} />
        <SummaryCard title="Con errores" value={1} color="text-red-500" />
        <SummaryCard title="Integraciones" value={5} />
      </div>

      {/* Lista de agentes */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6">Tus Agentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgentCard
          title="Agente de Recomendación"
          description="Sugiere productos según comportamiento del usuario."
          status="Activo"
          lastUpdate="Hace 2 horas"
          id='1'
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m0 0l-5 5m5-5l-5-5" />
            </svg>
          }
        />
        <AgentCard
          title="Agente de Reservas"
          description="Automatiza disponibilidad y confirmaciones de reservas."
          status="Activo"
          lastUpdate="Hace 30 min"
              id='2'
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-9 4h6m-5 4h4" />
            </svg>
          }
        />
      </div>

      {/* Métricas globales (placeholder) */}
      <div className="bg-white p-6 rounded-lg shadow border mt-6">
        <h3 className="font-semibold text-gray-700 mb-4">Métricas Globales</h3>
        <p className="text-gray-500">[Gráfico de uso de tokens, interacciones, rendimiento aquí...]</p>
      </div>
    </div>
  );
};

// Resumen pequeño
type SummaryCardProps = {
  title: string;
  value: number;
  color?: string;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, color }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className={`text-2xl font-bold ${color ?? 'text-gray-800'}`}>{value}</p>
    </div>
  );
};

export default Dashboard;
