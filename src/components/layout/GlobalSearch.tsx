
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "use-debounce";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { DashboardLink } from "@/lib/types";
import { useDashboard } from "@/hooks/useDashboard";
import { useRouter } from "next/navigation";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

function GlobalSearch() {
  const router = useRouter();
  const { setSearchQuery: setGlobalSearchQuery, showGrid } = useDashboard();
  const db = useFirestore();
  const [localQuery, setLocalQuery] = useState("");
  const [debouncedQuery] = useDebounce(localQuery, 300);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allLinksQuery = useMemoFirebase(
    () => (db ? query(collection(db, "dashboardLinks"), orderBy("name")) : null),
    [db]
  );
  const { data: allLinks, isLoading } = useCollection<DashboardLink>(allLinksQuery);

  const filteredLinks = useMemo(() => {
    if (!debouncedQuery) return [];
    return allLinks?.filter(
      (link) =>
        link.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        link.description?.toLowerCase().includes(debouncedQuery.toLowerCase())
    ) ?? [];
  }, [debouncedQuery, allLinks]);

  const handleSelect = (link: DashboardLink) => {
    setIsOpen(false);
    setLocalQuery("");
    if (link.type === 'embed') {
        router.push(`/${link.section}?view=dashboard&panes=${encodeURIComponent(JSON.stringify([{id: link.id, name: link.name, url: link.url}]))}&active=${link.id}`);
    } else if (link.type === 'protocol') {
        window.location.href = link.url;
    } else {
        window.open(link.url, '_blank');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && localQuery) {
        setGlobalSearchQuery(localQuery);
        setIsOpen(false);
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-sm">
             <Button
                variant="outline"
                className="w-full justify-start text-sm text-muted-foreground"
                onClick={() => setIsOpen(true)}
            >
                <Search className="mr-2 h-4 w-4" />
                Search all links...
                <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
                    <span className="text-lg">⌘</span>K
                </kbd>
            </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
         <Command shouldFilter={false}>
          <CommandInput
            ref={inputRef}
            value={localQuery}
            onValueChange={setLocalQuery}
            onKeyDown={handleKeyDown}
            placeholder="Search all links..."
            className="h-11"
          />
          <CommandList>
            {isLoading && debouncedQuery && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    <p>Loading links...</p>
                </div>
            )}
            {!isLoading && debouncedQuery && filteredLinks.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
            )}
            {filteredLinks.length > 0 && (
              <CommandGroup heading="Suggestions">
                {filteredLinks.map((link) => (
                  <CommandItem key={link.id} onSelect={() => handleSelect(link)} value={link.name}>
                    {link.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default GlobalSearch;
