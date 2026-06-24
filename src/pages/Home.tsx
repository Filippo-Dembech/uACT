import { Link } from 'react-router-dom'

const navItems = [
  { label: 'RUOLO', path: '/ruolo' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-indigo-950 flex flex-col items-center pt-16 px-4">
      <h1 className="text-6xl font-black text-white tracking-tight mb-2">uACT</h1>
      <p className="text-purple-300 text-lg mb-12">Your Acceptance and Commitment Therapy</p>

      <nav className="flex flex-wrap gap-3 justify-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold tracking-widest text-sm transition-colors duration-200 shadow-lg shadow-purple-900/50"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
