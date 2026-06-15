import { useNavigate } from '@tanstack/react-router'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { searchIndex, type SearchEntry } from '~/lib/search/indexer'

interface CommandPaletteProps {
  entries: SearchEntry[]
  onClose: () => void
}

type Navigate = ReturnType<typeof useNavigate>
type NavigateOptions = Parameters<Navigate>[0]

function kindLabel(kind: SearchEntry['kind']): string {
  switch (kind) {
    case 'route':
      return 'Route'
    case 'work':
      return 'Work'
    case 'essay':
      return 'Essay'
    case 'external':
      return 'External'
    case 'mailto':
      return 'Email'
  }
}

function rowClass(isSelected: boolean): string {
  return `palette-row${isSelected ? ' is-selected' : ''}`
}

export function CommandPalette({ entries, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const results = useMemo(() => searchIndex(entries, query), [entries, query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setSelected(0)
  }, [query])

  const activate = useCallback(
    (entry: SearchEntry) => {
      if (entry.kind === 'external') {
        if (entry.href) {
          window.open(entry.href, '_blank', 'noopener,noreferrer')
        }
        onClose()
        return
      }
      if (entry.kind === 'mailto') {
        if (entry.href) {
          window.location.href = entry.href
        }
        onClose()
        return
      }
      if (entry.to) {
        const navOptions = {
          to: entry.to,
          params: entry.params,
        } as NavigateOptions
        void navigate(navOptions)
      }
      onClose()
    },
    [navigate, onClose],
  )

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelected((s) => {
          if (results.length === 0) return 0
          return (s + 1) % results.length
        })
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelected((s) => {
          if (results.length === 0) return 0
          return (s - 1 + results.length) % results.length
        })
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        const active = results[selected]
        if (active) activate(active)
      }
    },
    [activate, onClose, results, selected],
  )

  const handleBackdropClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-palette-index="${selected}"]`,
    )
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'nearest' })
    }
  }, [selected])

  return (
    <div
      data-palette-backdrop
      onClick={handleBackdropClick}
      className="palette-backdrop"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="palette-dialog"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="SEARCH —"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="palette-input"
          aria-controls="command-palette-listbox"
          aria-activedescendant={
            results[selected] ? `palette-item-${selected}` : undefined
          }
        />
        {results.length === 0 ? (
          <div className="palette-empty">No results</div>
        ) : (
          <ul
            id="command-palette-listbox"
            role="listbox"
            ref={listRef}
            className="palette-list"
          >
            {results.map((entry, i) => {
              const isSelected = i === selected
              const itemId = `palette-item-${i}`
              const itemClass = rowClass(isSelected)
              const itemContent = (
                <>
                  <span className="palette-row-title">{entry.title}</span>
                  <span className="palette-row-kind">{kindLabel(entry.kind)}</span>
                  {isSelected && (
                    <span aria-hidden="true" className="palette-row-return">
                      ↵
                    </span>
                  )}
                </>
              )

              if (entry.kind === 'external' && entry.href) {
                return (
                  <li key={entry.id}>
                    <a
                      id={itemId}
                      role="option"
                      aria-selected={isSelected}
                      data-palette-index={i}
                      href={entry.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={itemClass}
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => onClose()}
                    >
                      {itemContent}
                    </a>
                  </li>
                )
              }

              if (entry.kind === 'mailto' && entry.href) {
                return (
                  <li key={entry.id}>
                    <a
                      id={itemId}
                      role="option"
                      aria-selected={isSelected}
                      data-palette-index={i}
                      href={entry.href}
                      className={itemClass}
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => onClose()}
                    >
                      {itemContent}
                    </a>
                  </li>
                )
              }

              return (
                <li key={entry.id}>
                  <button
                    id={itemId}
                    role="option"
                    type="button"
                    aria-selected={isSelected}
                    data-palette-index={i}
                    className={itemClass}
                    onMouseEnter={() => setSelected(i)}
                    onClick={() => activate(entry)}
                  >
                    {itemContent}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
