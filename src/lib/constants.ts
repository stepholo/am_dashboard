import type { LucideIcon } from "lucide-react";
import { Settings, FileText, Wrench, BarChart, SlidersHorizontal, ChevronsLeft, ChevronsRight, User } from "lucide-react";

export const ADMIN_EMAIL = "stephen@hellotractor.com";
export const ALLOWED_DOMAIN = "hellotractor.com";

export type Section = {
  name: string;
  slug: string;
  icon: LucideIcon;
};

export const SECTIONS: Section[] = [
  { name: 'PAYG Operations', slug: 'payg-operations', icon: Settings },
  { name: 'Invoicing', slug: 'invoicing', icon: FileText },
  { name: 'Tractor Service', slug: 'tractor-service', icon: Wrench },
  { name: 'Reports', slug: 'reports', icon: BarChart },
  { name: 'Utilities', slug: 'utilities', icon: SlidersHorizontal },
  { name: 'Personal Links', slug: 'personal-links', icon: User },
];

export const Icons = {
  ChevronsLeft,
  ChevronsRight,
};
