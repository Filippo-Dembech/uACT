import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRoles, getAnswersByRole } from '../db/indexeddb'
import type { Role, Answer } from '../db/indexeddb'
import QuestionBlock from '../components/QuestionBlock'
import { usePageTitle } from '../hooks/usePageTitle'
import { QUESTIONS } from '../content/questions'

export default function RuoloDetail() {
  const { id } = useParams<{ id: string }>()
  const [role, setRole] = useState<Role | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  usePageTitle(role ? role.name : 'Ruolo')

  async function load() {
    if (!id) return
    const roles = await getRoles()
    setRole(roles.find((r) => r.id === id) ?? null)
    setAnswers(await getAnswersByRole(id))
  }

  useEffect(() => { load() }, [id])

  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 to-indigo-950 flex items-center justify-center">
        <p className="text-purple-400">Ruolo non trovato.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-indigo-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Link to="/ruolo" className="text-purple-400 hover:text-purple-200 text-sm mb-6 inline-block transition-colors">
          ← Torna ai ruoli
        </Link>

        <h2 className="text-3xl font-black text-white mb-1">{role.name}</h2>
        <p className="text-purple-400 text-sm mb-8">
          Immagina un'intervista con una persona con cui interagisci in questo ruolo. Come vorresti che rispondesse alla seguenti domande?
        </p>

        <div className="space-y-5">
          {QUESTIONS.map((q, i) => (
            <QuestionBlock
              key={i}
              roleId={role.id}
              questionIndex={i}
              question={q}
              answers={answers.filter((a) => a.questionIndex === i)}
              onRefresh={load}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
