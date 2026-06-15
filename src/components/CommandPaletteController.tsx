import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { SearchEntry } from '~/lib/search/indexer'
import { CommandPalette } from './CommandPalette'

const OpenCommandPaletteContext = createContext<(() => void) | null>(null)

export function useOpenCommandPalette(): (() => void) | null {
  return useContext(OpenCommandPaletteContext)
}

export function CommandPaletteController({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [entries, setEntries] = useState<SearchEntry[] | null>(null)

  const openPalette = useCallback(async () => {
    if (!entries) {
      const mod = await import('~/lib/search/data')
      setEntries(mod.getSearchEntries())
    }
    setOpen(true)
  }, [entries])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        void openPalette()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openPalette])

  const trigger = useCallback(() => {
    void openPalette()
  }, [openPalette])

  return (
    <OpenCommandPaletteContext.Provider value={trigger}>
      {children}
      {open && entries && (
        <CommandPalette entries={entries} onClose={() => setOpen(false)} />
      )}
    </OpenCommandPaletteContext.Provider>
  )
}
