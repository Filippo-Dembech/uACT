import { useState } from 'react'
import { FiEdit2, FiArchive, FiTrash2, FiRotateCcw, FiPlus, FiX, FiCheck } from 'react-icons/fi'
import type { Answer } from '../db/indexeddb'
import { addAnswer, updateAnswer, deleteAnswer } from '../db/indexeddb'

interface Props {
  roleId: string
  questionIndex: number
  question: string
  answers: Answer[]
  onRefresh: () => void
}

export default function QuestionBlock({ roleId, questionIndex, question, answers, onRefresh }: Props) {
  const [showInput, setShowInput] = useState(false)
  const [inputText, setInputText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [showArchived, setShowArchived] = useState(false)

  const active = answers.filter((a) => !a.archived)
  const archived = answers.filter((a) => a.archived)

  async function handleAdd() {
    if (!inputText.trim()) return
    await addAnswer(roleId, questionIndex, inputText.trim())
    setInputText('')
    setShowInput(false)
    onRefresh()
  }

  async function handleSaveEdit(id: string) {
    if (!editText.trim()) return
    await updateAnswer(id, { text: editText.trim() })
    setEditingId(null)
    onRefresh()
  }

  async function handleArchive(id: string) {
    await updateAnswer(id, { archived: true })
    onRefresh()
  }

  async function handleUnarchive(id: string) {
    await updateAnswer(id, { archived: false })
    onRefresh()
  }

  async function handleDelete(id: string) {
    await deleteAnswer(id)
    onRefresh()
  }

  function startEdit(a: Answer) {
    setEditingId(a.id)
    setEditText(a.text)
  }

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-2xl p-5 space-y-4">
      <p className="text-purple-200 font-semibold text-sm leading-relaxed">{question}</p>

      <ul className="space-y-2">
        {active.map((a) => (
          <li key={a.id} className="flex items-start gap-2 group">
            {editingId === a.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  className="flex-1 bg-purple-950 border border-purple-500 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(a.id)}
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(a.id)}
                  title="Salva"
                  className="p-1.5 text-purple-400 hover:text-purple-200 transition-colors"
                >
                  <FiCheck size={15} />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  title="Annulla"
                  className="p-1.5 text-purple-400 hover:text-purple-200 transition-colors"
                >
                  <FiX size={15} />
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-white text-sm leading-relaxed">{a.text}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => startEdit(a)}
                    title="Modifica"
                    className="p-1.5 text-purple-400 hover:text-purple-200 transition-colors"
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleArchive(a.id)}
                    title="Archivia"
                    className="p-1.5 text-purple-400 hover:text-purple-200 transition-colors"
                  >
                    <FiArchive size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    title="Elimina"
                    className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {showInput ? (
        <div className="flex gap-2">
          <input
            className="flex-1 bg-purple-950 border border-purple-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-purple-600"
            placeholder="Scrivi una risposta..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <button
            onClick={handleAdd}
            title="Salva"
            className="p-1.5 text-purple-400 hover:text-purple-200 transition-colors"
          >
            <FiCheck size={15} />
          </button>
          <button
            onClick={() => { setShowInput(false); setInputText('') }}
            title="Annulla"
            className="p-1.5 text-purple-400 hover:text-purple-200 transition-colors"
          >
            <FiX size={15} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-1.5 text-purple-400 hover:text-purple-200 text-sm transition-colors"
        >
          <FiPlus size={15} />
          Aggiungi risposta
        </button>
      )}

      {archived.length > 0 && (
        <div className="border-t border-purple-800/50 pt-3">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="text-purple-500 hover:text-purple-300 text-xs transition-colors"
          >
            {showArchived ? '▲' : '▶'} Archiviate ({archived.length})
          </button>
          {showArchived && (
            <ul className="mt-2 space-y-2">
              {archived.map((a) => (
                <li key={a.id} className="flex items-start gap-2 group opacity-50">
                  <span className="flex-1 text-purple-300 text-sm italic line-through">{a.text}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => handleUnarchive(a.id)}
                      title="Ripristina"
                      className="p-1.5 text-purple-400 hover:text-purple-200 transition-colors"
                    >
                      <FiRotateCcw size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      title="Elimina"
                      className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
