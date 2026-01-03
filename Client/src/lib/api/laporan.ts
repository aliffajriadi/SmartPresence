import { api } from "../axios";
import { StatistikDashboard } from "@/types/StatistikDashboard";

export const getStatistik = async (): Promise<StatistikDashboard[]> => {
    const res = await api.get("/absensi/total", { withCredentials: true });
    return res.data.data;
};
export const getLastActivity = async () => {
    const res = await api.get("/laporan/last-activity", { withCredentials: true });
    return res.data.data;
}

export const getAbsensiSiswa = async (page: number, limit: number, periode: number) => {
    const res = await api.get(`/absensi/siswa-table/profile?page=${page}&limit=${limit}&periode=${periode}`, { withCredentials: true });
    return res.data.data;
}

export const baseurl = process.env.NEXT_PUBLIC_API_URL

export const getStatistikAdmin = async () => {
    const res = await api.get("/laporan/statistik", { withCredentials: true });
    return res.data.data;
}