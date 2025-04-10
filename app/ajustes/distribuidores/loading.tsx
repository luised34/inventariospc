import { Skeleton } from "@/components/ui/skeleton"

export default function DistribuidoresLoading() {
  return (
    <div className="container py-10">
      <Skeleton className="h-10 w-[250px] mb-6" />
      <Skeleton className="h-[500px] w-full rounded-md" />
    </div>
  )
}
