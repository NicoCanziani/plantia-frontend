import { useState, useEffect } from 'react';
import { plantsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import PlantCard from '../components/PlantCard';
import PlantListItem from '../components/PlantListItem';
import ViewToggle from '../components/ViewToggle';
import FilterBar from '../components/FilterBar';
import PlantForm from '../components/PlantForm';
import AIPlantModal from '../components/AIPlantModal';
import { SkeletonCard, SkeletonListItem } from '../components/Skeletons';

const EMPTY = { name: '', type: '', tag: 'INTERIOR', caresSummary: '' };

export default function Plants() {
  const toast = useToast();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('recent');
  const [showManual, setShowManual] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => { fetchPlants(); }, [tag, sort]);

  async function fetchPlants() {
    setLoading(true);
    try {
      const params = {};
      if (tag) params.tag = tag;
      if (sort) params.sort = sort;
      const res = await plantsAPI.list(params);
      setPlants(res.data);
    } catch {
      toast.error('Error al cargar las plantas');
    } finally {
      setLoading(false);
    }
  }

  function closeManual() { setShowManual(false); setForm(EMPTY); setImageFile(null); setFormError(''); }

  async function handleManualSave() {
    if (!form.name || !form.type || !form.tag) { setFormError('Completá nombre, tipo y ubicación'); return; }
    setSaving(true);
    setFormError('');
    try {
      const res = await plantsAPI.create(form);
      const plant = res.data;
      if (imageFile) {
        const imgRes = await plantsAPI.uploadImage(plant.id, imageFile).catch(() => null);
        if (imgRes) plant.imageUrl = imgRes.data.imageUrl;
      }
      setPlants((p) => [plant, ...p]);
      closeManual();
      toast.success('Planta agregada');
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  function handleCreated(plant) {
    setPlants((p) => [plant, ...p]);
    toast.success('Planta identificada y guardada');
  }

  const skeletonCount = 6;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-[28px] font-bold text-adaline-ink">Mis Plantas</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowManual(true)} className="btn-secondary text-[13px]">+ Manual</button>
          <button onClick={() => setShowAI(true)} className="btn-primary text-[13px]">✨ Con IA</button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <FilterBar tag={tag} sort={sort} onTagChange={setTag} onSortChange={setSort} />
        <ViewToggle view={view} onChange={setView} />
      </div>

      {/* Content */}
      {loading ? (
        view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="bg-canvas-ice border border-stone-moss rounded-lg px-4">
            {Array.from({ length: skeletonCount }).map((_, i) => <SkeletonListItem key={i} />)}
          </div>
        )
      ) : plants.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[48px] mb-4">🌱</p>
          <p className="text-[18px] text-mist-gray">Todavía no tenés plantas</p>
          <p className="text-[14px] text-mist-gray mt-1">Agregá tu primera planta con IA o manualmente</p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => setShowManual(true)} className="btn-secondary">+ Manual</button>
            <button onClick={() => setShowAI(true)} className="btn-primary">✨ Con IA</button>
          </div>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plants.map((p) => <PlantCard key={p.id} plant={p} />)}
        </div>
      ) : (
        <div className="bg-canvas-ice border border-stone-moss rounded-lg px-4">
          {plants.map((p) => <PlantListItem key={p.id} plant={p} />)}
        </div>
      )}

      {/* Modal manual */}
      {showManual && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/30">
          <div className="w-full sm:max-w-md bg-canvas-ice border border-stone-moss sm:rounded-[20px] rounded-t-[20px] p-6 flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-adaline-ink">Agregar planta</h2>
              <button onClick={closeManual} className="text-mist-gray hover:text-adaline-ink text-xl leading-none">✕</button>
            </div>
            <PlantForm values={form} onChange={setForm} loading={saving} />

            {/* Imagen opcional */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-adaline-ink">Foto (opcional)</label>
              <input
                type="file"
                accept="image/*"
                className="text-[13px] text-mist-gray file:mr-3 file:py-1.5 file:px-4 file:rounded-[20px] file:border file:border-stone-moss file:text-[13px] file:text-adaline-ink file:bg-canvas-ice hover:file:bg-forest-dew/50"
                onChange={(e) => setImageFile(e.target.files[0] || null)}
              />
            </div>

            {formError && <p className="text-[13px] text-red-500">{formError}</p>}
            <button onClick={handleManualSave} disabled={saving} className="btn-primary disabled:opacity-40">
              {saving ? 'Guardando...' : 'Guardar planta'}
            </button>
          </div>
        </div>
      )}

      {showAI && <AIPlantModal onClose={() => setShowAI(false)} onCreated={handleCreated} />}
    </div>
  );
}
