export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-start animate-pulse pt-12">
      {/* Image skeleton */}
      <div className="w-150 h-[500px] bg-neutral-800 rounded-lg" />

      {/* Text skeleton */}
      <div className="px-8 space-y-4 w-full">
        <div className="h-8 bg-neutral-800 rounded w-2/3" />
        <div className="h-6 bg-neutral-800 rounded w-1/4" />
        <div className="h-4 bg-neutral-800 rounded w-full" />
        <div className="h-4 bg-neutral-800 rounded w-5/6" />
        <div className="h-4 bg-neutral-800 rounded w-3/4" />
      </div>
    </div>
  );
}
