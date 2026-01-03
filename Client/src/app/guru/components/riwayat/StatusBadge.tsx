import { CheckCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isHadir = status === "Hadir";

  const bg = isHadir
    ? "bg-green-50 text-green-700 border border-green-200"
    : "bg-red-50 text-red-700 border border-red-200";

  const icon = isHadir 
    ? <CheckCircle className="w-4 h-4" />
    : <XCircle className="w-4 h-4" />;

  const text = isHadir ? "Hadir" : "Tidak Hadir";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg}`}
    >
      {icon}
      {text}
    </span>
  );
}
