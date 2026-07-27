const CONFIG = {
  LEVE: {
    bg: 'bg-leve',
    icon: CheckIcon,
    label: 'Leve',
  },
  MODERADA: {
    bg: 'bg-moderada',
    icon: WarningIcon,
    label: 'Moderada',
  },
  URGENTE: {
    bg: 'bg-urgente',
    icon: AlertIcon,
    label: 'Urgente',
  },
}

function CheckIcon() {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
      </svg>
  )
}

function WarningIcon() {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.19-1.458-1.517-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
  )
}

function AlertIcon() {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M10 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 1ZM10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2.25a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 4.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM4.399 4.399a.75.75 0 0 1 1.06 0l1.06 1.061a.75.75 0 0 1-1.06 1.06L4.399 5.46a.75.75 0 0 1 0-1.06Zm11.202 0a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0ZM1 10a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 1 10Zm15 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 16 10Z" clipRule="evenodd" />
      </svg>
  )
}

export default function GravedadBadge({ gravedad }) {
  if (!gravedad || !CONFIG[gravedad]) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
        Sin estimar
      </span>
    )
  }

  const cfg = CONFIG[gravedad]
  const Icon = cfg.icon

  return (
      <span className={`inline-flex items-center gap-1.5 rounded-full ${cfg.bg} px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-white`}>
      <Icon />
        {cfg.label}
    </span>
  )
}
