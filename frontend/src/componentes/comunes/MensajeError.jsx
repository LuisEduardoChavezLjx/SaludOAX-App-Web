import { AlertTriangle } from 'lucide-react';

export function MensajeError({ mensaje }) {
  if (!mensaje) return null;

  return (
      <div
          className="mb-5 flex items-start gap-2 rounded-lg border border-urgente bg-white px-4 py-3 text-sm font-medium text-urgente"
          role="alert"
      >
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{mensaje}</span>
      </div>
  );
}