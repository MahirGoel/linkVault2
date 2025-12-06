import { eq, and, or, ilike, desc, asc, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  links,
  categories,
  tags,
  playlists,
  playlistLinks,
  shares,
  activities,
  type User,
  type UpsertUser,
  type Link,
  type InsertLink,
  type Category,
  type InsertCategory,
  type Tag,
  type InsertTag,
  type Playlist,
  type InsertPlaylist,
  type PlaylistLink,
  type InsertPlaylistLink,
  type Share,
  type InsertShare,
  type Activity,
  type InsertActivity,
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUsersByIds(ids: string[]): Promise<User[]>;
  searchUsers(query: string, excludeUserId: string): Promise<User[]>;

  // Link operations
  getLinks(userId: string): Promise<Link[]>;
  getLinkById(id: string): Promise<Link | undefined>;
  createLink(link: InsertLink): Promise<Link>;
  updateLink(id: string, data: Partial<InsertLink>): Promise<Link>;
  deleteLink(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;

  // Category operations
  getCategories(userId: string): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, data: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Tag operations
  getTags(userId: string): Promise<Tag[]>;
  getTagById(id: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  updateTag(id: string, data: Partial<InsertTag>): Promise<Tag>;
  deleteTag(id: string): Promise<void>;

  // Playlist operations
  getPlaylists(userId: string): Promise<Playlist[]>;
  getPlaylistById(id: string): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: string, data: Partial<InsertPlaylist>): Promise<Playlist>;
  deletePlaylist(id: string): Promise<void>;
  getPlaylistLinks(playlistId: string): Promise<Link[]>;
  addLinkToPlaylist(data: InsertPlaylistLink): Promise<PlaylistLink>;
  removeLinkFromPlaylist(playlistId: string, linkId: string): Promise<void>;
  getPlaylistLinkCount(playlistId: string): Promise<number>;

  // Share operations
  getSharesForUser(userId: string): Promise<Share[]>;
  getSharesByUser(userId: string): Promise<Share[]>;
  createShare(share: InsertShare): Promise<Share>;
  deleteShare(id: string): Promise<void>;
  getSharedLinksWithMe(userId: string): Promise<Link[]>;
  getSharedPlaylistsWithMe(userId: string): Promise<Playlist[]>;

  // Activity operations
  getActivities(userId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUsersByIds(ids: string[]): Promise<User[]> {
    if (ids.length === 0) return [];
    return await db.select().from(users).where(inArray(users.id, ids));
  }

  async searchUsers(query: string, excludeUserId: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(
        and(
          or(
            ilike(users.email, `%${query}%`),
            ilike(users.firstName, `%${query}%`),
            ilike(users.lastName, `%${query}%`)
          ),
          sql`${users.id} != ${excludeUserId}`
        )
      )
      .limit(10);
  }

  // Link operations
  async getLinks(userId: string): Promise<Link[]> {
    return await db
      .select()
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(desc(links.createdAt));
  }

  async getLinkById(id: string): Promise<Link | undefined> {
    const [link] = await db.select().from(links).where(eq(links.id, id));
    return link;
  }

  async createLink(link: InsertLink): Promise<Link> {
    const [newLink] = await db.insert(links).values(link).returning();
    return newLink;
  }

  async updateLink(id: string, data: Partial<InsertLink>): Promise<Link> {
    const [updated] = await db
      .update(links)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(links.id, id))
      .returning();
    return updated;
  }

  async deleteLink(id: string): Promise<void> {
    await db.delete(links).where(eq(links.id, id));
  }

  async incrementViewCount(id: string): Promise<void> {
    await db
      .update(links)
      .set({ viewCount: sql`${links.viewCount} + 1` })
      .where(eq(links.id, id));
  }

  // Category operations
  async getCategories(userId: string): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(asc(categories.name));
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, data: Partial<InsertCategory>): Promise<Category> {
    const [updated] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Tag operations
  async getTags(userId: string): Promise<Tag[]> {
    return await db
      .select()
      .from(tags)
      .where(eq(tags.userId, userId))
      .orderBy(asc(tags.name));
  }

  async getTagById(id: string): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag;
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const [newTag] = await db.insert(tags).values(tag).returning();
    return newTag;
  }

  async updateTag(id: string, data: Partial<InsertTag>): Promise<Tag> {
    const [updated] = await db
      .update(tags)
      .set(data)
      .where(eq(tags.id, id))
      .returning();
    return updated;
  }

  async deleteTag(id: string): Promise<void> {
    await db.delete(tags).where(eq(tags.id, id));
  }

  // Playlist operations
  async getPlaylists(userId: string): Promise<Playlist[]> {
    return await db
      .select()
      .from(playlists)
      .where(eq(playlists.userId, userId))
      .orderBy(desc(playlists.createdAt));
  }

  async getPlaylistById(id: string): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist;
  }

  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const [newPlaylist] = await db.insert(playlists).values(playlist).returning();
    return newPlaylist;
  }

  async updatePlaylist(id: string, data: Partial<InsertPlaylist>): Promise<Playlist> {
    const [updated] = await db
      .update(playlists)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(playlists.id, id))
      .returning();
    return updated;
  }

  async deletePlaylist(id: string): Promise<void> {
    await db.delete(playlists).where(eq(playlists.id, id));
  }

  async getPlaylistLinks(playlistId: string): Promise<Link[]> {
    const result = await db
      .select({ link: links })
      .from(playlistLinks)
      .innerJoin(links, eq(playlistLinks.linkId, links.id))
      .where(eq(playlistLinks.playlistId, playlistId))
      .orderBy(asc(playlistLinks.position));
    return result.map((r) => r.link);
  }

  async addLinkToPlaylist(data: InsertPlaylistLink): Promise<PlaylistLink> {
    const [playlistLink] = await db.insert(playlistLinks).values(data).returning();
    return playlistLink;
  }

  async removeLinkFromPlaylist(playlistId: string, linkId: string): Promise<void> {
    await db
      .delete(playlistLinks)
      .where(and(eq(playlistLinks.playlistId, playlistId), eq(playlistLinks.linkId, linkId)));
  }

  async getPlaylistLinkCount(playlistId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(playlistLinks)
      .where(eq(playlistLinks.playlistId, playlistId));
    return result[0]?.count ?? 0;
  }

  // Share operations
  async getSharesForUser(userId: string): Promise<Share[]> {
    return await db
      .select()
      .from(shares)
      .where(eq(shares.sharedWithUserId, userId))
      .orderBy(desc(shares.createdAt));
  }

  async getSharesByUser(userId: string): Promise<Share[]> {
    return await db
      .select()
      .from(shares)
      .where(eq(shares.sharedByUserId, userId))
      .orderBy(desc(shares.createdAt));
  }

  async createShare(share: InsertShare): Promise<Share> {
    const [newShare] = await db.insert(shares).values(share).returning();
    return newShare;
  }

  async deleteShare(id: string): Promise<void> {
    await db.delete(shares).where(eq(shares.id, id));
  }

  async getSharedLinksWithMe(userId: string): Promise<Link[]> {
    const result = await db
      .select({ link: links })
      .from(shares)
      .innerJoin(links, eq(shares.linkId, links.id))
      .where(eq(shares.sharedWithUserId, userId));
    return result.map((r) => r.link);
  }

  async getSharedPlaylistsWithMe(userId: string): Promise<Playlist[]> {
    const result = await db
      .select({ playlist: playlists })
      .from(shares)
      .innerJoin(playlists, eq(shares.playlistId, playlists.id))
      .where(eq(shares.sharedWithUserId, userId));
    return result.map((r) => r.playlist);
  }

  // Activity operations
  async getActivities(userId: string, limit = 20): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }
}

export const storage = new DatabaseStorage();
