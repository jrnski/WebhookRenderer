import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since we're using the external webhook directly, 
  // we don't need any backend routes for this application
  
  const httpServer = createServer(app);
  return httpServer;
}
