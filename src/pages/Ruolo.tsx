import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2, FiPlus } from 'react-icons/fi'
import { getRoles, addRole, deleteRole } from '../db/indexeddb'
import type { Role } from '../db/indexeddb'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Ruolo() {
  const [roles, setRoles] = useState<Role[]>([])
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  usePageTitle('Ruoli')

  async function load() {
    setRoles(await getRoles())
  }

  useEffect(() => { load() }, [])

  async function handleCreate() {
    const name = newName.trim()
    if (!name) return
    await addRole(name)
    setNewName('')
    setCreating(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminare questo ruolo e tutte le sue risposte?')) return
    await deleteRole(id)
    load()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-indigo-950 px-4 py-10">
      <div className="max-w-xl mx-auto">
        <Link to="/" className="text-purple-400 hover:text-purple-200 text-sm mb-8 inline-block transition-colors">
          ← Home
        </Link>

        <h2 className="text-4xl font-black text-white mb-2">Ruoli</h2>
        <p className="text-purple-400 text-sm mb-8">
          Scegli un ruolo da esplorare o creane uno nuovo.
        </p>

        {roles.length > 0 && (
          <div className="space-y-3 mb-8">
            {roles.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between bg-purple-900/30 border border-purple-700/40 rounded-2xl px-5 py-4 group"
              >
                <Link
                  to={`/ruolo/${r.id}`}
                  className="text-white font-semibold hover:text-purple-300 transition-colors flex-1"
                >
                  {r.name}
                </Link>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-red-500 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all ml-4"
                  title="Elimina ruolo"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {creating ? (
          <div className="bg-purple-900/30 border border-purple-700/40 rounded-2xl p-5 space-y-4">
            <p className="text-purple-200 font-semibold">
              Che ruolo svolgi nella vita di tutti i giorni?
            </p>
            <p className="text-purple-400 text-xs leading-relaxed">
              Per esempio: amico, partner, genitore, vicino di casa, dipendente, membro di un team, studente...
            </p>
            <input
              className="w-full bg-purple-950 border border-purple-500 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-purple-600"
              placeholder="Nome del ruolo"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors font-semibold"
              >
                Crea ruolo
              </button>
              <button
                onClick={() => { setCreating(false); setNewName('') }}
                className="px-5 py-2 bg-purple-800 hover:bg-purple-700 text-purple-300 text-sm rounded-lg transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border-2 border-dashed border-purple-700 hover:border-purple-500 text-purple-400 hover:text-purple-200 transition-colors text-sm font-semibold"
          >
            <FiPlus size={16} /> Crea un nuovo ruolo
          </button>
        )}
      </div>
    </div>
  )
}
