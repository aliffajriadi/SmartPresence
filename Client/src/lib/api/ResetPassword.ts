import { api } from "../axios";


export const resetPassword = async (role:string, nohp:string, ni:string) => {
    const data = await api.post('/lupa-password', {role, nohp, ni});
    return data.data.data;
}

export const resetPasswordConfirm = async (id:number, otp:string) => {
    const data = await api.post('/lupa-password/verify', {id, otp});
    return data.data.data;
}

export const resetPasswordUpdate = async (reset_token:string, new_password:string) => {
    const data = await api.post('/lupa-password/update', {reset_token, new_password});
    return data.data.data;
}