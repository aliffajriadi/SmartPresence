import { useQuery } from "@tanstack/react-query";
import * as laporan from "@/lib/api/laporan";

export const useStatistik = () => {
    return useQuery({
        queryKey: ["last-activity"],
        queryFn: laporan.getLastActivity,
        staleTime: 1000 * 60,
    });
};

export const useLaporanAbsensiSiswa = (page: number, limit: number, periode: number) => {
    return useQuery({
        queryKey: ["absensi-siswa", page, limit, periode],
        queryFn: () => laporan.getAbsensiSiswa(page, limit, periode),
        staleTime: 1000 * 60,
    });
}

export const useStatistikAdmin = () => {
    return useQuery({
        queryKey: ["statistik-admin"],
        queryFn: laporan.getStatistikAdmin,
        staleTime: 1000 * 60,
    });
}