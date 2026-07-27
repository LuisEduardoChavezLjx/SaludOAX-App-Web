import Sidebar from './Sidebar'
import Header from './Header'
import { useAuth } from '../context/AuthContext'

export default function Layout({ title, subtitle, children }) {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen bg-canvas text-ink antialiased">
      <Sidebar rol={user?.rol} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
