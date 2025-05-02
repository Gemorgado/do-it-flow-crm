
import { Resource } from "@/constants/resources";
import { RESOURCES } from "@/constants/resources";

export function getResourceLabel(resource: Resource): string {
  const resourceData = RESOURCES.find(r => r.id === resource);
  return resourceData ? resourceData.label : resource;
}

export function getResourceColor(resource: Resource): string {
  switch (resource) {
    case 'meet1':
      return '#4CAF50';  // green
    case 'meet2':
      return '#2196F3';  // blue
    case 'meet3':
      return '#FF9800';  // orange
    case 'meet4':
      return '#9C27B0';  // purple
    case 'auditorio':
      return '#F44336';  // red
    default:
      return '#757575';  // gray
  }
}
