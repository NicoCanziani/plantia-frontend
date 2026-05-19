import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { plantsAPI, aiAPI } from '../services/api';
import PlantForm from '../components/PlantForm';

const TAG_STYLES = {
  INTERIOR: 'bg-forest-dew text-valley-green',
  EXTERIOR: 'bg-stone-moss text-deep-earth',
};

function formatDate(str) {
  const d = new Date(str);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingCare, setLoadingCare] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    plantsAPI.get(id).then((r) => {
      setPlant(r.data);
      setForm({ name: r.data.name, type: r.data.type, tag: r.data.tag, caresSummary: r.data.caresSummary || '' });
    });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await plantsAPI.update(id, form);
      setPlant(res.data);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar ${plant.name}?`)) return;
    await plantsAPI.remove(id);
    navigate('/plants');
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const res = await plantsAPI.uploadImage(id, file);
      setPlant((p) => ({ ...p, imageUrl: res.data.imageUrl }));
    } finally {
      setUploadingImg(false);
    }
  }

  async function handleRegenerateCare() {
    setLoadingCare(true);
    try {
      const res = await aiAPI.careSummary(plant.name, plant.type);
      const updated = await plantsAPI.update(id, { caresSummary: res.data.caresSummary });
      setPlant(updated.data);
      setForm((f) => ({ ...f, caresSummary: res.data.caresSummary }));
    } finally {
      setLoadingCare(false);
    }
  }

  if (!plant) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-valley-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Back */}
      <button onClick={() => navigate('/plants')} className="flex items-center gap-1 text-[13px] text-mist-gray hover:text-adaline-ink self-start">
        ← Mis Plantas
      </button>

      {/* Image */}
      <div className="relative rounded-lg overflow-hidden aspect-[16/7] bg-stone-moss/20">
        {plant.imageUrl ? (
          <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-mist-gray">🌿</div>
        )}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploadingImg}
          className="absolute bottom-3 right-3 bg-canvas-ice border border-stone-moss rounded-[20px] px-3 py-1.5 text-[12px] text-adaline-ink hover:bg-forest-dew transition-colors"
        >
          {uploadingImg ? 'Subiendo...' : '📷 Cambiar foto'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-adaline-ink">{plant.name}</h1>
          <p className="font-mono text-[13px] text-mist-gray mt-0.5">{plant.type}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${TAG_STYLES[plant.tag]}`}>
              {plant.tag}
            </span>
            <span className="font-mono text-[12px] text-mist-gray">Agregada {formatDate(plant.addedAt)}</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setEditing(true)} className="btn-secondary text-[13px]">Editar</button>
          <button onClick={handleDelete} className="btn-secondary text-[13px] text-red-500 border-red-200 hover:bg-red-50">Eliminar</button>
        </div>
      </div>

      {/* Care summary */}
      <div className="bg-canvas-ice border border-stone-moss rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-adaline-ink">Cuidados</h2>
          <button
            onClick={handleRegenerateCare}
            disabled={loadingCare}
            className="text-[12px] text-valley-green hover:underline disabled:opacity-40"
          >
            {loadingCare ? 'Generando...' : '✨ Regenerar con IA'}
          </button>
        </div>
        {plant.caresSummary ? (
          <p className="text-[14px] text-adaline-ink leading-relaxed">{plant.caresSummary}</p>
        ) : (
          <p className="text-[14px] text-mist-gray">Sin resumen de cuidados. Generá uno con IA.</p>
        )}
      </div>

      {/* Watering events */}
      {plant.wateringEvents?.length > 0 && (
        <div className="bg-canvas-ice border border-stone-moss rounded-lg p-6">
          <h2 className="text-[16px] font-bold text-adaline-ink mb-3">Eventos de riego</h2>
          <div className="flex flex-col divide-y divide-stone-moss">
            {plant.wateringEvents.map((ev) => (
              <div key={ev.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-[14px] text-adaline-ink">{ev.title}</p>
                  <p className="font-mono text-[12px] text-mist-gray">{formatDate(ev.date)} · {ev.frequency}</p>
                </div>
                {ev.completed && (
                  <span className="font-mono text-[11px] bg-forest-dew text-valley-green px-2 py-0.5 rounded-full">
                    Regada ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="w-full max-w-md bg-canvas-ice border border-stone-moss rounded-[20px] p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-adaline-ink">Editar {plant.name}</h2>
              <button onClick={() => setEditing(false)} className="text-mist-gray hover:text-adaline-ink text-xl">✕</button>
            </div>
            <PlantForm values={form} onChange={setForm} loading={saving} />
            <div className="flex gap-3">
              <button onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-40">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
