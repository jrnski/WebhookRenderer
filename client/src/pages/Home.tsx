import WebhookForm from "@/components/WebhookForm";
import ResponseDisplay from "@/components/ResponseDisplay";
import { useState } from "react";

export default function Home() {
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<{
    type: "error" | "success" | "none";
    message: string;
  }>({
    type: "none",
    message: "",
  });
  
  return (
    <div className="min-h-screen p-4 md:p-8 bg-neutral-100">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-medium text-neutral-800">Webhook Request Tester</h1>
          <p className="text-neutral-600">Enter text and send it to the webhook. The JSON response will display below.</p>
        </header>

        <WebhookForm 
          setResponse={setResponse} 
          setStatus={setStatus} 
        />
        
        <ResponseDisplay 
          response={response} 
          status={status}
        />
      </div>
    </div>
  );
}
