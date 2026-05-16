import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function LikeListSkleton() {
  return (
    <div>
        <div
                 
                  className="p-2 flex items-center gap-3 border-b border-borderColor animate-pulse"
                >
                  <Skeleton className="w-8 h-8 bg-gray-300 rounded-full"/>
                  <Skeleton className="h-4 bg-gray-300 rounded w-1/4"/>
                </div>
    </div>
  )
}

export default LikeListSkleton