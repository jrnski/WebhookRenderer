import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Code, Loader2 } from "lucide-react";
import { formatJson } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ResponseDisplayProps {
  response: any;
  status: {
    type: "error" | "success" | "none";
    message: string;
  };
  isLoading: boolean;
}

export default function ResponseDisplay({ response, status, isLoading }: ResponseDisplayProps) {
  const jsonRef = useRef<HTMLPreElement>(null);
  const { toast } = useToast();
  const hasResponse = response !== null;
  const [loadingMessage, setLoadingMessage] = useState<string>("Initializing connection...");
  
  // Array of loading messages that will change every second
  const loadingMessages = [
    "Contacting webhook...",
    "Awaiting response...",
    "Processing data...",
    "Almost there...",
    "Reading response...",
    "Parsing information..."
  ];
  
  // Effect to handle the loading messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading) {
      let index = 0;
      // Change message every second
      interval = setInterval(() => {
        setLoadingMessage(loadingMessages[index % loadingMessages.length]);
        index++;
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);
  
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
        <div className="flex justify-end mb-4">
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

        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md p-8 h-64 overflow-auto flex flex-col items-center justify-center">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-primary animate-ping"></div>
                </div>
              </div>
              <p className="text-primary font-medium text-lg mb-2">{loadingMessage}</p>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 rounded-full bg-primary/30 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "450ms" }}></div>
              </div>
            </div>
          ) : !hasResponse ? (
            <div className="bg-neutral-50 rounded-md p-4 h-64 overflow-auto flex flex-col items-center justify-center text-neutral-400">
              <Code className="h-8 w-8 mb-2" />
              <p>Response will appear here</p>
            </div>
          ) : (
            <div>
              <h3 className="text-md font-medium mb-2">Response:</h3>
              {response.output && response.output.response ? (
                <div 
                  className="bg-white rounded-md p-4 border border-neutral-200 prose prose-sm max-w-none min-h-[200px]"
                  dangerouslySetInnerHTML={{ __html: response.output.response }}
                />
              ) : response.error ? (
                <div className="bg-red-50 rounded-md p-4 border border-red-200 text-red-800 min-h-[200px]">
                  <h4 className="font-semibold mb-2">Error:</h4>
                  <p>{response.error}</p>
                  {response.message && <p className="mt-2">{response.message}</p>}
                  {response.hint && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <strong>Hint:</strong> {response.hint}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-md p-4 border border-neutral-200 prose prose-sm max-w-none min-h-[200px]">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
