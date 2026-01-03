import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogoutRequest } from "../api/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient(); // <--- ini yang benar

  return useMutation({
    mutationFn: LogoutRequest,
    onSuccess: () => {
      toast.success("Logout berhasil!");

      // hapus semua cache user
      queryClient.invalidateQueries(); // hapus semua cache
      queryClient.removeQueries({ queryKey: ["currentUser"] }); // hapus query tertentu

      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      toast.error("Logout gagal");
    },
  });
};
