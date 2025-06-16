'use client'
import React, { useEffect, useState } from 'react'

interface FormData {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    businessType: string;
    timezone: string;
    workingHoursStart: string;
    workingHoursEnd: string;
    notes?: string;
    agentId: string; // <-- Añadido aquí
  }

const FormIntegrateClient: React.FC = () => {
    const [agents, setAgents] = useState<any[]>([]);
    const [selectedAgentId, setSelectedAgentId] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      businessType: '',
      timezone: '',
      workingHoursStart: '09:00',
      workingHoursEnd: '17:00',
      notes: '',
      agentId: '', // <-- Inicializado aquí también
    });
  
    useEffect(() => {
      const getAgents = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/agents/');
          const data = await response.json();
          setAgents(data);
        } catch (error: any) {
          console.error('❌ Error al obtener agentes:', error.message);
          alert(error.message);
        }
      };
      getAgents();
    }, []);
  
    // Cuando cambia el agente seleccionado, se actualiza el formData
    useEffect(() => {
      setFormData(prev => ({ ...prev, agentId: selectedAgentId }));
    }, [selectedAgentId]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!formData.agentId) {
        alert("Selecciona un agente antes de continuar.");
        return;
      }
  
      try {
        const response = await fetch('http://127.0.0.1:8000/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const result = await response.json();
          alert('✅ Cliente integrado exitosamente con ID: ' + result.client_id);
          // Opcional: resetear el formulario
          setFormData({
            companyName: '',
            contactName: '',
            email: '',
            phone: '',
            businessType: '',
            timezone: '',
            workingHoursStart: '09:00',
            workingHoursEnd: '17:00',
            notes: '',
            agentId: selectedAgentId,
          });
        } else {
          const error = await response.json();
          alert('❌ Error al integrar cliente: ' + error.detail);
        }
      } catch (err) {
        console.error('Error:', err);
        alert('❌ Error al enviar datos. Revisa la consola.');
      }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow min-h-screen">
            <h2 className="text-xl font-semibold text-gray-700">Integrar nuevo cliente al agente</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona un agente</label>
                <div className="grid gap-4 md:grid-cols-2">
                    {agents.map(agent => (
                        <div
                            key={agent.id}
                            onClick={() => setSelectedAgentId(agent.id)}
                            className={`cursor-pointer border rounded-lg p-4 shadow-sm transition hover:shadow-md
          ${selectedAgentId === agent.id ? 'border-blue-500 ring-2 ring-blue-400' : 'border-gray-300'}
        `}
                        >
                            <h3 className="text-lg font-semibold text-gray-800">{agent.name}</h3>
                            <p className="text-sm text-gray-600">{agent.description}</p>
                            <div className="text-xs text-gray-500 mt-2">
                                <p><strong>Modelo:</strong> {agent.model}</p>
                                {/* <p><strong>Integraciones:</strong> {agent.integrations.join(', ')}</p> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de la empresa</label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de contacto</label>
                    <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de negocio</label>
                    <input
                        type="text"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Zona horaria</label>
                    <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleChange}
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                        required
                    >
                        <option value="">Seleccionar zona</option>
                        <option value="America/Bogota">Bogotá (GMT-5)</option>
                        <option value="Europe/Zurich">Zurich (GMT+2)</option>
                        <option value="America/Mexico_City">México DF (GMT-6)</option>
                        <option value="UTC">UTC</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Horario de inicio</label>
                    <input
                        type="time"
                        name="workingHoursStart"
                        value={formData.workingHoursStart}
                        onChange={handleChange}
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Horario de cierre</label>
                    <input
                        type="time"
                        name="workingHoursEnd"
                        value={formData.workingHoursEnd}
                        onChange={handleChange}
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Notas adicionales</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                    rows={3}
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
                Integrar Cliente
            </button>
        </form>
    );
};

export default FormIntegrateClient;
