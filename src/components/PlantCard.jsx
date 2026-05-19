import { Link } from 'react-router-dom';

function formatDate(str) {
  const d = new Date(str);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

const TAG_STYLES = {
  INTERIOR: 'bg-forest-dew text-valley-green',
  EXTERIOR: 'bg-stone-moss text-deep-earth',
};

export default function PlantCard({ plant }) {
  return (
    <Link
      to={`/plants/${plant.id}`}
      className="group flex flex-col bg-canvas-ice border border-stone-moss rounded-lg overflow-hidden transition-shadow hover:shadow-subtle"
      style={{ boxShadow: 'rgba(99, 143, 61, 0.1) 0px 0px 0px 1px' }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-stone-moss/30 overflow-hidden">
        {plant.imageUrl ? (
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-slate-mist">
            🌿
          </div>
        )}
        {/* Tag */}
        <span
          className={`absolute top-2 right-2 font-mono text-[11px] px-2 py-0.5 rounded-full ${TAG_STYLES[plant.tag] ?? ''}`}
        >
          {plant.tag}
        </span>
      </div>

      {/* Info */}
      <div className="px-6 py-4 flex flex-col gap-1">
        <p className="text-[18px] font-medium text-adaline-ink leading-tight">{plant.name}</p>
        <p className="font-mono text-[12px] text-slate-mist">{plant.type}</p>
        <p className="font-mono text-[12px] text-slate-mist mt-1">{formatDate(plant.addedAt)}</p>
      </div>
    </Link>
  );
}
