export function SkeletonCard() {
  return (
    <div className="flex flex-col bg-canvas-ice border border-stone-moss rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-stone-moss/50" />
      <div className="px-6 py-4 flex flex-col gap-2">
        <div className="h-4 bg-stone-moss/50 rounded-md w-3/4" />
        <div className="h-3 bg-stone-moss/30 rounded-md w-1/2" />
        <div className="h-3 bg-stone-moss/30 rounded-md w-1/3 mt-1" />
      </div>
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-stone-moss last:border-0 animate-pulse">
      <div className="w-12 h-12 rounded-lg bg-stone-moss/50 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-stone-moss/50 rounded-md w-2/3 mb-2" />
        <div className="h-3 bg-stone-moss/30 rounded-md w-1/2" />
      </div>
      <div className="h-5 w-16 bg-stone-moss/30 rounded-full shrink-0" />
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl animate-pulse">
      <div className="h-4 w-24 bg-stone-moss/30 rounded-md" />
      <div className="aspect-[16/7] bg-stone-moss/50 rounded-lg" />
      <div className="flex flex-col gap-2">
        <div className="h-8 bg-stone-moss/50 rounded-md w-1/2" />
        <div className="h-4 bg-stone-moss/30 rounded-md w-1/3" />
      </div>
      <div className="bg-canvas-ice border border-stone-moss rounded-lg p-6 flex flex-col gap-3">
        <div className="h-5 bg-stone-moss/50 rounded-md w-1/4" />
        <div className="h-4 bg-stone-moss/30 rounded-md w-full" />
        <div className="h-4 bg-stone-moss/30 rounded-md w-5/6" />
        <div className="h-4 bg-stone-moss/30 rounded-md w-4/6" />
      </div>
    </div>
  );
}
