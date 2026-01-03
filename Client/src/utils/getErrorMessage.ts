// Type guard untuk mengecek apakah error adalah Axios-like error
function isAxiosError(error: unknown): error is { response?: { data?: { message?: string } } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as Record<string, unknown>).response === "object"
  );
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  if (error instanceof Error) return error.message;

  // Cek jika ini error axios
  if (isAxiosError(error)) {
    return error.response?.data?.message || "Terjadi kesalahan.";
  }

  return "Terjadi kesalahan saat menyimpan.";
}
