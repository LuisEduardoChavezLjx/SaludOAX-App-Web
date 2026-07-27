import { CircleAlert } from 'lucide-react'

export default function ErrorMessage({ msg }) {
    if (!msg) return null

    return (
        <div className="flex items-start gap-2 rounded-lg border border-urgente bg-white px-4 py-3 text-sm font-medium text-urgente" role="alert">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{msg}</span>
        </div>
    )
}
