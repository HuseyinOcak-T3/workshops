import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function MessagesLoading() {
  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-2">
          <CardHeader className="space-y-0 gap-y-4 pb-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardHeader>
          <CardContent className="p-0">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2 p-3">
              <Skeleton className="h-[70px] w-full" />
              <Skeleton className="h-[70px] w-full" />
              <Skeleton className="h-[70px] w-full" />
              <Skeleton className="h-[70px] w-full" />
              <Skeleton className="h-[70px] w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-5">
          <CardHeader>
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-4 w-[350px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-[60px] w-full" />
              <Skeleton className="h-[60px] w-[80%] ml-auto" />
              <Skeleton className="h-[60px] w-full" />
              <Skeleton className="h-[60px] w-[75%] ml-auto" />
              <Skeleton className="h-[60px] w-full" />
              <Skeleton className="h-10 w-full mt-8" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
