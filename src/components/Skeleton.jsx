export function ListingSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#151230]">
      <div className="w-12 h-12 rounded-full shimmer flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 rounded shimmer" />
        <div className="h-3 w-48 rounded shimmer" />
        <div className="h-3 w-24 rounded shimmer" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-5 w-16 rounded-full shimmer" />
        <div className="h-3 w-14 rounded shimmer" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center py-8 space-y-4">
      <div className="w-20 h-20 rounded-full shimmer" />
      <div className="h-5 w-32 rounded shimmer" />
      <div className="h-4 w-24 rounded shimmer" />
    </div>
  );
}
