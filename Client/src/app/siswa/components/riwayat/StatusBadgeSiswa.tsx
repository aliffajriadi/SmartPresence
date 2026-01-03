import { CheckCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: boolean;
}

export default function StatusBadgeSiswa({ status }: StatusBadgeProps) {
  const isHadir = status;

  const bg = isHadir ? "bg-green-50 text-green-700 border-green-200" 
                     : "bg-red-50 text-orange-700 border-red-200";

  const icon = isHadir 
    ? <CheckCircle className="w-4 h-4" />
    : <XCircle className="w-4 h-4" />;

  const text = isHadir ? "Tepat Waktu" : "Terlambat";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${bg}`}
    >
      {icon}
      {text}
    </span>
  );
}
