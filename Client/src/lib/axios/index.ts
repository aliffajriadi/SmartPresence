import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // tinggal ganti di .env
  withCredentials: true, // kalau pakai cookie
});