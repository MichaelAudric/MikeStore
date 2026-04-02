export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 animate-pulse space-y-4"
          >
            <div className="aspect-square bg-neutral-800 rounded-lg" />
            <div className="h-4 bg-neutral-800 rounded w-3/4" />
            <div className="h-4 bg-neutral-800 rounded w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
