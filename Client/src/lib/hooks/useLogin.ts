import { useMutation } from "@tanstack/react-query";
import { LoginRequest } from "@/lib/api/user";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { LoginPayload } from "@/types/login";
import { useRouter } from "next/navigation";
export const useLogin = (router:ReturnType<typeof useRouter>) => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => LoginRequest(payload),

    onSuccess: (user) => {
      if (!user) {
        toast.error("Data user tidak ditemukan!");
        return;
      }

    const role = user.role.toLowerCase();
    toast.success(`Login berhasil ${role.toUpperCase()}`);

      if (role === "admin") router.push("/admin");
      else if (role === "guru") router.push("/guru");
      else router.push("/siswa");
    },

    onError: (error: unknown) => {
      const err = error as AxiosError<{ message: string }>;
      console.log("Login error response:", err.response?.data);
      toast.error(err.response?.data?.message ?? err.message ?? "Gagal login");
    },
  });
};