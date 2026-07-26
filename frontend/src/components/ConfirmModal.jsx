export default function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', maxWidth: '400px' }}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} disabled={loading}>
            {loading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
