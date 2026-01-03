import * as classApi from "@/lib/api/ClassApi";
import { useQuery } from "@tanstack/react-query";

export const useAbsensiClassDetail = (id: number) => {
  return useQuery({
    queryKey: ["classes", id],
    queryFn: () => classApi.getDetailClassAbsensi(id),
    staleTime: 1000 * 60,
  });
};
export const useKelasAjar = () => {
  return useQuery({
    queryKey: ["kelas-ajar"],
    queryFn: () => classApi.getKelasAjar(),
    staleTime: 1000 * 60,
  });
};
export const useSiswaByKelasId = (id: number, page: number, limit: number) => {
  return useQuery({
    queryKey: ["siswa-by-kelas-id", id, page, limit],
    queryFn: () => classApi.getSiswaByKelasId(id, page, limit),
    staleTime: 1000 * 60,
  });
};


export const useActiveSession = () => {
  return useQuery({
    queryKey: ["active-session"],
    queryFn: () => classApi.getActiveSession(),
    refetchInterval: 5000, // Update otomatis setiap 5 detik
    refetchIntervalInBackground: true, // Tetap update meskipun tab tidak fokus
  });
};

export const useAllKelas = () => {
  return useQuery({
    queryKey: ["all-kelas"],
    queryFn: () => classApi.getAllKelas(),
    staleTime: 1000 * 60,
  });
};