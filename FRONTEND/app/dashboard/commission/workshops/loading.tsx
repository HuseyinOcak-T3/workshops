import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function WorkshopsLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
