import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { CreateChannel } from "./create-channel";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

export function ServerSidebar({ id }: { id: Id<"servers"> }) {
  const pathname = usePathname();
  const server = useQuery(api.functions.server.get, { id });
  const channels = useQuery(api.functions.channel.list, {
    id,
  });
  const removeChannel = useMutation(api.functions.channel.remove);
  const router = useRouter();

  const handleChannelDelete = async (id: Id<"channels">) => {
    try {
      if (server) {
        router.push(
          `/servers/${server._id}/channels/${server.defaultChannelId}`
        );
      }
      await removeChannel({ id });
      toast.success("Channel deleted");
    } catch (error) {
      toast.error("Failed to delete channel", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <Sidebar className="left-12">
      <SidebarHeader>{server?.name}</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Channels</SidebarGroupLabel>
          <CreateChannel serverId={id} />
          <SidebarGroupContent>
            <SidebarMenu>
              {channels?.map((channel) => (
                <SidebarMenuItem key={channel._id}>
                  <SidebarMenuButton
                    isActive={
                      pathname === `/servers/${id}/channels/${channel._id}`
                    }
                    asChild
                  >
                    {channel ? (
                      <Link href={`/servers/${id}/channels/${channel._id}`}>
                        {channel.name}
                      </Link>
                    ) : (
                      <span>Channel not found</span>
                    )}
                  </SidebarMenuButton>
                  <SidebarMenuAction
                    onClick={() => handleChannelDelete(channel._id)}
                  >
                    <TrashIcon />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
