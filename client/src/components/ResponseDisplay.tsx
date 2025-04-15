import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Code } from "lucide-react";
import { formatJson } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ResponseDisplayProps {
  response: any;
  status: {
    type: "error" | "success" | "none";
    message: string;
  };
}

export default function ResponseDisplay({ response, status }: ResponseDisplayProps) {
  const jsonRef = useRef<HTMLPreElement>(null);
  const { toast } = useToast();
  const hasResponse = response !== null;
  
  const handleCopyResponse = () => {
    if (!hasResponse || !jsonRef.current) return;
    
    const textToCopy = JSON.stringify(response, null, 2);
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "The response has been copied to your clipboard.",
          duration: 2000,
        });
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      });
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-neutral-800">Response</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyResponse}
            disabled={!hasResponse}
            className="text-primary hover:text-primary/80 disabled:text-neutral-400"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </div>

        {status.type !== "none" && (
          <div className="mb-4">
            <Alert variant={status.type === "error" ? "destructive" : "default"}>
              <AlertDescription>
                {status.message}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="bg-neutral-50 rounded-md p-4 h-64 overflow-auto font-mono text-sm border border-neutral-200">
          {!hasResponse ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400">
              <Code className="h-8 w-8 mb-2" />
              <p>JSON response will appear here</p>
            </div>
          ) : (
            <pre 
              ref={jsonRef} 
              dangerouslySetInnerHTML={{ __html: formatJson(response) }}
              className="whitespace-pre-wrap break-words"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
