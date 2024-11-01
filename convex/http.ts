import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  method: "POST",
  path: "/clerk-webhook",
  handler: httpAction(async (ctx, req) => {
    const body = await validateRequest(req);
    if (!body) {
      return new Response("Unauthorized", { status: 401 });
    }
    switch (body.type) {
        case "user.created":
            await ctx.runMutation(internal.functions.user.upsert, {
                username: body.data.username!,
                image: body.data.image_url,
                clerkId: body.data.id,
            });
        break;
        case "user.updated":
            await ctx.runMutation(internal.functions.user.upsert, {
              username: body.data.username!,
              image: body.data.image_url,
              clerkId: body.data.id,
            });
        break;
        case "user.deleted":
            if (body.data.id) {
              await ctx.runMutation(internal.functions.user.remove, {
                clerkId: body.data.id,
              });
            }
        break;
    }
    return new Response("OK", { status: 200 });
  }),
});

const validateRequest = async (req: Request) => {
  // Log all headers by converting them to an object
  const headersObj: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headersObj[key] = value;
  });
  console.log("Incoming headers:", headersObj);

  const svix_id = req.headers.get("svix-id") || req.headers.get("svix-id");
  const svix_timestamp =
    req.headers.get("svix-timestamp") || req.headers.get("svix-timestamp");
  const svix_signature =
    req.headers.get("svix-signature") || req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing required headers for verification");
    return null;
  }

  const text = await req.text();

  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    const event = webhook.verify(text, {
      "svix-id": svix_id!,
      "svix-timestamp": svix_timestamp!,
      "svix-signature": svix_signature!,
    }) as unknown as WebhookEvent;
    console.log("Webhook verified successfully:", event);
    return event;
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return null;
  }
};

export default http;
