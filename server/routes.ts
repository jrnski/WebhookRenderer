import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { webhookRequestSchema } from "../shared/schema";
import fetch from "node-fetch";

const WEBHOOK_URL = "https://n8n.srv762943.hstgr.cloud/webhook/10eebb49-8820-4d71-a6cc-a919c88d3723";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a proxy endpoint for the webhook
  app.post("/api/webhook", async (req: Request, res: Response) => {
    try {
      // Validate the incoming request
      const validationResult = webhookRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validationResult.error.format() 
        });
      }
      
      // Forward the request to the actual webhook
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      
      // Get the response from the webhook
      const data = await response.json();
      
      // Send the webhook's response back to the client
      return res.status(response.status).json(data);
    } catch (error) {
      console.error("Webhook forwarding error:", error);
      return res.status(500).json({ 
        error: "Failed to forward request to webhook",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
