import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, logsActivity, logsActivityDetail, getUsers, updateUser, updatePhoto, updatePasswordProfile, searchUser, updateProfile, deleteUser, getUserById,getCurrentUser, getUserParams, statistikSiswaAbsensiProfile  } from "@/lib/api/user";
import { CreateUserPayload, UserUpdatePassword } from "@/types/user";
import { toast } from "sonner";


export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    
  });
};

export const useUserQuery = (page: string, limit: string, role: "guru" | "siswa") => {
  return useQuery({
    queryKey: ["userParams", page, limit, role],
    queryFn: () => getUserParams(page, limit, role), // 3 argumen terpisah
    staleTime: 1000 * 60,
  });
};

export const useCreateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserPayload) => {
      return createUser(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["statistik-admin"] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Create user failed:", error.message);
        alert(error.message);
      } else if (typeof error === "object" && error !== null && "response" in error) {
        // jika error dari axios
        const err = error as { response?: { data?: { message?: string } } };
        console.error("Create user failed:", err.response?.data || err);
        alert(err.response?.data?.message || "Gagal membuat user");
      } else {
        console.error("Create user failed:", error);
        alert("Gagal membuat user");
      }
    }

  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateUserPayload>;
    }) => updateUser(id, data),
    onSuccess: (data,variables) => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user", variables.id] });
      qc.invalidateQueries({ queryKey: ["userParams"] });
    },
    onError: (error: unknown) => { // <=== TAMBAHKAN PENANGANAN ERROR DI SINI
      if (error instanceof Error) {
        console.error("Update user failed:", error.message);
        alert(error.message);
      } else if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        console.error("Update user failed:", err.response?.data || err);
        alert(err.response?.data?.message || "Gagal memperbarui user");
      } else {
        console.error("Update user failed:", error);
        alert("Gagal memperbarui user");
      }
    },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userParams"] });
    },
  });
};

export const useUserById = (id: number) => {

   return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id), // Atau pakai endpoint khusus getUserById
    enabled: !!id, // hanya fetch kalau id ada
  });
};

export const useCurrentUser = () => {
   return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(), 
    staleTime: 1000 * 180,
  });
};

export const useSearchUser = (page: string, limit: string, query: string, role: "guru" | "siswa") => {
  return useQuery({
    queryKey: ["searchUser", page, limit, query, role],
    queryFn: () => searchUser(page, limit, query, role),
    enabled: query.length > 0,
    staleTime: 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUpdatePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePhoto,
    onSuccess: () => {
      toast.success("Foto profil berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: () => {
      toast.error("Gagal update foto");
    }
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CreateUserPayload>) => updateProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["logs-activity"] });
    },

    onError: (e) => {
      console.log("Gagal update profil" + e);
      toast.error("Gagal update profil");
    }
  });
};

export const useUpdatePasswordProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UserUpdatePassword) => updatePasswordProfile(data), // panggil API
    onSuccess: () => {
      toast.success("Password berhasil diperbarui");
      qc.invalidateQueries({ queryKey: ["logs-activity"] });
    },
    onError: () => {
      toast.error("Gagal update password");
    },
  });
};


export const useStatistikAbsensiSiswa = () => {
  return useQuery({
    queryKey: ["statistikSiswaAbsensiProfile"],
    queryFn: statistikSiswaAbsensiProfile,
    staleTime: 1000 * 60,
  });
}

export const useLogsActivity = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["logs-activity", page, limit],
    queryFn: () => logsActivity(page, limit),
    staleTime: 1000 * 100,
  });
}
export const useLogsActivityDetail = (id: number) => {
  return useQuery({
    queryKey: ["logs-activity-detail", id],
    queryFn: () => logsActivityDetail(id),
    staleTime: 1000 * 100,
  });
}