export default function SkeletonCard() {
  return (
    <div className="animate-pulse grid items-center gap-4 px-5 py-4 sm:grid-cols-[56px_1fr_auto_auto_auto_auto]">
      <div className="h-10 w-10 bg-slate-200 hidden sm:block" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 w-3/4" />
        <div className="h-3 bg-slate-200 w-1/2" />
      </div>
      <div className="h-4 bg-slate-200 w-12 hidden sm:block" />
      <div className="h-4 bg-slate-200 w-14 hidden sm:block" />
      <div className="h-4 bg-slate-200 w-20 hidden sm:block" />
      <div className="h-8 bg-slate-200 w-16 hidden sm:block" />
    </div>
  )
}

export function SkeletonList({ count = 6 }) {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
