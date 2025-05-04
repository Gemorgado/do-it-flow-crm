
import { ServiceType, SERVICE_DISPLAY_LABELS } from "@/types/service";

export const SERVICE_OPTIONS = [
  { value: 'fiscal_address', label: SERVICE_DISPLAY_LABELS.fiscal_address },
  { value: 'flex_desk',      label: SERVICE_DISPLAY_LABELS.flex_desk },
  { value: 'fixed_desk',     label: SERVICE_DISPLAY_LABELS.fixed_desk },
  { value: 'private_office', label: SERVICE_DISPLAY_LABELS.private_office },
  { value: 'meeting_room',   label: SERVICE_DISPLAY_LABELS.meeting_room },
  { value: 'auditorium',     label: SERVICE_DISPLAY_LABELS.auditorium },
] as const;

// Use "export type" instead of just "export" for re-exporting types when isolatedModules is enabled
export type { ServiceType };
