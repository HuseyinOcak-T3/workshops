import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-12 w-full mb-6" />

      <div className="flex items-center space-x-4 my-6">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-40 w-full mb-4" />
      ))}
    </div>
  )
}
