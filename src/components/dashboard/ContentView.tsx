
"use client";

import { Suspense } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { Button } from '../ui/button';
import { X, ArrowLeft, ExternalLink } from 'lucide-react';
import EmptyState from './EmptyState';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function IframePane({ url }: { url: string;}) {
    const iframeUrl = url.includes('docs.google.com') ? url.replace(/(&?)(rm=minimal|ui=false&?|embedded=true&?)/g, '') : url;
    
    return (
        <Card className="flex flex-1 flex-col overflow-hidden border-0 rounded-none h-full">
            <iframe
                key={iframeUrl} 
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
    openPanes,
    activePaneId,
    showGrid,
    closePane,
    setActivePane,
  } = useDashboard();
  
  if (viewMode === 'grid') return null;

  const activePane = openPanes.find(p => p.id === activePaneId);

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex items-center gap-2 p-4 border-b">
        <Button variant="outline" size="sm" onClick={showGrid}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Links
        </Button>
        {activePane && (
            <Button variant="outline" size="sm" onClick={() => window.open(activePane.url, '_blank')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
            </Button>
        )}
      </div>
      
      {openPanes.length > 0 ? (
        <Tabs value={activePaneId || ''} onValueChange={setActivePane} className="flex flex-1 flex-col bg-muted/30">
            <TabsList className="w-full justify-start rounded-none bg-transparent p-0 border-b pl-4">
                {openPanes.map((pane) => (
                <div key={pane.id} className="relative">
                    <TabsTrigger
                        value={pane.id}
                        className="h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-2 pr-8 text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                        {pane.name}
                    </TabsTrigger>
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
                </div>
                ))}
            </TabsList>
            {openPanes.map((pane) => (
                <TabsContent key={pane.id} value={pane.id} className="flex-1 mt-0">
                   <IframePane url={pane.url} />
                </TabsContent>
            ))}
        </Tabs>
      ) : (
        <div className="flex flex-1 p-4">
            <EmptyState message="Click a link to open it in the dashboard." />
        </div>
      )}
    </div>
  );
}


export default function ContentView() {
  return (
    <Suspense fallback={<div>Loading dashboard view...</div>}>
      <ContentViewComponent />
    </Suspense>
  )
}
