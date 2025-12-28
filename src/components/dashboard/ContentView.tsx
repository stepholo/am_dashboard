
"use client";

import { Suspense } from 'react';
import { useDashboard, PaneContent } from '@/hooks/useDashboard';
import { Button } from '../ui/button';
import { X, ArrowLeft, ExternalLink, Minimize, Maximize } from 'lucide-react';
import EmptyState from './EmptyState';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function IframePane({ url, name }: { url: string; name: string;}) {
    // Google Sheets URLs with `rm=minimal` hide the toolbar. We want the full UI.
    const iframeUrl = url.includes('docs.google.com') ? url.replace('rm=minimal', 'ui=false&amp;embedded=true') : url;
    
    return (
        <Card className="flex flex-1 flex-col overflow-hidden border-0 rounded-none">
            <iframe
                key={iframeUrl} // Re-renders iframe when URL changes
                src={iframeUrl}
                className="h-full w-full border-0"
                allow="clipboard-write"
            />
        </Card>
    )
}

function ContentViewComponent() {
  const { 
    viewMode,
    isFullScreen,
    openPanes,
    activePaneId,
    showGrid,
    closePane,
    setActivePane,
    toggleFullScreen,
  } = useDashboard();
  
  if (viewMode === 'grid') return null;

  const activePane = openPanes.find(p => p.id === activePaneId);

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={showGrid}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Links
        </Button>
        <Button variant="outline" size="sm" onClick={toggleFullScreen}>
            {isFullScreen ? <Minimize className="mr-2 h-4 w-4" /> : <Maximize className="mr-2 h-4 w-4" />}
            {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
        </Button>
        {activePane && (
            <Button variant="outline" size="sm" onClick={() => window.open(activePane.url, '_blank')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
            </Button>
        )}
      </div>
      
      {openPanes.length > 0 ? (
        <Tabs value={activePaneId || ''} onValueChange={setActivePane} className="flex flex-1 flex-col">
            <TabsList className="w-full justify-start rounded-none bg-transparent p-0 border-b">
                {openPanes.map((pane) => (
                <TabsTrigger 
                    key={pane.id} 
                    value={pane.id}
                    className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-2 text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                    {pane.name}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1.5 h-6 w-6"
                        onClick={(e) => {
                            e.stopPropagation();
                            closePane(pane.id);
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </TabsTrigger>
                ))}
            </TabsList>
            {openPanes.map((pane) => (
                <TabsContent key={pane.id} value={pane.id} className="flex-1 mt-0">
                   <IframePane url={pane.url} name={pane.name} />
                </TabsContent>
            ))}
        </Tabs>
      ) : (
        <EmptyState message="Click a link to open it in the dashboard." />
      )}
    </div>
  );
}


export default function ContentView() {
  return (
    // The Suspense boundary is important for when the context is initialized from search params
    <Suspense fallback={<div>Loading dashboard view...</div>}>
      <ContentViewComponent />
    </Suspense>
  )
}
