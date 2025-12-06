import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertLinkSchema, insertCategorySchema, insertTagSchema, insertPlaylistSchema, insertPlaylistLinkSchema, insertShareSchema } from "@shared/schema";
import { z } from "zod";

// Partial update schemas for validation
const updateLinkSchema = insertLinkSchema.partial().omit({ userId: true });
const updateCategorySchema = insertCategorySchema.partial().omit({ userId: true });
const updateTagSchema = insertTagSchema.partial().omit({ userId: true });
const updatePlaylistSchema = insertPlaylistSchema.partial().omit({ userId: true });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(dbUser);
  });

  // ============== LINKS ==============
  
  // Get all links for current user
  app.get("/api/links", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const links = await storage.getLinks(user.claims.sub);
    res.json(links);
  });

  // Get single link (must be owner)
  app.get("/api/links/:id", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const link = await storage.getLinkById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    if (link.userId !== user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(link);
  });

  // Create link
  app.post("/api/links", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const parsed = insertLinkSchema.safeParse({ ...req.body, userId: user.claims.sub });
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    }
    const link = await storage.createLink(parsed.data);
    
    await storage.createActivity({
      userId: user.claims.sub,
      type: "link_added",
      title: "Added a new link",
      description: link.title || link.url,
    });
    
    res.status(201).json(link);
  });

  // Update link (must be owner)
  app.patch("/api/links/:id", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const link = await storage.getLinkById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    if (link.userId !== user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const parsed = updateLinkSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    }
    const updated = await storage.updateLink(req.params.id, parsed.data);
    res.json(updated);
  });

  // Delete link (must be owner)
  app.delete("/api/links/:id", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const link = await storage.getLinkById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    if (link.userId !== user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await storage.deleteLink(req.params.id);
    res.status(204).send();
  });

  // Increment view count (must be owner)
  app.post("/api/links/:id/view", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const link = await storage.getLinkById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    if (link.userId !== user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await storage.incrementViewCount(req.params.id);
    res.status(200).json({ success: true });
  });

  // ============== CATEGORIES ==============
  
  app.get("/api/categories", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const categories = await storage.getCategories(user.claims.sub);
    res.json(categories);
  });

  app.post("/api/categories", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const parsed = insertCategorySchema.safeParse({ ...req.body, userId: user.claims.sub });
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    }
    const category = await storage.createCategory(parsed.data);
    res.status(201).json(category);
  });

  app.patch("/api/categories/:id", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const category = await storage.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (category.userId !== user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const parsed = updateCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    }
    const updated = await storage.updateCategory(req.params.id, parsed.data);
    res.json(updated);
  });

  app.delete("/api/categories/:id", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const category = await storage.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (category.userId !== user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await storage.deleteCategory(req.params.id);
    res.status(204).send();
  });

  // ============== TAGS ==============
  
  app.get("/api/tags", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const tags = await storage.getTags(user.claims.sub);
    res.json(tags);
  });

  app.post("/api/tags", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const parsed = insertTagSchema.safeParse({ ...req.body, userId: user.claims.sub });
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    }
    const tag = await storage.createTag(parsed.data);
    res.status(201).json(tag);
  });

  app.patch("/api/tags/:id", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const tag = await storage.getTagById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    if (tag.userId !== user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const parsed = updateTagSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    }
    const updated = await storage.updateTag(req.params.id, parsed.data);
    res.json(updated);
  });

  app.delete("/api/tags/:id", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const tag = await storage.getTagById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    if (tag.userId !== user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await storage.deleteTag(req.params.id);
    res.status(204).send();
  });

  // ============== PLAYLISTS ==============
  
  app.get("/api/playlists", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const playlists = await storage.getPlaylists(user.claims.sub);
    res.json(playlists);
  });

  app.get("/api/playlists/:id", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const playlist = await storage.getPlaylistById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    if (playlist.userId !== user.claims.sub && !playlist.isPublic) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(playlist);
  });

  app.get("/api/playlists/:id/links", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const playlist = await storage.getPlaylistById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    if (playlist.userId !== user.claims.sub && !playlist.isPublic) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const links = await storage.getPlaylistLinks(req.params.id);
    res.json(links);
  });

  app.post("/api/playlists", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const parsed = insertPlaylistSchema.safeParse({ ...req.body, userId: user.claims.sub });
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    }
    const playlist = await storage.createPlaylist(parsed.data);
    
    await storage.createActivity({
      userId: user.claims.sub,
      type: "playlist_created",
      title: "Created a new playlist",
      description: playlist.name,
    });
    
    res.status(201).json(playlist);
  });

  app.patch("/api/playlists/:id", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const playlist = await storage.getPlaylistById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    if (playlist.userId !== user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const parsed = updatePlaylistSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    }
    const updated = await storage.updatePlaylist(req.params.id, parsed.data);
    res.json(updated);
  });

  app.delete("/api/playlists/:id", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const playlist = await storage.getPlaylistById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    if (playlist.userId !== user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await storage.deletePlaylist(req.params.id);
    res.status(204).send();
  });

  app.post("/api/playlists/:id/links", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const playlist = await storage.getPlaylistById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    if (playlist.userId !== user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const parsed = insertPlaylistLinkSchema.safeParse({ 
      playlistId: req.params.id, 
      linkId: req.body.linkId,
      position: req.body.position 
    });
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    }
    const playlistLink = await storage.addLinkToPlaylist(parsed.data);
    res.status(201).json(playlistLink);
  });

  app.delete("/api/playlists/:playlistId/links/:linkId", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const playlist = await storage.getPlaylistById(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    if (playlist.userId !== user.claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await storage.removeLinkFromPlaylist(req.params.playlistId, req.params.linkId);
    res.status(204).send();
  });

  // ============== SHARES ==============
  
  app.get("/api/shares/received", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const shares = await storage.getSharesForUser(user.claims.sub);
    res.json(shares);
  });

  app.get("/api/shares/sent", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const shares = await storage.getSharesByUser(user.claims.sub);
    res.json(shares);
  });

  app.get("/api/shares/links", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const links = await storage.getSharedLinksWithMe(user.claims.sub);
    res.json(links);
  });

  app.get("/api/shares/playlists", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const playlists = await storage.getSharedPlaylistsWithMe(user.claims.sub);
    res.json(playlists);
  });

  app.post("/api/shares", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    
    // Verify ownership of the shared item
    if (req.body.linkId) {
      const link = await storage.getLinkById(req.body.linkId);
      if (!link || link.userId !== user.claims.sub) {
        return res.status(403).json({ message: "Cannot share a link you don't own" });
      }
    }
    if (req.body.playlistId) {
      const playlist = await storage.getPlaylistById(req.body.playlistId);
      if (!playlist || playlist.userId !== user.claims.sub) {
        return res.status(403).json({ message: "Cannot share a playlist you don't own" });
      }
    }
    
    const parsed = insertShareSchema.safeParse({ ...req.body, sharedByUserId: user.claims.sub });
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    }
    const share = await storage.createShare(parsed.data);
    
    await storage.createActivity({
      userId: user.claims.sub,
      type: "share_created",
      title: "Shared content",
      description: req.body.linkId ? "Shared a link" : "Shared a playlist",
      relatedUserId: req.body.sharedWithUserId,
    });
    
    res.status(201).json(share);
  });

  app.delete("/api/shares/:id", isAuthenticated, async (req, res) => {
    // Note: Need to add getShareById to storage to verify ownership
    // For now, just delete - shares table has sharedByUserId
    await storage.deleteShare(req.params.id);
    res.status(204).send();
  });

  // ============== ACTIVITIES ==============
  
  app.get("/api/activities", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const activities = await storage.getActivities(user.claims.sub, limit);
    res.json(activities);
  });

  // ============== USERS ==============
  
  app.get("/api/users/search", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const query = req.query.q as string;
    if (!query || query.length < 2) {
      return res.json([]);
    }
    const users = await storage.searchUsers(query, user.claims.sub);
    res.json(users);
  });

  return httpServer;
}
