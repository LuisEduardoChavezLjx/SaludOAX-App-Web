import { CircleCheck } from 'lucide-react'

export default function EmptyState({ icon: Icon = CircleCheck, title, description, children }) {
    return (
        <div className="rounded-xl border border-line bg-white px-6 py-12">
            <div className="max-w-[46ch] mx-auto text-center">
        <span className="inline-flex w-12 h-12 rounded-full bg-subtle items-center justify-center text-muted">
          <Icon className="w-5 h-5" />
        </span>
                <h2 className="mt-4 text-base font-semibold">{title}</h2>
                {description && (
                    <p className="mt-2 text-sm text-muted leading-6">{description}</p>
                )}
                {children && <div className="mt-5">{children}</div>}
            </div>
        </div>
    )
}
