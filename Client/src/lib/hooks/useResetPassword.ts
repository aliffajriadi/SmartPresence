import { useMutation } from "@tanstack/react-query";
import {
  resetPassword,
  resetPasswordConfirm,
  resetPasswordUpdate,
} from "../api/ResetPassword";

// ============================================
// 1. DEFINISI INTERFACE RESPON (MAPPING API)
// ============================================

// Interface dasar agar tidak mengulang success & message
interface BaseResponse {
  success: boolean;
  message: string;
}

// Respon khusus untuk Step 1 (Request OTP)
interface RequestOtpResponse extends BaseResponse {
  data: {
    idUser: number; // Sesuaikan tipe dengan DB (number/string)
    next: boolean;
  };
  idUser: string;
}

// Respon khusus untuk Step 2 (Verify OTP)
interface ConfirmOtpResponse extends BaseResponse {
  data: {
    token: string; // Token yang akan dipakai untuk update password
  };
}

// Respon khusus untuk Step 3 (Update Password)
interface UpdatePasswordResponse extends BaseResponse {
  data: null; // Biasanya update hanya return success message
}

// ============================================
// 2. DEFINISI PAYLOAD (INPUT DATA)
// ============================================
interface ResetPayload { role: string; nohp: string; ni: string }
interface ConfirmPayload { id: number; otp: string }
interface UpdatePayload { reset_token: string; new_password: string }

// ============================================
// 3. HOOKS (TYPE-SAFE)
// ============================================

export const useResetPassword = () => {
  return useMutation<RequestOtpResponse, Error, ResetPayload>({
    mutationFn: (data) => resetPassword(data.role, data.nohp, data.ni),
  });
};

export const useResetPasswordConfirm = () => {
  return useMutation<ConfirmOtpResponse, Error, ConfirmPayload>({
    mutationFn: (data) => resetPasswordConfirm(data.id, data.otp),
  });
};

export const useResetPasswordUpdate = () => {
  return useMutation<UpdatePasswordResponse, Error, UpdatePayload>({
    mutationFn: (data) => resetPasswordUpdate(data.reset_token, data.new_password),
  });
};