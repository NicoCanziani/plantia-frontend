import { Link } from 'react-router-dom';

function formatDate(str) {
  const d = new Date(str);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

const TAG_STYLES = {
  INTERIOR: 'bg-forest-dew text-valley-green',
  EXTERIOR: 'bg-stone-moss text-deep-earth',
};

export default function PlantListItem({ plant }) {
  return (
    <Link
      to={`/plants/${plant.id}`}
      className="flex items-center gap-4 py-3 border-b border-stone-moss last:border-0 hover:bg-canvas-ice/50 transition-colors"
    >
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-moss/30 shrink-0">
        {plant.imageUrl ? (
          <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl text-slate-mist">🌿</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-adaline-ink truncate">{plant.name}</p>
        <p className="font-mono text-[12px] text-slate-mist truncate">
          {plant.type} · {formatDate(plant.addedAt)}
        </p>
      </div>

      {/* Tag */}
      <span
        className={`font-mono text-[11px] px-2 py-0.5 rounded-full shrink-0 ${TAG_STYLES[plant.tag] ?? ''}`}
      >
        {plant.tag}
      </span>
    </Link>
  );
}
