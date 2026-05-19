export default function ViewToggle({ view, onChange }) {
  return (
    <div className="flex gap-1 bg-stone-moss/30 rounded-[20px] p-1">
      {['grid', 'list'].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={[
            'px-4 py-1.5 rounded-[16px] text-[13px] transition-colors',
            view === v
              ? 'bg-canvas-ice text-adaline-ink shadow-sm'
              : 'text-slate-mist hover:text-adaline-ink',
          ].join(' ')}
        >
          {v === 'grid' ? 'Cards' : 'Lista'}
        </button>
      ))}
    </div>
  );
}
