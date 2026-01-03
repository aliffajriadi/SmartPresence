"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/lib/hooks/useUser";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useCheckRequirement() {
  const router = useRouter();
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (!user) return;

    if (user.photo === "default") {
      toast.error("Mohon lengkapi Foto Profile terlebih dahulu!");
      router.push(`/${user.role}/pengaturan`);
    }
  }, [user, router]);
}
