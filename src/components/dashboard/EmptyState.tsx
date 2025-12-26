import { Card } from "../ui/card";
import { Sheet } from "lucide-react";

export default function EmptyState({ message }: { message: string }) {
  return (
    <Card className="flex flex-1 items-center justify-center border-2 border-dashed bg-muted/30">
        <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
            <Sheet className="h-8 w-8" />
            <p className="text-sm">{message}</p>
        </div>
    </Card>
  );
}
