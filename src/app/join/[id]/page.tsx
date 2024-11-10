"use client";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { use } from "react";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";

export default function JoinPage({
  params,
}: {
  params: Promise<{ id: Id<"invites"> }>;
}) {
  const { id } = use(params);
  const invite = useQuery(api.functions.invite.get, { id });
  const join = useMutation(api.functions.invite.join);
  const router = useRouter();

  const handleJoin = async () => {
    try {
      await join({ id });
      if (invite?.server) {
        router.push(
          `/servers/${invite.server._id}/channels/${invite.server.defaultChannelId}`
        );
      } else {
        throw new Error("Server information is missing.");
      }
    } catch (error) {
      console.error("Failed to join the server:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Card className="max-w-96 w-full">
        <CardHeader>
          <CardTitle>Join {invite?.server?.name || "Server"}</CardTitle>
          <CardDescription>
            You've been invited to join{" "}
            <span className="font-semibold">
              {invite?.server?.name || "server"}
            </span>
            .
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col items-stretch gap-2">
          <Authenticated>
            <Button onClick={handleJoin}>Join Server</Button>
          </Authenticated>
          <Unauthenticated>
            <Button asChild>
              <SignInButton forceRedirectUrl={`/join/${id}`}>
                Sign in to Join
              </SignInButton>
            </Button>
          </Unauthenticated>
          <Button variant="secondary" asChild>
            <Link href="/dms">Not Now</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
