"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useQuery } from "convex/react";
import { PhoneIcon } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export function Voice({ serverId }: { serverId: Id<"servers"> }) {
  const token = useQuery(api.functions.livekit.getToken, { serverId });
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <PhoneIcon />
          Voice
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg">
        <DialogTitle className="sr-only">Voice</DialogTitle>
        {token ? (
          <LiveKitRoom
            serverUrl="wss://zcordapp-pf9u21tw.livekit.cloud"
            token={token}
            onDisconnected={() => setOpen(false)}
          >
            <VideoConference />
          </LiveKitRoom>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
