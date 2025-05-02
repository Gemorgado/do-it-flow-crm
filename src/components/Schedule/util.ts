
import { Resource } from "@/types/schedule";

export function getResourceColor(resource: Resource): string {
  switch (resource) {
    case "meet1":
      return "#3b82f6"; // blue-500
    case "meet2":
      return "#10b981"; // emerald-500
    case "meet3":
      return "#f59e0b"; // amber-500
    case "meet4":
      return "#6366f1"; // indigo-500
    case "auditorio":
      return "#8b5cf6"; // violet-500
    default:
      return "#6b7280"; // gray-500
  }
}

export function getResourceLabel(resource: Resource): string {
  switch (resource) {
    case "meet1":
      return "Meet 1";
    case "meet2":
      return "Meet 2";
    case "meet3":
      return "Meet 3";
    case "meet4":
      return "Meet 4";
    case "auditorio":
      return "Auditório";
    default:
      return resource;
  }
}
