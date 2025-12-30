
"use client";

import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type PaneContent = {
  id: string; // Unique ID, can be the link ID
  url: string;
  name: string;
};

type ViewMode = 'grid' | 'dashboard' | 'search';

interface DashboardContextType {
  viewMode: ViewMode;
  openPanes: PaneContent[];
  activePaneId: string | null;
  searchQuery: string;
  
  openInDashboard: (pane: PaneContent) => void;
  showGrid: () => void;
  closePane: (paneId: string) => void;
  setActivePane: (paneId: string) => void;
  setSearchQuery: (query: string) => void;
  enterSearchMode: () => void;
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
    const query = searchParams.get('q') || '';
    
    let openPanes: PaneContent[] = [];
    if (panesString) {
      try {
        openPanes = JSON.parse(decodeURIComponent(panesString));
      } catch (e) {
        console.error("Failed to parse panes from URL", e);
      }
    }
    
    let initialViewMode: ViewMode = 'grid';
    if (query) {
      initialViewMode = 'search';
    } else if (view === 'dashboard') {
      initialViewMode = 'dashboard';
    }

    return {
      viewMode: initialViewMode,
      openPanes,
      activePaneId: activeId ?? (openPanes.length > 0 ? openPanes[0].id : null),
      searchQuery: query,
    };
  };

  const initialState = getInitialState();
  const [viewMode, setViewMode] = useState<ViewMode>(initialState.viewMode);
  const [openPanes, setOpenPanes] = useState<PaneContent[]>(initialState.openPanes);
  const [activePaneId, setActivePaneId] = useState<string | null>(initialState.activePaneId);
  const [searchQuery, _setSearchQuery] = useState<string>(initialState.searchQuery);

  const updateUrl = useCallback((paramsToUpdate: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const setSearchQuery = useCallback((query: string) => {
    _setSearchQuery(query);
    if (query) {
      setViewMode('search');
      updateUrl({ view: 'search', q: query });
    } else {
      setViewMode('grid');
      updateUrl({ view: null, q: null });
    }
  }, [updateUrl]);

  const enterSearchMode = useCallback(() => {
    setViewMode('search');
    updateUrl({ view: 'search' });
  }, [updateUrl]);
  
  const openInDashboard = useCallback((pane: PaneContent) => {
    let newPanes = [...openPanes];
    const existingPaneIndex = newPanes.findIndex(p => p.id === pane.id);

    if (existingPaneIndex === -1) {
      newPanes = [...newPanes, pane];
    }
    
    setOpenPanes(newPanes);
    setActivePaneId(pane.id);
    setViewMode('dashboard');
    updateUrl({ 
      view: 'dashboard', 
      panes: encodeURIComponent(JSON.stringify(newPanes)),
      active: pane.id,
      q: null
    });
  }, [openPanes, updateUrl]);

  const showGrid = useCallback(() => {
    setViewMode('grid');
    _setSearchQuery('');
    updateUrl({ view: null, panes: null, active: null, q: null });
  }, [updateUrl]);
  
  const closePane = useCallback((paneId: string) => {
    const newPanes = openPanes.filter(p => p.id !== paneId);
    setOpenPanes(newPanes);

    if (newPanes.length === 0) {
      showGrid();
    } else if (activePaneId === paneId) {
      const newActiveId = newPanes[newPanes.length - 1].id;
      setActivePaneId(newActiveId);
      updateUrl({
        view: 'dashboard',
        panes: encodeURIComponent(JSON.stringify(newPanes)),
        active: newActiveId
      });
    } else {
      updateUrl({
        view: 'dashboard',
        panes: encodeURIComponent(JSON.stringify(newPanes)),
        active: activePaneId
      });
    }
  }, [openPanes, activePaneId, showGrid, updateUrl]);
  
  const setActivePane = useCallback((paneId: string) => {
    setActivePaneId(paneId);
    updateUrl({ active: paneId });
  }, [updateUrl]);

  useEffect(() => {
    const stateFromUrl = getInitialState();
    setViewMode(stateFromUrl.viewMode);
    setOpenPanes(stateFromUrl.openPanes);
    setActivePaneId(stateFromUrl.activePaneId);
    _setSearchQuery(stateFromUrl.searchQuery);
  }, [searchParams]);

  const value = useMemo(() => ({
    viewMode,
    openPanes,
    activePaneId,
    searchQuery,
    openInDashboard,
    showGrid,
    closePane,
    setActivePane,
    setSearchQuery,
    enterSearchMode,
  }), [viewMode, openPanes, activePaneId, searchQuery, openInDashboard, showGrid, closePane, setActivePane, setSearchQuery, enterSearchMode]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
