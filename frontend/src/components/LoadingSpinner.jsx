import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ texto = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted" role="status">
      <Loader2 className="w-8 h-8 animate-spin" />
      <p className="mt-4 text-sm">{texto}</p>
    </div>
  )
}
