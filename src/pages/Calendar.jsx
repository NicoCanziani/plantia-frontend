import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { calendarAPI, plantsAPI } from '../services/api';
import WateringEventModal from '../components/WateringEventModal';

const SEASON_COLORS = {
  PRIMAVERA: { background: '#d7e8b5', textColor: '#203b14' },
  VERANO:    { background: '#e0f0c8', textColor: '#203b14' },
  OTONO:     { background: '#e8ddc8', textColor: '#31200b' },
  INVIERNO:  { background: '#d8e0cc', textColor: '#203b14' },
};

function toFCEvent(ev) {
  const colors = SEASON_COLORS[ev.season] ?? SEASON_COLORS.PRIMAVERA;
  return {
    id: String(ev.id),
    title: ev.completed ? `✓ ${ev.title}` : ev.title,
    date: ev.date.slice(0, 10),
    backgroundColor: ev.completed ? '#c5ccb6' : colors.background,
    textColor: ev.completed ? '#9ca3a0' : colors.textColor,
    extendedProps: ev,
  };
}

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [plants, setPlants] = useState([]);
  const [modal, setModal] = useState(null); // null | { event } | { date }

  useEffect(() => {
    Promise.all([calendarAPI.list(), plantsAPI.list()]).then(([evRes, plRes]) => {
      setEvents(evRes.data);
      setPlants(plRes.data);
    });
  }, []);

  function handleEventClick({ event }) {
    setModal({ event: event.extendedProps });
  }

  function handleDateClick({ dateStr }) {
    if (plants.length === 0) return;
    setModal({ date: dateStr });
  }

  function handleSaved(ev) {
    setEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === ev.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = ev;
        return next;
      }
      return [ev, ...prev];
    });
  }

  function handleDeleted(id) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-adaline-ink">Calendario de riego</h1>
        {plants.length > 0 && (
          <button onClick={() => setModal({ date: new Date().toISOString().slice(0, 10) })} className="btn-primary text-[13px]">
            + Nuevo evento
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(SEASON_COLORS).map(([season, { background, textColor }]) => (
          <span
            key={season}
            className="font-mono text-[11px] px-3 py-1 rounded-full"
            style={{ backgroundColor: background, color: textColor }}
          >
            {season === 'OTONO' ? 'OTOÑO' : season}
          </span>
        ))}
        <span className="font-mono text-[11px] px-3 py-1 rounded-full bg-mist-gray/40 text-mist-gray">
          COMPLETADO
        </span>
      </div>

      <div className="bg-canvas-ice border border-stone-moss rounded-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          events={events.map(toFCEvent)}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
          height="auto"
        />
      </div>

      {modal && (
        <WateringEventModal
          plants={plants}
          event={modal.event ?? null}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
