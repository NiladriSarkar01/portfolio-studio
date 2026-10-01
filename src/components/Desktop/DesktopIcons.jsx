import { WINDOW_DEFAULTS } from "./windowDefs.js";

const ICONS = [
  {
    id: WINDOW_DEFAULTS.about.id,
    icon: WINDOW_DEFAULTS.about.icon,
    label: WINDOW_DEFAULTS.about.title,
  },
  {
    id: WINDOW_DEFAULTS.projects.id,
    icon: WINDOW_DEFAULTS.projects.icon,
    label: WINDOW_DEFAULTS.projects.title,
  },
  {
    id: WINDOW_DEFAULTS.resume.id,
    icon: WINDOW_DEFAULTS.resume.icon,
    label: WINDOW_DEFAULTS.resume.title,
  },
  {
    id: WINDOW_DEFAULTS.terminal.id,
    icon: WINDOW_DEFAULTS.terminal.icon,
    label: WINDOW_DEFAULTS.terminal.title,
  },
  {
    id: WINDOW_DEFAULTS.contact.id,
    icon: WINDOW_DEFAULTS.contact.icon,
    label: WINDOW_DEFAULTS.contact.title,
  },
  {
    id: WINDOW_DEFAULTS.files.id,
    icon: WINDOW_DEFAULTS.files.icon,
    label: WINDOW_DEFAULTS.files.title,
  },
  {
    id: WINDOW_DEFAULTS.skills.id,
    icon: WINDOW_DEFAULTS.skills.icon,
    label: WINDOW_DEFAULTS.skills.title,
  },
  {
    id: WINDOW_DEFAULTS.api_tester.id,
    icon: WINDOW_DEFAULTS.api_tester.icon,
    label: WINDOW_DEFAULTS.api_tester.title,
  },
];

export default function DesktopIcons({ onOpen, openIds, compact = false }) {
  return (
    <div
      className={`absolute left-3 top-3 z-10 flex max-h-[calc(100%-1.5rem)] gap-2 overflow-y-auto pr-1 ${
        compact
          ? "max-w-[calc(100%-1.5rem)] flex-row flex-wrap"
          : "max-w-[calc(100%-1.5rem)] flex-col"
      }`}
    >
      {ICONS.map((ic) => (
        <button
          key={ic.id}
          onDoubleClick={() => onOpen(ic.id)}
          className={`flex flex-col items-center gap-1 p-2 w-20 rounded-2xl border-2 transition-all
            ${
              openIds.includes(ic.id)
                ? "border-[#35271f] bg-[#b9855f] shadow-[3px_3px_0_#35271f]"
                : "border-transparent hover:border-[#d0bca4] hover:bg-white/70"
            }`}
        >
          <span className="text-2xl leading-none">{ic.icon}</span>
          <span className="text-[12px] text-portfolio-text text-center leading-tight drop-shadow-sm">
            {ic.label}
          </span>
        </button>
      ))}
    </div>
  );
}
