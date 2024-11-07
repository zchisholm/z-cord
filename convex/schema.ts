import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    image: v.string(),
    clerkId: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_username", ["username"]),
  friends: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    status: v.union(
      v.literal("accepted"),
      v.literal("pending"),
      v.literal("rejected")
    ),
  })
    .index("by_user1_status", ["user1", "status"])
    .index("by_user2_status", ["user2", "status"]),
  directMessages: defineTable({}),
  directMessageMembers: defineTable({
    directMessage: v.id("directMessages"),
    user: v.id("users"),
  })
    .index("by_direct_message", ["directMessage"])
    .index("by_direct_message_user", ["directMessage", "user"])
    .index("by_user", ["user"]),
  messages: defineTable({
    sender: v.id("users"),
    content: v.string(),
    directMessage: v.id("directMessages"),
  }).index("by_direct_message", ["directMessage"]),
  typingIndicators: defineTable({
    user: v.id("users"),
    directMessage: v.id("directMessages"),
    expiresAt: v.number(),
  })
    .index("by_direct_message", ["directMessage"])
    .index("by_user_direct_message", ["user", "directMessage"]),
});
