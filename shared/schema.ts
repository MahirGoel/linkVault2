import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, primaryKey, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Links table
export const links = pgTable("links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  thumbnail: text("thumbnail"),
  category: text("category"),
  tags: text("tags").array(),
  isFavorite: boolean("is_favorite").default(false),
  isRead: boolean("is_read").default(false),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLinkSchema = createInsertSchema(links).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export type InsertLink = z.infer<typeof insertLinkSchema>;
export type Link = typeof links.$inferSelect;

// Categories table
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Tags table
export const tags = pgTable("tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true,
});

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

// Playlists table
export const playlists = pgTable("playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;

// Playlist links junction table
export const playlistLinks = pgTable("playlist_links", {
  playlistId: varchar("playlist_id").notNull().references(() => playlists.id, { onDelete: "cascade" }),
  linkId: varchar("link_id").notNull().references(() => links.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").defaultNow(),
  position: integer("position").default(0),
}, (table) => ({
  pk: primaryKey({ columns: [table.playlistId, table.linkId] }),
}));

export const insertPlaylistLinkSchema = createInsertSchema(playlistLinks).omit({
  addedAt: true,
});

export type InsertPlaylistLink = z.infer<typeof insertPlaylistLinkSchema>;
export type PlaylistLink = typeof playlistLinks.$inferSelect;

// Shares table - for sharing links or playlists with other users
export const shares = pgTable("shares", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sharedByUserId: varchar("shared_by_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sharedWithUserId: varchar("shared_with_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  linkId: varchar("link_id").references(() => links.id, { onDelete: "cascade" }),
  playlistId: varchar("playlist_id").references(() => playlists.id, { onDelete: "cascade" }),
  canEdit: boolean("can_edit").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertShareSchema = createInsertSchema(shares).omit({
  id: true,
  createdAt: true,
});

export type InsertShare = z.infer<typeof insertShareSchema>;
export type Share = typeof shares.$inferSelect;

// Activity log table
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  relatedUserId: varchar("related_user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Sessions table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Upsert user type for Replit Auth
export type UpsertUser = typeof users.$inferInsert;
