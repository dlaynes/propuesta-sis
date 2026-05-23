import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAnnouncer } from '../hooks/useAnnouncer';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  totalItems?: number;
}

function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];

  if (current > 4) pages.push('...');

  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 3) pages.push('...');
  pages.push(total);

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  totalItems,
}: PaginationProps) {
  const { announce } = useAnnouncer();
  const pages = getPageNumbers(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    onPageChange(page);
    const total = totalItems ?? 0;
    if (total > 0) {
      const start = (page - 1) * pageSize + 1;
      const end = Math.min(page * pageSize, total);
      announce(`Página ${page} de ${totalPages}. Mostrando ${start}–${end} de ${total} resultados.`);
    } else {
      announce(`Página ${page} de ${totalPages}. No hay resultados.`);
    }
  };

  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-sis-text-light">Filas por página</span>
        <select
          aria-label="Filas por página"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-sis-border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-2 py-1 rounded min-w-[32px] flex items-center justify-center text-sis-navy hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 py-1 text-sis-text-light">…</span>
          ) : (
            <button
              key={p}
              onClick={() => handlePageChange(Number(p))}
              className={`px-2 py-1 rounded min-w-[32px] transition-colors ${
                p === currentPage
                  ? 'bg-sis-navy text-white'
                  : 'text-sis-navy hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-2 py-1 rounded min-w-[32px] flex items-center justify-center text-sis-navy hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
