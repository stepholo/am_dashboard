"use client";

import React, { createContext, useState, useCallback } from 'react';

type PaneContent = {
  url: string;
  name: string;
} | null;

type ViewMode = 'grid' | 'single' | 'split';

interface DashboardContextType {
  viewMode: ViewMode;
  pane1: PaneContent;
  pane2: PaneContent;
  openInSinglePane: (url: string, name: string) => void;
  openInSplitPane: (url: string, name: string) => void;
  swapPanes: () => void;
  closePane: (pane: 'pane1' | 'pane2') => void;
  showGrid: () => void;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [pane1, setPane1] = useState<PaneContent>(null);
  const [pane2, setPane2] = useState<PaneContent>(null);

  const openInSinglePane = useCallback((url: string, name: string) => {
    setPane1({ url, name });
    setPane2(null);
    setViewMode('single');
  }, []);

  const openInSplitPane = useCallback((url: string, name: string) => {
    if (!pane1) {
        setPane1({ url, name });
    } else {
        setPane2({ url, name });
    }
    setViewMode('split');
  }, [pane1]);
  
  const swapPanes = useCallback(() => {
    setPane1(pane2);
    setPane2(pane1);
  }, [pane1, pane2]);

  const closePane = useCallback((pane: 'pane1' | 'pane2') => {
    if (pane === 'pane1') {
      setPane1(pane2);
      setPane2(null);
      if (!pane2) setViewMode('grid');
    } else {
      setPane2(null);
      if (!pane1) setViewMode('grid');
    }
  }, [pane1, pane2]);
  
  const showGrid = useCallback(() => {
    setViewMode('grid');
    setPane1(null);
    setPane2(null);
  }, []);

  const value = {
    viewMode,
    pane1,
    pane2,
    openInSinglePane,
    openInSplitPane,
    swapPanes,
    closePane,
    showGrid,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
