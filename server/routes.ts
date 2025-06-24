import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistEntrySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Waitlist signup endpoint
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistEntrySchema.parse(req.body);
      
      // Check if email already exists
      const existingEntry = await storage.getWaitlistEntryByEmail(validatedData.email);
      if (existingEntry) {
        return res.status(409).json({ 
          message: "You're already on our waitlist! We'll be in touch soon." 
        });
      }

      const entry = await storage.createWaitlistEntry(validatedData);
      const waitlistCount = await storage.getWaitlistCount();
      
      res.status(201).json({ 
        message: "Successfully joined the waitlist!",
        position: waitlistCount,
        foundersSpotRemaining: Math.max(0, 1000 - waitlistCount)
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid email address. Please enter a valid email." 
        });
      }
      
      if (error instanceof Error && error.message.includes("already registered")) {
        return res.status(409).json({ 
          message: "You're already on our waitlist! We'll be in touch soon." 
        });
      }
      
      console.error("Waitlist signup error:", error);
      res.status(500).json({ 
        message: "Something went wrong. Please try again later." 
      });
    }
  });

  // Get waitlist stats
  app.get("/api/waitlist/stats", async (req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      res.json({
        totalSignups: count,
        foundersSpotRemaining: Math.max(0, 1000 - count)
      });
    } catch (error) {
      console.error("Waitlist stats error:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
