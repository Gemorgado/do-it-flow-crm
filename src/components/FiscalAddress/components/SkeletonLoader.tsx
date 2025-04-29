
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonLoader: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <Card key={i}>
          <CardHeader className="p-4">
            <Skeleton className="h-4 w-1/2 mb-2" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Skeleton className="h-8 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map(i => (
        <Card key={i}>
          <CardHeader className="p-4">
            <Skeleton className="h-4 w-1/3 mb-2" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Skeleton className="h-[200px] w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
