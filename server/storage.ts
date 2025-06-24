import { users, waitlistEntries, type User, type InsertUser, type WaitlistEntry, type InsertWaitlistEntry } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
  getWaitlistCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlistEntries: Map<number, WaitlistEntry>;
  private waitlistEmailIndex: Map<string, number>;
  currentUserId: number;
  currentWaitlistId: number;

  constructor() {
    this.users = new Map();
    this.waitlistEntries = new Map();
    this.waitlistEmailIndex = new Map();
    this.currentUserId = 1;
    this.currentWaitlistId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    // Check if email already exists
    if (this.waitlistEmailIndex.has(insertEntry.email)) {
      throw new Error("Email already registered for waitlist");
    }

    const id = this.currentWaitlistId++;
    const entry: WaitlistEntry = {
      ...insertEntry,
      source: insertEntry.source || "landing",
      message: insertEntry.message || null,
      id,
      createdAt: new Date(),
    };
    
    this.waitlistEntries.set(id, entry);
    this.waitlistEmailIndex.set(insertEntry.email, id);
    return entry;
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    const id = this.waitlistEmailIndex.get(email);
    return id ? this.waitlistEntries.get(id) : undefined;
  }

  async getWaitlistCount(): Promise<number> {
    return this.waitlistEntries.size;
  }
}

export const storage = new MemStorage();
