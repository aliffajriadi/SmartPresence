// SkeletonTable.tsx
'use client';

export default function SkeletonTable({ rows = 10, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-xl min-w-[600px]">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th
                key={i}
                className="py-3 px-4 border-b border-gray-200"
              >
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-gray-100">
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j} className="py-4 px-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
