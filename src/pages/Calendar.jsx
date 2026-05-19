import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { calendarAPI, plantsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import WateringEventModal from '../components/WateringEventModal';

const SEASON_COLORS = {
  PRIMAVERA: { background: '#d7e8b5', textColor: '#203b14' },
  VERANO:    { background: '#c8e8b0', textColor: '#203b14' },
  OTONO:     { background: '#e8ddc8', textColor: '#31200b' },
  INVIERNO:  { background: '#d8e0cc', textColor: '#203b14' },
};

function toFCEvent(ev) {
  const colors = SEASON_COLORS[ev.season] ?? SEASON_COLORS.PRIMAVERA;
  return {
    id: String(ev.id),
    title: ev.completed ? `✓ ${ev.title}` : ev.title,
    date: ev.date.slice(0, 10),
    backgroundColor: ev.completed ? '#e0e5d5' : colors.background,
    textColor: ev.completed ? '#000000' : colors.textColor,
    extendedProps: ev,
  };
}

export default function Calendar() {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    Promise.all([calendarAPI.list(), plantsAPI.list()])
      .then(([evRes, plRes]) => {
        setEvents(evRes.data);
        setPlants(plRes.data);
      })
      .catch(() => toast.error('Error al cargar el calendario'))
      .finally(() => setLoading(false));
  }, []);

  function handleEventClick({ event }) {
    setModal({ event: event.extendedProps });
  }

  function handleDateClick({ dateStr }) {
    if (plants.length === 0) { toast.error('Primero agregá una planta'); return; }
    setModal({ date: dateStr });
  }

  function handleSaved(ev) {
    const items = Array.isArray(ev) ? ev : [ev];
    setEvents((prev) => {
      let next = [...prev];
      items.forEach((item) => {
        const idx = next.findIndex((e) => e.id === item.id);
        if (idx >= 0) next[idx] = item;
        else next = [item, ...next];
      });
      return next;
    });
    const count = items.length;
    toast.success(
      modal?.event ? 'Evento actualizado' :
      count > 1 ? `${count} eventos creados` : 'Evento creado'
    );
  }

  function handleDeleted(id) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast.success('Evento eliminado');
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-[28px] font-bold text-adaline-ink">Calendario de riego</h1>
        {plants.length > 0 && (
          <button
            onClick={() => setModal({ date: new Date().toISOString().slice(0, 10) })}
            className="btn-primary text-[13px]"
          >
            + Nuevo evento
          </button>
        )}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Primavera', ...SEASON_COLORS.PRIMAVERA },
          { label: 'Verano',    ...SEASON_COLORS.VERANO },
          { label: 'Otoño',     ...SEASON_COLORS.OTONO },
          { label: 'Invierno',  ...SEASON_COLORS.INVIERNO },
          { label: 'Completado', background: '#e0e5d5', textColor: '#c5ccb6' },
        ].map(({ label, background, textColor }) => (
          <span key={label} className="font-mono text-[11px] px-3 py-1 rounded-full"
            style={{ backgroundColor: background, color: textColor }}>
            {label}
          </span>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-valley-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-canvas-ice border border-stone-moss rounded-lg p-3 sm:p-4 overflow-x-auto">
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
      )}

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
