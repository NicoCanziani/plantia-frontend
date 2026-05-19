import { useState, useRef } from 'react';
import { aiAPI, plantsAPI } from '../services/api';
import PlantForm from './PlantForm';

const EMPTY = { name: '', type: '', tag: 'INTERIOR', caresSummary: '' };

export default function AIPlantModal({ onClose, onCreated }) {
  const [step, setStep] = useState('upload'); // upload | loading | review
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setImageUrl('');
  }

  async function handleIdentify() {
    const source = imageFile || (imageUrl.trim() || null);
    if (!source) { setError('Seleccioná una imagen o ingresá una URL'); return; }
    setError('');
    setStep('loading');
    try {
      const res = await aiAPI.identify(source instanceof File ? source : imageUrl.trim());
      const data = res.data;
      setForm({
        name: data.name || '',
        type: data.type || '',
        tag: 'INTERIOR',
        caresSummary: data.caresSummary || '',
      });
      setStep('review');
    } catch {
      setError('Error al identificar la planta. Intentá con otra imagen.');
      setStep('upload');
    }
  }

  async function handleSave() {
    if (!form.name || !form.type || !form.tag) {
      setError('Completá nombre, tipo y ubicación');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const plantRes = await plantsAPI.create(form);
      const plant = plantRes.data;
      if (imageFile) {
        await plantsAPI.uploadImage(plant.id, imageFile).catch(() => {});
      }
      onCreated(plant);
      onClose();
    } catch {
      setError('Error al guardar la planta');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="w-full max-w-md bg-canvas-ice border border-stone-moss rounded-[20px] p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-adaline-ink">Agregar con IA</h2>
          <button onClick={onClose} className="text-slate-mist hover:text-adaline-ink text-xl">✕</button>
        </div>

        {step === 'upload' && (
          <>
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => inputRef.current?.click()}
              className={[
                'border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors',
                dragging ? 'border-valley-green bg-forest-dew/30' : 'border-mist-gray hover:border-valley-green',
              ].join(' ')}
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded-lg" />
              ) : (
                <>
                  <span className="text-3xl">📷</span>
                  <p className="text-[13px] text-slate-mist text-center">
                    Arrastrá una imagen o hacé click para seleccionar
                  </p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-stone-moss" />
              <span className="text-[12px] text-slate-mist">o URL</span>
              <div className="flex-1 h-px bg-stone-moss" />
            </div>

            <input
              className="input"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => { setImageUrl(e.target.value); setImageFile(null); setPreview(null); }}
            />

            {error && <p className="text-[13px] text-red-500">{error}</p>}

            <button
              onClick={handleIdentify}
              disabled={!imageFile && !imageUrl.trim()}
              className="btn-primary disabled:opacity-40"
            >
              Identificar planta
            </button>
          </>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-10 h-10 border-2 border-valley-green border-t-transparent rounded-full animate-spin" />
            <p className="text-[14px] text-slate-mist">Identificando planta...</p>
          </div>
        )}

        {step === 'review' && (
          <>
            <p className="text-[13px] text-slate-mist">Revisá y editá los datos antes de guardar.</p>
            <PlantForm values={form} onChange={setForm} loading={saving} />
            {error && <p className="text-[13px] text-red-500">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep('upload')} className="btn-secondary flex-1">
                ← Volver
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-40">
                {saving ? 'Guardando...' : 'Guardar planta'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
