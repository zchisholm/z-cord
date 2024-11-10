import {
  assertServerMember,
  assertServerOwner,
  authenticatedMutation,
} from "./helpers";
import { authenticatedQuery } from "./helpers";
import { v } from "convex/values";

export const list = authenticatedQuery({
  args: {
    id: v.id("servers"),
  },
  handler: async (ctx, { id }) => {
    await assertServerMember(ctx, id);
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_serverId", (q) => q.eq("serverId", id))
      .collect();
    return channels;
  },
});

export const create = authenticatedMutation({
  args: {
    serverId: v.id("servers"),
    name: v.string(),
  },
  handler: async (ctx, { serverId, name }) => {
    await assertServerOwner(ctx, serverId);
    const existingChannel = await ctx.db
      .query("channels")
      .withIndex("by_serverId_name", (q) =>
        q.eq("serverId", serverId).eq("name", name)
      )
      .unique();
    if (existingChannel) {
      throw new Error("Channel already exists");
    } 
      const channelId = await ctx.db.insert("channels", { name, serverId });
      return channelId;
  },
});
