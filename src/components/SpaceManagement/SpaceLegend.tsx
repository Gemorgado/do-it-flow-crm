
import React from "react";

export function SpaceLegend() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-100 border border-green-200 rounded-sm mr-2"></div>
        <span className="text-sm text-gray-600">Disponível</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-red-100 border border-red-200 rounded-sm mr-2"></div>
        <span className="text-sm text-gray-600">Ocupado</span>
      </div>
    </div>
  );
}
