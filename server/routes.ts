import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { webhookRequestSchema } from "../shared/schema";
import fetch from "node-fetch";

const WEBHOOK_URL = "https://n8n.srv762943.hstgr.cloud/webhook/10eebb49-8820-4d71-a6cc-a919c88d3723";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a proxy endpoint for the webhook using GET method
  app.get("/api/webhook", async (req: Request, res: Response) => {
    try {
      // Get text from the query parameter
      const text = req.query.text as string;
      
      if (!text) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          message: "Text parameter is required" 
        });
      }
      
      // Construct the URL with the text as a query parameter
      const webhookUrlWithParams = `${WEBHOOK_URL}?text=${encodeURIComponent(text)}`;
      
      // Forward the request to the actual webhook using GET
      const response = await fetch(webhookUrlWithParams, {
        method: "GET",
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
