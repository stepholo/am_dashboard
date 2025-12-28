"use client";

import { useDashboard } from '@/hooks/useDashboard';
import { Button } from '../ui/button';
import { X, ArrowLeft, RefreshCw, ExternalLink, Replace } from 'lucide-react';
import EmptyState from './EmptyState';
import { Card } from '../ui/card';

function IframePane({ url, name, onclose }: { url: string; name: string; onclose: () => void }) {
    // Google Sheets URLs with `rm=minimal` hide the toolbar. We want the full UI.
    const iframeUrl = url.replace('?rm=minimal', '');
    
    return (
        <Card className="flex flex-1 flex-col overflow-hidden">
             <div className="flex h-12 items-center justify-between border-b bg-muted/50 px-3">
                <p className="font-medium text-sm truncate">{name}</p>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(iframeUrl, '_blank')}>
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onclose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <iframe
                key={iframeUrl} // Re-renders iframe when URL changes
                src={iframeUrl}
                className="h-full w-full border-0"
                allow="clipboard-write"
            />
        </Card>
    )
}

export default function ContentView() {
  const { viewMode, pane1, pane2, showGrid, swapPanes, closePane } = useDashboard();
  
  if (viewMode === 'grid') return null;

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={showGrid}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Links
        </Button>
        {viewMode === 'split' && (
            <Button variant="outline" size="sm" onClick={swapPanes}>
                <Replace className="mr-2 h-4 w-4" />
                Swap
            </Button>
        )}
      </div>
      <div className="flex flex-1 gap-4">
        {pane1 ? (
            <IframePane url={pane1.url} name={pane1.name} onclose={() => closePane('pane1')} />
        ) : (
            viewMode === 'split' && <EmptyState message="Click a spreadsheet link to open it here." />
        )}
        {viewMode === 'split' && (
            pane2 ? (
                <IframePane url={pane2.url} name={pane2.name} onclose={() => closePane('pane2')} />
            ) : (
                <EmptyState message="Click another spreadsheet link to open it here." />
            )
        )}
      </div>
    </div>
  );
}
