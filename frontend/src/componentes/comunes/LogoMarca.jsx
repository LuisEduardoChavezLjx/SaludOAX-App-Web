export function LogoMarca({ size = 'w-11 h-11' }) {
  return (
    <span className={`${size} rounded-xl bg-brand-700 flex items-center justify-center text-white`}>
      <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" aria-hidden="true">
        <path d="M13 4h6v9h9v6h-9v9h-6v-9H4v-6h9V4z" fill="currentColor" opacity=".28"/>
        <path d="M4 16h5l3-6 4 12 3-6h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}