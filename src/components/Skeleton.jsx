export function ListingSkeleton() {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full skeleton flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-28 skeleton rounded" />
          <div className="h-2.5 w-20 skeleton rounded" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border space-y-2">
        <div className="h-3.5 w-3/4 skeleton rounded" />
        <div className="h-3 w-full skeleton rounded" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border p-5">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full skeleton flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 skeleton rounded" />
            <div className="h-3 w-24 skeleton rounded" />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-10 skeleton rounded-lg" />
          <div className="h-10 skeleton rounded-lg" />
        </div>
      </div>
      <div className="rounded-xl border border-border p-5 space-y-3">
        <div className="h-3 w-20 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
      </div>
    </div>
  );
}
