export function ListingSkeleton() {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-3 skeleton rounded-md w-3/4" />
          <div className="h-2.5 skeleton rounded-md w-1/2" />
        </div>
      </div>
      <div className="h-3 skeleton rounded-md w-2/3" />
      <div className="flex gap-2 pt-1">
        <div className="h-5 w-16 skeleton rounded-full" />
        <div className="h-5 w-12 skeleton rounded-full ml-auto" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full skeleton" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 skeleton rounded-md w-1/2" />
            <div className="h-3 skeleton rounded-md w-1/3" />
          </div>
        </div>
      </div>
      <div className="bg-bg-card rounded-xl border border-border p-5 space-y-3">
        <div className="h-3 skeleton rounded-md w-1/4" />
        <div className="h-12 skeleton rounded-lg" />
      </div>
    </div>
  );
}
