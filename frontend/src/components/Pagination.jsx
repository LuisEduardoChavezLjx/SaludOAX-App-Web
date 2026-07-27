import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, totalElements, pageLabel = 'Mostrando', onPageChange }) {
  if (totalPages <= 1) return null

  const desde = page * 10 + 1
  const hasta = Math.min((page + 1) * 10, totalElements)

  return (
    <div className="px-6 py-4 border-t border-line flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-muted">
        {pageLabel} <span className="font-semibold text-ink tabular-nums">{desde}–{hasta}</span> de{' '}
        <span className="font-semibold text-ink tabular-nums">{totalElements}</span>
      </p>

      <nav className="flex items-center gap-1" aria-label="Paginación">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-line bg-white text-muted hover:bg-subtle hover:text-ink transition-colors duration-150 disabled:bg-subtle disabled:text-slate-400 disabled:cursor-not-allowed"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {generarPaginas(page, totalPages).map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-muted">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`w-9 h-9 rounded-lg text-sm font-semibold tabular-nums transition-colors duration-150 ${
                p === page
                  ? 'bg-brand-700 text-white'
                  : 'border border-line bg-white text-muted hover:bg-subtle hover:text-ink'
              }`}
            >
              {p + 1}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page + 1 >= totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-line bg-white text-muted hover:bg-subtle hover:text-ink transition-colors duration-150 disabled:bg-subtle disabled:text-slate-400 disabled:cursor-not-allowed"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </nav>
    </div>
  )
}

function generarPaginas(actual, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)

  const paginas = []
  if (actual <= 2) {
    for (let i = 0; i <= 3 && i < total; i++) paginas.push(i)
    if (total > 4) { paginas.push('...'); paginas.push(total - 1) }
  } else if (actual >= total - 3) {
    paginas.push(0); paginas.push('...')
    for (let i = total - 4; i < total; i++) paginas.push(i)
  } else {
    paginas.push(0); paginas.push('...')
    for (let i = actual - 1; i <= actual + 1; i++) paginas.push(i)
    paginas.push('...'); paginas.push(total - 1)
  }
  return paginas
}
