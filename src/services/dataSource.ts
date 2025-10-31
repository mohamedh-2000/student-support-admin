// src/services/dataSource.ts

import { readLS, writeLS } from '../utils/localStorage'
import { LS_KEYS } from '../utils/storage'

// מקור הנתונים: 'local' או 'firestore' (ברירת מחדל: local)
const SOURCE = (import.meta.env.VITE_DATA_SOURCE ?? 'local').toLowerCase() as
  | 'local'
  | 'firestore'

// --- Firestore service ---
type FsApi = {
  list: <T = any>(col: string) => Promise<T[]>
  get: <T = any>(col: string, id: string) => Promise<T | null>
  create: <T = any>(col: string, data: Partial<T>) => Promise<any>
  patch: <T = any>(col: string, id: string, data: Partial<T>) => Promise<any>
  remove: (col: string, id: string) => Promise<any>
}

let fs: FsApi | null = null

try {
  if (SOURCE === 'firestore') {
    const mod = await import('./firestore')
    fs = {
      list: mod.list,
      get: mod.get,
      create: mod.create,
      patch: mod.patch,
      remove: mod.remove,
    }
  }
} catch (e) {
  console.warn('Firestore unavailable, using local mode.')
  fs = null
}

// --- Local Storage fallback ---
function lsList<T = any>(col: string): Promise<T[]> {
  const key = (LS_KEYS as any)[col] ?? col
  const arr = readLS<T[]>(key) ?? []
  return Promise.resolve(arr)
}

function lsGet<T = any>(col: string, id: string): Promise<T | null> {
  const key = (LS_KEYS as any)[col] ?? col
  const arr = readLS<T[]>(key) ?? []
  const doc = arr.find((x: any) => x.id === id) ?? null
  return Promise.resolve(doc)
}

function lsCreate<T = any>(col: string, data: Partial<T>): Promise<{ id: string } & T> {
  const key = (LS_KEYS as any)[col] ?? col
  const arr = readLS<any[]>(key) ?? []
  const doc = { id: crypto.randomUUID(), ...data }
  writeLS(key, [doc, ...arr])
  return Promise.resolve(doc as { id: string } & T)
}

function lsPatch<T = any>(col: string, id: string, data: Partial<T>): Promise<void> {
  const key = (LS_KEYS as any)[col] ?? col
  const arr = readLS<any[]>(key) ?? []
  const next = arr.map((x: any) => (x.id === id ? { ...x, ...data } : x))
  writeLS(key, next)
  return Promise.resolve()
}

function lsRemove(col: string, id: string): Promise<void> {
  const key = (LS_KEYS as any)[col] ?? col
  const arr = readLS<any[]>(key) ?? []
  writeLS(key, arr.filter((x: any) => x.id !== id))
  return Promise.resolve()
}

export const ds = {
  source: SOURCE,
  list: <T = any>(col: string) => (fs ? fs.list<T>(col) : lsList<T>(col)),
  get: <T = any>(col: string, id: string) => (fs ? fs.get<T>(col, id) : lsGet<T>(col, id)),
  create: async <T = any>(col: string, data: Partial<T>) => {
    if (fs) {
      // Firestore addDoc returns a DocumentReference — normalize to return { id, ...data }
      const res = await fs.create<T>(col, data)
      try {
        // DocumentReference has an `id` property
        const id = (res as any).id
        return { id, ...(data as T) }
      } catch {
        return res
      }
    }
    return lsCreate<T>(col, data)
  },
  patch: async <T = any>(col: string, id: string, data: Partial<T>) => {
    if (fs) {
      await fs.patch<T>(col, id, data)
      // fetch and return updated doc for consistency
      return fs.get<T>(col, id)
    }
    await lsPatch<T>(col, id, data)
    return lsGet<T>(col, id)
  },
  remove: (col: string, id: string) => (fs ? fs.remove(col, id) : lsRemove(col, id)),
}

// Also export individual functions for stable imports across the codebase
export const list = <T = any>(col: string) => ds.list<T>(col)
export const get = <T = any>(col: string, id: string) => ds.get<T>(col, id)
export const create = <T = any>(col: string, data: Partial<T>) => ds.create<T>(col, data)
export const patch = <T = any>(col: string, id: string, data: Partial<T>) => ds.patch<T>(col, id, data)
export const remove = (col: string, id: string) => ds.remove(col, id)

export default ds
