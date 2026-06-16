import Link from 'next/link';

interface PaginationProps {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export default function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-4">
      <Link
        href={buildHref(page - 1)}
        className={`px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-900 dark:text-slate-100 ${
          page <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-slate-50 dark:hover:bg-slate-700'
        }`}
      >
        Anterior
      </Link>
      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
        Página {page} de {totalPages || 1}
      </span>
      <Link
        href={buildHref(page + 1)}
        className={`px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-900 dark:text-slate-100 ${
          page >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-slate-50 dark:hover:bg-slate-700'
        }`}
      >
        Siguiente
      </Link>
    </div>
  );
}
