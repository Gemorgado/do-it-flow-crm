
import { TabKey } from "@/modules/settings/users/types";

export const TAB_KEYS: TabKey[] = [
  'PIPELINE',
  'PIPELINE_PROGRESS',
  'GROWTH',
  'REPORTS',
  'OCCUPANCY_MAP',
];

export function isTabKey(value: unknown): value is TabKey {
  return typeof value === 'string' && TAB_KEYS.includes(value as TabKey);
}

export function toTabKeyArray(arr?: unknown[]): TabKey[] {
  return (arr ?? []).filter(isTabKey) as TabKey[];
}
