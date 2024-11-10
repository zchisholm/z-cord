"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";

export function useCreateDirectMessage() {
  const createDirectMessage = useMutation(api.functions.dm.create);
  const router = useRouter();

  const handleCreateDirectMessage = async (username: string) => {
    try {
      const id = await createDirectMessage({ username });
      router.push(`/dms/${id}`);
    } catch (error) {
      toast.error("Failed to create direct message", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return handleCreateDirectMessage;
}
