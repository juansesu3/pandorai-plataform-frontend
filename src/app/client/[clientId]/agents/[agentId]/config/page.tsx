'use client';

import WorkingHoursConfig from '@/app/components/agents/reservation/WorkingHoursConfig';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const { clientId, agentId } = useParams();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [agentName, setAgentName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [services, setServices] = useState<{ name: string; duration: string; price: string; active: boolean }[]>([]);
  const [workingDays, setWorkingDays] = useState([]);

  const [slotDuration, setSlotDuration] = useState<number | undefined>();
  const [bufferTime, setBufferTime] = useState<number | undefined>();
  const [maxAppointmentsPerDay, setMaxAppointmentsPerDay] = useState<number | undefined>();

  const [allowReschedule, setAllowReschedule] = useState(false);
  const [notifyBy, setNotifyBy] = useState<string[]>([]);
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [timezone, setTimezone] = useState('');

  const handleSave = async () => {
    const config = {
      agentId,
      agentName,
      whatsapp,
      services,
      workingDays,
      slotDuration,
      bufferTime,
      maxAppointmentsPerDay,
      allowReschedule,
      notifyBy,
      cancellationPolicy,
      timezone,
      notes: ''
    };

    try {
      const res = await fetch(`http://127.0.0.1:8000/clients/${clientId}/agents/${agentId}/configuration`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (!res.ok) throw new Error('Error al guardar la configuración');

      const data = await res.json();
      alert('✅ Configuración guardada correctamente');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('❌ Ocurrió un error al guardar la configuración');
    }
  };

  useEffect(() => {
    const fetchClientConfig = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/clients/${clientId}`);
        const data = await res.json();

        const agentConfig = data.agentConfigurations?.find(
          (cfg: any) => cfg.agentId === agentId
        );

        if (agentConfig) {
          setAgentName(agentConfig.agentName || '');
          setWhatsapp(agentConfig.whatsapp || '');
          setServices(agentConfig.services || []);
          setWorkingDays(agentConfig.workingDays || []);

          setSlotDuration(agentConfig.slotDuration);
          setBufferTime(agentConfig.bufferTime);
          setMaxAppointmentsPerDay(agentConfig.maxAppointmentsPerDay);

          setAllowReschedule(agentConfig.allowReschedule || false);
          setNotifyBy(agentConfig.notifyBy || []);
          setCancellationPolicy(agentConfig.cancellationPolicy || '');
          setTimezone(agentConfig.timezone || '');

          setIsEditing(false);
        } else {
          setIsEditing(true); // Si no hay config, se puede editar directamente
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error al cargar la configuración del cliente', err);
        setIsLoading(false);
      }
    };

    fetchClientConfig();
  }, [clientId, agentId]);

  console.log(workingDays

  )
  if (isLoading) return <div className="text-center">Cargando configuración...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10 text-gray-800">
      <h1 className="text-3xl font-semibold">Configuración del Agente</h1>

      {!isEditing && (
        <button onClick={() => setIsEditing(true)} className="btn-primary mb-4">
          Editar Configuración
        </button>
      )}

      {/* Información General */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Información General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            className="input"
            placeholder="Nombre del Agente"
            value={agentName}
            disabled={!isEditing}
            onChange={(e) => setAgentName(e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="Número de WhatsApp"
            value={whatsapp}
            disabled={!isEditing}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>
      </section>

      {/* Días y Horarios */}
      <section className="space-y-4">
        <WorkingHoursConfig
          readOnly={!isEditing}
          onChange={(updatedDays) => setWorkingDays(updatedDays)}
          defaultValue={workingDays}
        />
      </section>

      {/* Servicios ofrecidos */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Servicios Ofrecidos</h2>
        {services.map((service, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            <input
              type="text"
              className="input"
              placeholder="Nombre"
              value={service.name}
              disabled={!isEditing}
              onChange={(e) => {
                const updated = [...services];
                updated[idx].name = e.target.value;
                setServices(updated);
              }}
            />
            <input
              type="text"
              className="input"
              placeholder="Duración (min)"
              value={service.duration}
              disabled={!isEditing}
              onChange={(e) => {
                const updated = [...services];
                updated[idx].duration = e.target.value;
                setServices(updated);
              }}
            />
            <input
              type="text"
              className="input"
              placeholder="Precio"
              value={service.price}
              disabled={!isEditing}
              onChange={(e) => {
                const updated = [...services];
                updated[idx].price = e.target.value;
                setServices(updated);
              }}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={service.active}
                disabled={!isEditing}
                onChange={(e) => {
                  const updated = [...services];
                  updated[idx].active = e.target.checked;
                  setServices(updated);
                }}
              />
              <span>Activo</span>
            </label>
          </div>
        ))}
        {isEditing && (
          <button
            onClick={() => setServices([...services, { name: '', duration: '', price: '', active: true }])}
            className="btn-primary"
          >
            Agregar Servicio
          </button>
        )}
      </section>

      {/* Disponibilidad y Slots */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Disponibilidad y Slots</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            className="input"
            placeholder="Duración de Slot (min)"
            value={slotDuration ?? ''}
            onChange={(e) => setSlotDuration(Number(e.target.value))}
            disabled={!isEditing}
          />
          <input
            type="number"
            className="input"
            placeholder="Buffer entre citas (min)"
            value={bufferTime ?? ''}
            onChange={(e) => setBufferTime(Number(e.target.value))}
            disabled={!isEditing}
          />
          <input
            type="number"
            className="input"
            placeholder="Máx. citas por día"
            value={maxAppointmentsPerDay ?? ''}
            onChange={(e) => setMaxAppointmentsPerDay(Number(e.target.value))}
            disabled={!isEditing}
          />
        </div>
      </section>

      {/* Configuración adicional */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Otras Configuraciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="input"
            disabled={!isEditing}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="">Zona Horaria</option>
            <option value="America/Argentina/Buenos_Aires">Buenos Aires</option>
            <option value="America/Mexico_City">CDMX</option>
            <option value="Europe/Madrid">Madrid</option>
          </select>
          <input
            type="text"
            className="input"
            placeholder="Política de cancelación"
            disabled={!isEditing}
            value={cancellationPolicy}
            onChange={(e) => setCancellationPolicy(e.target.value)}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              disabled={!isEditing}
              checked={allowReschedule}
              onChange={(e) => setAllowReschedule(e.target.checked)}
            />
            <span>Permitir reprogramación</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              disabled={!isEditing}
              checked={notifyBy.includes('whatsapp')}
              onChange={(e) => {
                if (e.target.checked) setNotifyBy([...notifyBy, 'whatsapp']);
                else setNotifyBy(notifyBy.filter(n => n !== 'whatsapp'));
              }}
            />
            <span>Enviar notificaciones (WhatsApp)</span>
          </label>
        </div>
      </section>

      {/* Guardar */}
      {isEditing && (
        <div>
          <button onClick={handleSave} className="btn-primary w-full md:w-auto">
            Guardar Configuración
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
