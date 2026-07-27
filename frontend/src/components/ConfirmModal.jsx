import { X } from 'lucide-react'

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, loading, variante = 'peligro' }) {
  if (!open) return null

  const botonConfirmar =
      variante === 'peligro'
          ? 'bg-urgente hover:bg-urgente/90 focus:ring-urgente'
          : 'bg-brand-700 hover:bg-brand-800 active:bg-brand-900 focus:ring-brand-600'

  return (
      <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-6"
      >
        <div className="w-full max-w-[480px] rounded-xl bg-white shadow-[0_20px_40px_-12px_rgba(15,23,42,0.35)]">
          <div className="px-6 py-5 border-b border-line flex items-start justify-between gap-4">
            <h2 id="confirm-modal-title" className="text-base font-semibold">
              {title}
            </h2>
            <button type="button" onClick={onCancel} className="shrink-0 text-muted hover:text-ink" aria-label="Cerrar">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="px-6 py-5 text-sm text-muted leading-6">{message}</p>

          <div className="px-6 py-4 border-t border-line flex justify-end gap-3">
            <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-muted hover:bg-subtle hover:text-ink transition-colors duration-150"
            >
              Cancelar
            </button>
            <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${botonConfirmar}`}
            >
              {loading ? 'Procesando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
  )
}
