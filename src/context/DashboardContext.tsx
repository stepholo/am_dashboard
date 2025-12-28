
"use client";

import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type PaneContent = {
  id: string; // Unique ID, can be the link ID
  url: string;
  name: string;
};

type ViewMode = 'grid' | 'dashboard';

interface DashboardContextType {
  viewMode: ViewMode;
  isFullScreen: boolean;
  openPanes: PaneContent[];
  activePaneId: string | null;
  
  openInDashboard: (pane: PaneContent) => void;
  showGrid: () => void;
  closePane: (paneId: string) => void;
  setActivePane: (paneId: string) => void;
  
  toggleFullScreen: () => void;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL or default
  const getInitialState = () => {
    const view = searchParams.get('view') as ViewMode | null;
    const panesString = searchParams.get('panes');
    const activeId = searchParams.get('active');
    
    let openPanes: PaneContent[] = [];
    if (panesString) {
      try {
        openPanes = JSON.parse(decodeURIComponent(panesString));
      } catch (e) {
        console.error("Failed to parse panes from URL", e);
      }
    }
    
    return {
      viewMode: view === 'dashboard' ? 'dashboard' : 'grid',
      openPanes,
      activePaneId: activeId ?? (openPanes.length > 0 ? openPanes[0].id : null),
    };
  };

  const [viewMode, setViewMode] = useState<ViewMode>(getInitialState().viewMode);
  const [openPanes, setOpenPanes] = useState<PaneContent[]>(getInitialState().openPanes);
  const [activePaneId, setActivePaneId] = useState<string | null>(getInitialState().activePaneId);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const updateUrl = (newView: ViewMode, newPanes: PaneContent[], newActiveId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newView === 'grid' || newPanes.length === 0) {
      params.delete('view');
      params.delete('panes');
      params.delete('active');
    } else {
      params.set('view', 'dashboard');
      params.set('panes', encodeURIComponent(JSON.stringify(newPanes)));
      if (newActiveId) {
        params.set('active', newActiveId);
      } else {
        params.delete('active');
      }
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  
  const openInDashboard = useCallback((pane: PaneContent) => {
    let newPanes = [...openPanes];
    const existingPaneIndex = newPanes.findIndex(p => p.id === pane.id);

    if (existingPaneIndex === -1) {
      newPanes = [...newPanes, pane];
    }
    
    setOpenPanes(newPanes);
    setActivePaneId(pane.id);
    setViewMode('dashboard');
    updateUrl('dashboard', newPanes, pane.id);
  }, [openPanes, router, pathname]);

  const showGrid = useCallback(() => {
    setViewMode('grid');
    updateUrl('grid', [], null);
  }, [router, pathname]);
  
  const closePane = useCallback((paneId: string) => {
    const newPanes = openPanes.filter(p => p.id !== paneId);
    setOpenPanes(newPanes);

    if (newPanes.length === 0) {
      showGrid();
    } else if (activePaneId === paneId) {
      const newActiveId = newPanes[newPanes.length - 1].id;
      setActivePaneId(newActiveId);
      updateUrl('dashboard', newPanes, newActiveId);
    } else {
      updateUrl('dashboard', newPanes, activePaneId);
    }
  }, [openPanes, activePaneId, showGrid]);
  
  const setActivePane = useCallback((paneId: string) => {
    setActivePaneId(paneId);
    updateUrl('dashboard', openPanes, paneId);
  }, [openPanes, router, pathname]);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);

  // Update state if URL changes from external navigation (e.g. back/forward buttons)
  useEffect(() => {
    const stateFromUrl = getInitialState();
    setViewMode(stateFromUrl.viewMode);
    setOpenPanes(stateFromUrl.openPanes);
    setActivePaneId(stateFromUrl.activePaneId);
  }, [searchParams]);

  const value = useMemo(() => ({
    viewMode,
    isFullScreen,
    openPanes,
    activePaneId,
    openInDashboard,
    showGrid,
    closePane,
    setActivePane,
    toggleFullScreen,
  }), [viewMode, isFullScreen, openPanes, activePaneId, openInDashboard, showGrid, closePane, setActivePane, toggleFullScreen]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
