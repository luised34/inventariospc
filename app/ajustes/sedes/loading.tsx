import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SedesLoading() {
  return (
    <div className="container py-10">
      <Skeleton className="h-8 w-64 mb-6" />
      <Skeleton className="h-4 w-full max-w-md mb-8" />

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <div className="h-10 px-4 border-b flex items-center">
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 px-4 border-b flex items-center justify-between">
                <Skeleton className="h-4 w-full max-w-sm" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
