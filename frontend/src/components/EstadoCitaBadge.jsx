const COLORES = {
  PENDIENTE: 'bg-moderada',
  CONFIRMADA: 'bg-info',
  ATENDIDA: 'bg-leve',
  CANCELADA: 'bg-neutro',
}

const ETIQUETAS = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  ATENDIDA: 'Atendida',
  CANCELADA: 'Cancelada',
}

export default function EstadoCitaBadge({ estado }) {
  const punto = COLORES[estado] || 'bg-neutro'
  const label = ETIQUETAS[estado] || estado

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-subtle px-2.5 py-1 text-xs font-semibold text-ink">
      <span className={`w-1.5 h-1.5 rounded-full ${punto}`} />
      {label}
    </span>
  )
}
