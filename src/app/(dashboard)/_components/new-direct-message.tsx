import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogDescription, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarGroupAction } from "@/components/ui/sidebar";
import { PlusIcon } from "lucide-react";

export function NewDirectMessage() {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <SidebarGroupAction>
            <PlusIcon />
            <span className="sr-only">New Direct Mesage</span>
          </SidebarGroupAction>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Direct Message</DialogTitle>
            <DialogDescription>
              Enter a username to start a new direct message.
            </DialogDescription>
          </DialogHeader>
          <form className="contents">
            <div className="flex flex-col gap-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="Username" />
            </div>
            <DialogFooter>
              <Button>Start Direct Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
};