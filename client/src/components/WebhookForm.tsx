import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { webhookRequestSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface WebhookFormProps {
  setResponse: (response: any) => void;
  setStatus: (status: { type: "error" | "success" | "none"; message: string }) => void;
}

export default function WebhookForm({ setResponse, setStatus }: WebhookFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(webhookRequestSchema),
    defaultValues: {
      text: "",
    },
  });
  
  const onSubmit = async (data: { text: string }) => {
    setIsLoading(true);
    // Set loading state by setting response to null and status to "none"
    setResponse(null);
    setStatus({ type: "none", message: "" });
    
    try {
      // Add a slight delay to see the loading animation (can be removed in production)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Call our proxy endpoint with GET method and query parameter
      const encodedText = encodeURIComponent(data.text);
      const response = await fetch(`/api/webhook?text=${encodedText}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const responseData = await response.json();
      setResponse(responseData);
      setStatus({
        type: "success",
        message: "Request successful",
      });
    } catch (error) {
      console.error("Error:", error);
      setResponse(null);
      setStatus({
        type: "error",
        message: error instanceof Error ? `Request failed: ${error.message}` : "Request failed",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">
                    Request payload
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your text here..."
                      className="h-32 font-mono text-sm resize-y focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <span>Sending...</span>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Send to Webhook"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
