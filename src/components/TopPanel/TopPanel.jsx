import { useState, useEffect } from 'react'

const MENU_ITEMS = [
  { label: 'About Me',    id: 'about' },
  { label: 'My Projects', id: 'projects' },
  { label: 'Resume',      id: 'resume' },
  { label: 'Skills',      id: 'skills' },
  { label: '---' },
  { label: 'Terminal',    id: 'terminal' },
  { label: 'Files',       id: 'files' },
  { label: '---' },
  { label: 'Contact Me',  id: 'contact' },
]

export default function TopPanel({ onOpenApp }) {
  const [time, setTime]       = useState('')
  const [menuOpen, setMenu]   = useState(false)

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative z-50">
      <div className="min-h-9 bg-[#fbf7f0] border-b-2 border-dashed border-[#d0bca4] flex flex-wrap items-center px-2 py-1 gap-1 text-xs">

        {/* Applications menu */}
        <button
          onClick={() => setMenu(m => !m)}
          className={`px-2 py-1 rounded-full text-[#35271f] hover:bg-[#d9b782] transition-colors ${menuOpen ? 'bg-[#d9b782]' : ''}`}
        >
          ⬛ Applications
        </button>

        <div className="w-px h-4 bg-portfolio-border mx-1" />

        <button onClick={() => onOpenApp('files')}    className="px-2 py-1 rounded-full text-[#35271f] hover:bg-[#c7b69a]">Places</button>
        <button onClick={() => onOpenApp('terminal')} className="px-2 py-1 rounded-full text-[#35271f] hover:bg-[#ddcdb9]">System</button>

        <div className="flex-1" />

        {/* Systray */}
        <span className="text-[#786b5f] text-[14px] px-1" title="Network">📶</span>
        <span className="text-[#786b5f] text-[14px] px-1" title="Volume">🔊</span>
        <span className="text-[#786b5f] text-[14px] px-1" title="Battery">🔋</span>

        <div className="w-px h-4 bg-portfolio-border mx-1" />
        <span className="text-[#35271f] px-2">{time}</span>
      </div>

      {/* Dropdown */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
          <div className="absolute top-full left-0 z-50 bg-white border-2 border-[#35271f] rounded-b-2xl shadow-[4px_4px_0_#35271f] w-52 py-1">
            {MENU_ITEMS.map((item, i) =>
              item.label === '---'
                ? <div key={i} className="my-1 border-t border-portfolio-border" />
                : (
                  <button
                    key={item.id}
                    onClick={() => { onOpenApp(item.id); setMenu(false) }}
                    className="w-full text-left px-3 py-1.5 text-[14px] text-[#5f5145] hover:bg-[#d9b782] hover:text-[#35271f] transition-colors"
                  >
                    {item.label}
                  </button>
                )
            )}
          </div>
        </>
      )}
    </div>
  )
}
