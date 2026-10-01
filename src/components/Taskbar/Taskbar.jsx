import { WINDOW_DEFAULTS } from '../Desktop/windowDefs'

const LAUNCHERS = [
  { id: 'terminal', icon: '💻', title: 'Terminal' },
  { id: 'files',    icon: '🗂',  title: 'Files' },
  { id: 'projects', icon: '📁', title: 'Projects' },
  { id: 'contact',  icon: '📡', title: 'Contact' },
]

export default function Taskbar({ openIds, windows, focusedId, onOpenApp, onFocus, onMinimize }) {
  return (
    <div className="relative z-50 min-h-12 bg-[#fbf7f0] flex flex-wrap items-center px-2 py-1.5 gap-1">

      {/* Quick launchers */}
      {LAUNCHERS.map(l => (
        <button
          key={l.id}
          title={l.title}
          onClick={() => onOpenApp(l.id)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-white border-2 border-[#35271f] hover:-translate-y-0.5 hover:bg-[#d9b782] transition-all"
        >
          {l.icon}
        </button>
      ))}

      <div className="w-px h-5 bg-portfolio-border mx-1" />

      {/* Open window buttons */}
      <div className="flex flex-1 gap-1 overflow-hidden">
        {openIds.map(id => {
          const cfg = WINDOW_DEFAULTS[id]
          const win = windows[id]
          const active = id === focusedId && !win?.minimized
          return (
            <button
              key={id}
              onClick={() => {
                if (win?.minimized) { onFocus(id) }
                else if (active)    { onMinimize(id) }
                else                { onFocus(id) }
              }}
              className={`h-6 px-2 text-[13px] rounded-sm border flex items-center gap-1 max-w-[160px] truncate transition-all
                ${active
                  ? 'bg-[#b9855f] border-[#35271f] text-[#35271f]'
                    : 'bg-white border-[#d0bca4] text-[#786b5f] hover:text-[#35271f]'
                }`}
            >
              <span>{cfg?.icon}</span>
              <span className="truncate">{cfg?.title}</span>
            </button>
          )
        })}
      </div>

      {/* Workspace indicator */}
      <div className="text-[13px] text-[#35271f] border-2 border-[#35271f] bg-[#c7b69a] rounded-full px-2 py-0.5">
        1
      </div>
    </div>
  )
}
