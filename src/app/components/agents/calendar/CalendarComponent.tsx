'use client';

import { useMemo, useState } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  Event as CalendarEvent,
} from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { v4 as uuidv4 } from 'uuid';

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

type EventType = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

export default function CalendarComponent() {
  const [events, setEvents] = useState<EventType[]>([
    {
      id: uuidv4(),
      title: 'Cita inicial',
      start: new Date(),
      end: new Date(new Date().getTime() + 30 * 60000),
    },
  ]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = prompt('Título de la cita');
    if (title) {
      setEvents((prev) => [
        ...prev,
        { id: uuidv4(), title, start, end },
      ]);
    }
  };

  const handleEventResize = ({ event, start, end }: any) => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === event.id ? { ...evt, start, end } : evt
      )
    );
  };

  const handleEventDrop = ({ event, start, end }: any) => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === event.id ? { ...evt, start, end } : evt
      )
    );
  };

  const handleEventClick = (event: CalendarEvent) => {
    const confirmDelete = confirm(`¿Eliminar la cita "${event.title}"?`);
    if (confirmDelete) {
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Agenda del Agente</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        selectable
        resizable
        style={{ height: 600 }}
        onSelectSlot={handleSelectSlot}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        onSelectEvent={handleEventClick}
        popup
        messages={{
          next: 'Siguiente',
          previous: 'Anterior',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          showMore: (total) => `+ Ver más (${total})`,
        }}
        draggableAccessor={() => true}
      />
    </div>
  );
}
