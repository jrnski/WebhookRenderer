import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
          {!hasResponse ? (
            <div className="bg-neutral-50 rounded-md p-4 h-64 overflow-auto flex flex-col items-center justify-center text-neutral-400">
              <Code className="h-8 w-8 mb-2" />
              <p>Response will appear here</p>
            </div>
          ) : response.output && response.output.response ? (
            <div>
              <h3 className="text-md font-medium mb-2">Response:</h3>
              <div 
                className="bg-white rounded-md p-4 border border-neutral-200 prose prose-sm max-w-none min-h-[200px]"
                dangerouslySetInnerHTML={{ __html: response.output.response }}
              />
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-md p-4 h-64 overflow-auto">
              <p className="text-neutral-600">No response content available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
