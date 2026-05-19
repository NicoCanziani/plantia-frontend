import { useState, useEffect } from 'react';
import { plantsAPI } from '../services/api';
import PlantCard from '../components/PlantCard';
import PlantListItem from '../components/PlantListItem';
import ViewToggle from '../components/ViewToggle';
import FilterBar from '../components/FilterBar';
import PlantForm from '../components/PlantForm';
import AIPlantModal from '../components/AIPlantModal';

const EMPTY = { name: '', type: '', tag: 'INTERIOR', caresSummary: '' };

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('recent');
  const [showManual, setShowManual] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchPlants();
  }, [tag, sort]);

  async function fetchPlants() {
    setLoading(true);
    try {
      const params = {};
      if (tag) params.tag = tag;
      if (sort) params.sort = sort;
      const res = await plantsAPI.list(params);
      setPlants(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleManualSave() {
    if (!form.name || !form.type || !form.tag) {
      setFormError('Completá nombre, tipo y ubicación');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const res = await plantsAPI.create(form);
      setPlants((p) => [res.data, ...p]);
      setShowManual(false);
      setForm(EMPTY);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  function handleCreated(plant) {
    setPlants((p) => [plant, ...p]);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-adaline-ink">Mis Plantas</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowManual(true)} className="btn-secondary text-[13px]">
            + Manual
          </button>
          <button onClick={() => setShowAI(true)} className="btn-primary text-[13px]">
            ✨ Con IA
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <FilterBar tag={tag} sort={sort} onTagChange={setTag} onSortChange={setSort} />
        <ViewToggle view={view} onChange={setView} />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-valley-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : plants.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[40px] mb-4">🌱</p>
          <p className="text-[18px] text-mist-gray">Todavía no tenés plantas</p>
          <p className="text-[14px] text-mist-gray mt-1">Agregá tu primera planta con IA o manualmente</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="w-full max-w-md bg-canvas-ice border border-stone-moss rounded-[20px] p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-adaline-ink">Agregar planta</h2>
              <button onClick={() => { setShowManual(false); setForm(EMPTY); }} className="text-mist-gray hover:text-adaline-ink text-xl">✕</button>
            </div>
            <PlantForm values={form} onChange={setForm} loading={saving} />
            {formError && <p className="text-[13px] text-red-500">{formError}</p>}
            <button onClick={handleManualSave} disabled={saving} className="btn-primary disabled:opacity-40">
              {saving ? 'Guardando...' : 'Guardar planta'}
            </button>
          </div>
        </div>
      )}

      {showAI && (
        <AIPlantModal onClose={() => setShowAI(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}
