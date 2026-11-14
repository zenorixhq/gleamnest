export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-3 w-12 bg-stone-200/80 rounded-md" />
        <span className="text-stone-300">/</span>
        <div className="h-3 w-16 bg-stone-200/80 rounded-md" />
        <span className="text-stone-300">/</span>
        <div className="h-3 w-28 bg-stone-200/80 rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery Column Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-stone-200/80 border border-stone-200/60 shadow-xs" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-stone-200/70 border border-stone-200/50" />
            ))}
          </div>
        </div>

        {/* Details Column Skeleton */}
        <div className="space-y-6 pt-2">
          {/* Badge & Category */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 bg-stone-200/70 rounded-full" />
            <div className="h-4 w-24 bg-stone-200/70 rounded-full" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="h-8 w-3/4 bg-stone-200/90 rounded-lg" />
            <div className="h-5 w-1/2 bg-stone-200/70 rounded-md" />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 pt-2">
            <div className="h-9 w-28 bg-stone-300/80 rounded-lg" />
            <div className="h-5 w-20 bg-stone-200/60 rounded-md" />
          </div>

          {/* Feature Badge */}
          <div className="h-10 w-full bg-[#FAF8F5] border border-stone-200/60 rounded-xl" />

          {/* Color Switcher Skeleton */}
          <div className="space-y-2.5 pt-2">
            <div className="h-4 w-28 bg-stone-200/70 rounded-md" />
            <div className="flex gap-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 w-24 bg-stone-200/70 rounded-xl border border-stone-200/60" />
              ))}
            </div>
          </div>

          {/* Size Selector Skeleton */}
          <div className="space-y-2.5 pt-2">
            <div className="h-4 w-24 bg-stone-200/70 rounded-md" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 w-20 bg-stone-200/70 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Add to Cart Button Skeleton */}
          <div className="pt-4">
            <div className="h-13 w-full bg-[#4A171C]/20 rounded-xl" />
          </div>

          {/* Value Props Skeleton */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-200/60">
            <div className="h-14 bg-stone-100 rounded-xl" />
            <div className="h-14 bg-stone-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
