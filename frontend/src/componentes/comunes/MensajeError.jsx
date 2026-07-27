import { AlertTriangle } from 'lucide-react';

export function MensajeError({ mensaje }) {
  if (!mensaje) return null;

  return (
    <div
      className="mb-4 flex items-start gap-2 rounded-xl bg-peligro-fondo px-4 py-3 text-sm text-peligro"
      role="alert"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{mensaje}</span>
    </div>
  );
}