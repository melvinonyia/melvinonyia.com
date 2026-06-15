import { useState, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { SocialLinks } from './SocialLinks'

interface NavItem {
  label: string
  to: '/about' | '/writing' | '/work' | '/contact'
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'About', to: '/about' },
  { label: 'Writing', to: '/writing' },
  { label: 'Work', to: '/work' },
  { label: 'Contact', to: '/contact' },
] as const

function Logo() {
  return (
    <svg viewBox="0 0 850 966" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M848-1v969H683.68V183.57L848-1zM472.39 394.67 350.4 514.8 166.56 284.55v682.29l-164.32-.05V1.42h163.42l306.73 393.25z" />
    </svg>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!open) return
    const previousBody = document.body.style.overflow
    const previousHtml = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousBody
      document.documentElement.style.overflow = previousHtml
    }
  }, [open])

  return (
    <header className="site-header">
      <Link to="/" className="site-logo" aria-label="Home">
        <Logo />
      </Link>

      <button
        type="button"
        className="site-icon"
        aria-expanded={open}
        aria-label="menu-icon"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="site-icon-line first" />
        <span className="site-icon-line second" />
      </button>

      <nav
        className={open ? 'site-drawer is-open' : 'site-drawer'}
        aria-hidden={!open}
        aria-label="Primary"
      >
        <div className="site-drawer-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.to}
              type="button"
              className="site-drawer-item"
              onClick={() => {
                setOpen(false)
                navigate({ to: item.to })
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="site-drawer-social">
          <SocialLinks />
        </div>
      </nav>
    </header>
  )
}
