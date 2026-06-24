import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiDownload, FiUpload } from 'react-icons/fi'
import { exportData, importData } from '../db/indexeddb'
import { usePageTitle } from '../hooks/usePageTitle'

const navItems = [
  { label: 'RUOLO', path: '/ruolo' },
]

export default function Home() {
  usePageTitle()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<'idle' | 'ok' | 'error'>('idle')

  async function handleExport() {
    await exportData()
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importData(file)
      setImportStatus('ok')
    } catch {
      setImportStatus('error')
    } finally {
      e.target.value = ''
      setTimeout(() => setImportStatus('idle'), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-indigo-950 flex flex-col items-center pt-16 px-4">
      <img src="/uACT/logo.svg" alt="uACT logo" className="w-16 h-16 mb-4 rounded-2xl shadow-lg shadow-purple-900/50" />
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

      <div className="mt-20 flex flex-col items-center gap-3">
        <p className="text-purple-600 text-xs tracking-widest uppercase mb-1">Backup dati</p>

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-700 hover:border-purple-500 text-purple-400 hover:text-purple-200 text-xs font-semibold transition-colors"
          >
            <FiDownload size={13} /> Esporta
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-700 hover:border-purple-500 text-purple-400 hover:text-purple-200 text-xs font-semibold transition-colors"
          >
            <FiUpload size={13} /> Importa
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>

        {importStatus === 'ok' && (
          <p className="text-green-400 text-xs">Dati importati correttamente.</p>
        )}
        {importStatus === 'error' && (
          <p className="text-red-400 text-xs">File non valido o corrotto.</p>
        )}
      </div>
    </div>
  )
}
