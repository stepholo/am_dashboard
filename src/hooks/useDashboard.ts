
"use client";

import { useContext } from 'react';
import { DashboardContext, PaneContent } from '@/context/DashboardContext';

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export type { PaneContent };
