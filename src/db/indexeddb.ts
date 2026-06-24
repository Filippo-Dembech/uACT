const DB_NAME = 'uACT'
const DB_VERSION = 1

export interface Role {
  id: string
  name: string
  createdAt: number
}

export interface Answer {
  id: string
  roleId: string
  questionIndex: number
  text: string
  archived: boolean
  createdAt: number
  updatedAt: number
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('roles')) {
        db.createObjectStore('roles', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('answers')) {
        const store = db.createObjectStore('answers', { keyPath: 'id' })
        store.createIndex('roleId', 'roleId', { unique: false })
        store.createIndex('roleId_questionIndex', ['roleId', 'questionIndex'], { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function tx<T>(
  db: IDBDatabase,
  stores: string | string[],
  mode: IDBTransactionMode,
  fn: (tx: IDBTransaction) => IDBRequest<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = db.transaction(stores, mode)
    const req = fn(t)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

// Roles
export async function getRoles(): Promise<Role[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const t = db.transaction('roles', 'readonly')
    const req = t.objectStore('roles').getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function addRole(name: string): Promise<Role> {
  const db = await openDB()
  const role: Role = { id: crypto.randomUUID(), name, createdAt: Date.now() }
  await tx(db, 'roles', 'readwrite', (t) => t.objectStore('roles').add(role))
  return role
}

export async function deleteRole(id: string): Promise<void> {
  const db = await openDB()
  await tx(db, 'roles', 'readwrite', (t) => t.objectStore('roles').delete(id))
  // Delete all answers for this role
  const answers = await getAnswersByRole(id)
  for (const a of answers) {
    await tx(db, 'answers', 'readwrite', (t) => t.objectStore('answers').delete(a.id))
  }
}

// Answers
export async function getAnswersByRole(roleId: string): Promise<Answer[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const t = db.transaction('answers', 'readonly')
    const req = t.objectStore('answers').index('roleId').getAll(roleId)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function addAnswer(roleId: string, questionIndex: number, text: string): Promise<Answer> {
  const db = await openDB()
  const answer: Answer = {
    id: crypto.randomUUID(),
    roleId,
    questionIndex,
    text,
    archived: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  await tx(db, 'answers', 'readwrite', (t) => t.objectStore('answers').add(answer))
  return answer
}

export async function updateAnswer(id: string, updates: Partial<Pick<Answer, 'text' | 'archived'>>): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const t = db.transaction('answers', 'readwrite')
    const store = t.objectStore('answers')
    const getReq = store.get(id)
    getReq.onsuccess = () => {
      const answer: Answer = { ...getReq.result, ...updates, updatedAt: Date.now() }
      const putReq = store.put(answer)
      putReq.onsuccess = () => resolve()
      putReq.onerror = () => reject(putReq.error)
    }
    getReq.onerror = () => reject(getReq.error)
  })
}

export async function deleteAnswer(id: string): Promise<void> {
  const db = await openDB()
  await tx(db, 'answers', 'readwrite', (t) => t.objectStore('answers').delete(id))
}
