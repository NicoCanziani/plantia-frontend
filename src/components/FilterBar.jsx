const FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'INTERIOR', label: 'Interior' },
  { value: 'EXTERIOR', label: 'Exterior' },
  { value: 'recent', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguas' },
];

export default function FilterBar({ tag, sort, onTagChange, onSortChange }) {
  function handleFilter(value) {
    if (value === 'recent' || value === 'oldest') {
      onSortChange(value);
    } else {
      onTagChange(value);
    }
  }

  function isActive(value) {
    if (value === 'recent' || value === 'oldest') return sort === value;
    if (value === '') return !tag;
    return tag === value;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleFilter(value)}
          className={[
            'px-4 py-1.5 rounded-[20px] text-[13px] border transition-colors',
            isActive(value)
              ? 'bg-valley-green text-canvas-ice border-valley-green'
              : 'bg-canvas-ice text-adaline-ink border-stone-moss hover:border-valley-green',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
