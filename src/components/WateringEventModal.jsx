import { useState, useEffect } from 'react';
import { calendarAPI, aiAPI } from '../services/api';

const SEASONS = {
  PRIMAVERA: 'Primavera',
  VERANO: 'Verano',
  OTONO: 'Otoño',
  INVIERNO: 'Invierno',
};

function getSeason(dateStr) {
  const m = new Date(dateStr).getMonth() + 1;
  if (m === 12 || m <= 2) return 'VERANO';
  if (m <= 5) return 'OTONO';
  if (m <= 8) return 'INVIERNO';
  return 'PRIMAVERA';
}

const today = () => new Date().toISOString().slice(0, 10);

export default function WateringEventModal({ plants, event, onClose, onSaved, onDeleted }) {
  const isEdit = !!event;
  const [form, setForm] = useState({
    title: event?.title ?? '',
    date: event?.date ? event.date.slice(0, 10) : today(),
    frequency: event?.frequency ?? '',
    notes: event?.notes ?? '',
    plantId: event?.plantId ?? plants[0]?.id ?? '',
  });
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const season = getSeason(form.date);
  const selectedPlant = plants.find((p) => p.id === Number(form.plantId));

  function handle(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSuggest() {
    if (!selectedPlant) return;
    setLoadingSuggestion(true);
    try {
      const res = await aiAPI.wateringSuggestion(selectedPlant.name, selectedPlant.type, season);
      setForm((f) => ({ ...f, frequency: res.data.frequency }));
    } catch {
      // silencio si falla la sugerencia
    } finally {
      setLoadingSuggestion(false);
    }
  }

  async function handleSave() {
    if (!form.title || !form.date || !form.plantId) {
      setError('Completá título, fecha y planta');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, plantId: Number(form.plantId) };
      let res;
      if (isEdit) {
        res = await calendarAPI.update(event.id, payload);
      } else {
        res = await calendarAPI.create(payload);
      }
      onSaved(res.data);
      onClose();
    } catch {
      setError('Error al guardar el evento');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('¿Eliminar este evento?')) return;
    await calendarAPI.remove(event.id);
    onDeleted(event.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="w-full max-w-md bg-canvas-ice border border-stone-moss rounded-[20px] p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-adaline-ink">
            {isEdit ? 'Editar evento' : 'Nuevo evento de riego'}
          </h2>
          <button onClick={onClose} className="text-mist-gray hover:text-adaline-ink text-xl">✕</button>
        </div>

        <div className="flex flex-col gap-3">
          <Field label="Planta">
            <select className="input" value={form.plantId} onChange={handle('plantId')}>
              {plants.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Título">
            <input className="input" placeholder="ej. Regar Potus" value={form.title} onChange={handle('title')} />
          </Field>

          <Field label="Fecha">
            <input className="input" type="date" value={form.date} onChange={handle('date')} />
          </Field>

          <Field label={`Frecuencia · Estación: ${SEASONS[season]}`}>
            <div className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="ej. cada 7 días"
                value={form.frequency}
                onChange={handle('frequency')}
              />
              <button
                type="button"
                onClick={handleSuggest}
                disabled={loadingSuggestion || !selectedPlant}
                title="Sugerencia IA"
                className="px-3 py-2 border border-stone-moss rounded-[20px] text-[13px] text-valley-green hover:bg-forest-dew disabled:opacity-40 transition-colors shrink-0"
              >
                {loadingSuggestion ? '...' : '✨ IA'}
              </button>
            </div>
          </Field>

          <Field label="Notas (opcional)">
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Anotaciones adicionales..."
              value={form.notes}
              onChange={handle('notes')}
            />
          </Field>
        </div>

        {error && <p className="text-[13px] text-red-500">{error}</p>}

        <div className="flex gap-3">
          {isEdit && (
            <button onClick={handleDelete} className="btn-secondary text-red-500 border-red-200 hover:bg-red-50">
              Eliminar
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-40">
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear evento'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-adaline-ink">{label}</label>
      {children}
    </div>
  );
}
