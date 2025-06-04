// pages/AgentReservationConfig.tsx
import React from 'react';

const AgentReservationConfig: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">Configuración del Agente de Citas</h1>

      {/* Sección: Modelo de IA */}
      <div className="bg-white p-6 rounded-lg shadow border space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">🧠 Modelo de IA</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Modelo</label>
            <select className="w-full border-gray-300 rounded mt-1">
              <option>gpt-4-turbo</option>
              <option>gpt-3.5-turbo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Temperatura</label>
            <input type="number" step="0.1" defaultValue={0.7} className="w-full border-gray-300 rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Máx. Tokens</label>
            <input type="number" defaultValue={1024} className="w-full border-gray-300 rounded mt-1" />
          </div>
        </div>
      </div>

      {/* Sección: Horarios y reglas */}
      <div className="bg-white p-6 rounded-lg shadow border space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">📅 Disponibilidad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Días disponibles</label>
            <select multiple className="w-full border-gray-300 rounded mt-1">
              <option>Lunes</option>
              <option>Martes</option>
              <option>Miércoles</option>
              <option>Jueves</option>
              <option>Viernes</option>
              <option>Sábado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Horas por día</label>
            <input type="text" placeholder="09:00-13:00, 15:00-18:00" className="w-full border-gray-300 rounded mt-1" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Tiempo mínimo entre citas (min)</label>
          <input type="number" defaultValue={15} className="w-full border-gray-300 rounded mt-1" />
        </div>
      </div>

      {/* Sección: Integraciones */}
      <div className="bg-white p-6 rounded-lg shadow border space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">📦 Integración</h2>
        <div>
          <label className="block text-sm font-medium text-gray-600">Webhook / API de reservas</label>
          <input type="url" placeholder="https://tuapp.com/api/reservas" className="w-full border-gray-300 rounded mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Token de autenticación</label>
          <input type="password" placeholder="••••••••••••" className="w-full border-gray-300 rounded mt-1" />
        </div>
      </div>

      {/* Sección: Notificaciones */}
      <div className="bg-white p-6 rounded-lg shadow border space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">🔔 Notificaciones</h2>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" defaultChecked />
            <span>Enviar confirmación por email</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span>Enviar recordatorio por WhatsApp</span>
          </label>
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Guardar configuración</button>
      </div>
    </div>
  );
};

export default AgentReservationConfig;
