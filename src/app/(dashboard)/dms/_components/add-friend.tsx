"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";

export function AddFriend() {
  const [open, setOpen] = useState(false);
  const createFriendRequest = useMutation(
    api.functions.friends.createFriendRequest
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createFriendRequest({ username: e.currentTarget.username.value });
      toast.success("Friend request sent");
    } catch (error) {
      toast.error("Failed to send friend request", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">Add Friend</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Friend</DialogTitle>
            <DialogDescription>
              Add a friend by their username.
            </DialogDescription>
          </DialogHeader>
          <form className="contents" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="Username" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
