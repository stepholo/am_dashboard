
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export const ADMIN_EMAIL = "stephen@hellotractor.com";
export const ALLOWED_DOMAIN = "hellotractor.com";

export const Icons = {
  ChevronsLeft,
  ChevronsRight,
};

export const initialSections = [
  { name: 'PAYG Pipeline', slug: 'payg-pipeline', icon: 'Settings', order: 0 },
  { name: 'Invoicing', slug: 'invoicing', icon: 'FileText', order: 1 },
  { name: 'Tractor Service', slug: 'tractor-service', icon: 'Wrench', order: 2 },
  { name: 'Reports', slug: 'reports', icon: 'BarChart', order: 3 },
  { name: 'Utilities', slug: 'utilities', icon: 'SlidersHorizontal', order: 4 },
  { name: 'Personal Links', slug: 'personal-links', icon: 'User', order: 5 },
];
