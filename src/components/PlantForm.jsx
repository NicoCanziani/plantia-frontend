export default function PlantForm({ values, onChange, loading }) {
  function handle(field) {
    return (e) => onChange({ ...values, [field]: e.target.value });
  }

  return (
    <div className="flex flex-col gap-4">
      <Field label="Nombre">
        <input
          className="input"
          placeholder="ej. Potus, Suculenta"
          value={values.name}
          onChange={handle('name')}
          disabled={loading}
        />
      </Field>

      <Field label="Tipo / Especie">
        <input
          className="input"
          placeholder="ej. Epipremnum aureum"
          value={values.type}
          onChange={handle('type')}
          disabled={loading}
        />
      </Field>

      <Field label="Ubicación">
        <div className="flex gap-2">
          {['INTERIOR', 'EXTERIOR'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ ...values, tag: t })}
              className={[
                'flex-1 py-2 rounded-[20px] text-[13px] border transition-colors',
                values.tag === t
                  ? t === 'INTERIOR'
                    ? 'bg-forest-dew text-valley-green border-forest-dew'
                    : 'bg-stone-moss text-deep-earth border-stone-moss'
                  : 'bg-canvas-ice text-slate-mist border-stone-moss hover:border-adaline-ink',
              ].join(' ')}
            >
              {t === 'INTERIOR' ? 'Interior' : 'Exterior'}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Resumen de cuidados">
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="Riego, luz, temperatura..."
          value={values.caresSummary}
          onChange={handle('caresSummary')}
          disabled={loading}
        />
      </Field>
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
