export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white border border-zinc-100 rounded-2xl p-4 flex gap-4">
      <div className="w-24 h-24 bg-zinc-200 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 bg-zinc-200 rounded w-3/4" />
        <div className="h-3 bg-zinc-200 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-zinc-200 rounded-full w-16" />
          <div className="h-5 bg-zinc-200 rounded-full w-20" />
        </div>
        <div className="h-5 bg-zinc-200 rounded w-1/4" />
      </div>
    </div>
  )
}
