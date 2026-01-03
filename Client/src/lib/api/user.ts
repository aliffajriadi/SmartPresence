import {api} from '../axios';
import {LoginPayload} from "@/types/login";
import { CreateUserPayload, UserUpdatePassword} from "@/types/user";


export const LoginRequest = (data: LoginPayload) =>
  api.post("/auth/login", data, {withCredentials: true}).then(res => {
       return res.data.data;
     });

export const LogoutRequest = () =>
  api.post("/auth/logout").then(res => res.data);

export const createUser = async (payload: CreateUserPayload) => {
  const res = await api.post("/user", payload, { withCredentials: true });
  return res.data.data;
};

export const getUsers = async () => {
  const res = await api.get("/user", { withCredentials: true });
  return res.data.data;
};

export const getUserParams = async (page: string, limit: string, role: "guru" | "siswa") => {
  const res = await api.get(`/user?page=${page}&limit=${limit}&role=${role}`, { withCredentials: true });
  return res.data.data;
}

export const getUserById = async (id: number) => {
  const res = await api.get(`/user/${id}`, { withCredentials: true });
  return res.data.data;
};

export const updateUser = async (id: number, data: Partial<CreateUserPayload>) => {
  const res = await api.patch(`/user/${id}`, data, { withCredentials: true });
  return res.data.data;
};

export const deleteUser = async (id: number) => {
  const res = await api.delete(`/user/${id}`, { withCredentials: true });
  return res.data.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/user/profile/me", { withCredentials: true });
  return res.data.data; 
};

export const searchUser = async (page: string, limit: string ,query: string, role: "guru" | "siswa") => {
  const res = await api.get(`/user/search/all?query=${query}&page=${page}&limit=${limit}&role=${role}`, { withCredentials: true });
   console.log("get data");
  return res.data.data;
};

export const updatePhoto = async (data: FormData) => {
  const res = await api.patch(`/user/update/photo`, data, { withCredentials: true });
  return res.data.data;
};

export const updateProfile = async (data: Partial<CreateUserPayload>) => {
  const res = await api.patch(`/user/profile/me`, data, { withCredentials: true });
  return res.data.data;
};

export const updatePasswordProfile = async (data: UserUpdatePassword) => {
  const res = await api.patch(`/user/profile/password`, data, { withCredentials: true });
  return res.data.data;
};

export const statistikSiswaAbsensiProfile = async () => {
  const res = await api.get(`/absensi/statistik/profile-siswa`, { withCredentials: true });
  return res.data.data;
}

export const logsActivity = async (page: number, limit: number) => {
  const res = await api.get(`/user/profile/activity?page=${page}&limit=${limit}`, { withCredentials: true });
  return res.data.data;
}
export const logsActivityDetail = async (id: number) => {
  const res = await api.get(`/user/profile/activity-detail?id=${id}`, { withCredentials: true });
  return res.data.data;
}