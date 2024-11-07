import { v } from "convex/values";
import { authenticatedMutation } from "./helpers";
import { internalMutation } from "../_generated/server";

export const upsert = authenticatedMutation({
  args: {
    directMessage: v.id("directMessages"),
  },
  handler: async (ctx, { directMessage }) => {
    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_user_direct_message", (q) =>
        q.eq("user", ctx.user._id).eq("directMessage", directMessage)
      )
      .unique();

    const expiresAt = Date.now() + 5000;
    if (existing) {
      await ctx.db.patch(existing._id, { expiresAt });
    } else {
      await ctx.db.insert("typingIndicators", {
        user: ctx.user._id,
        directMessage,
        expiresAt,
      });
    }
  },
});

export const remove = internalMutation({
  args: {
    directMessage: v.id("directMessages"),
    user: v.id("users"),
    expiresAt: v.number(),
  },
  handler: async (ctx, { directMessage, user, expiresAt }) => {
    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_user_direct_message", (q) =>
        q.eq("user", user).eq("directMessage", directMessage)
      )
      .unique();

    if (existing && existing.expiresAt === expiresAt) {
      await ctx.db.delete(existing._id);
    }
  },
});
