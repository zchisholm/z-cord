import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { CreateChannel } from "./create-channel";

export function ServerSidebar({ id }: { id: Id<"servers"> }) {
  const pathname = usePathname();
  const server = useQuery(api.functions.server.get, { id: id });
  const channels = useQuery(api.functions.channel.list, {
    id: id,
  });
  return (
    <Sidebar className="left-12">
      <SidebarHeader>{server?.name}</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Channels</SidebarGroupLabel>
          <CreateChannel serverId={id}/>
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
                    <Link href={`/servers/${id}/channels/${channel._id}`}>
                      {channel.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
