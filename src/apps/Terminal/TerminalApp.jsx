import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { sendCommand } from "../../services/api";
import "@xterm/xterm/css/xterm.css";
import { refreshPortfolio, leavePortfolio } from "../../system/systemCommands";

import { openApp } from "../../utils/desktopController";

// Color shortcuts for xterm escape codes
const C = {
  red: "\x1b[38;2;185;95;67m",
  green: "\x1b[38;2;104;123;67m",
  amber: "\x1b[38;2;177;122;49m",
  cyan: "\x1b[38;2;40;107;104m",
  blue: "\x1b[38;2;49;95;145m",
  muted: "\x1b[38;2;109;113;104m",
  white: "\x1b[38;2;46;52;49m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

const PROMPT = `${C.green}visitor${C.reset}${C.muted}@${C.reset}${C.cyan}portfolio${C.reset}:${C.white}~${C.reset}$ `;
const WORKSPACE_PROMPT = `${C.green}portfolio${C.reset}${C.muted}@${C.reset}${C.cyan}studio${C.reset}:${C.white}~/workspace${C.reset}$ `;

let workspaceMode = false;

const SYS_COMMAND_LIST = ["refresh", "leave"];

const SYSTEM_COMMANDS = {
  refresh: refreshPortfolio,
  leave: leavePortfolio,
};

export default function TerminalApp() {
  const containerRef = useRef(null);
  const termRef = useRef(null);
  const fitRef = useRef(null);
  const lineRef = useRef(""); // current input line
  const histRef = useRef([]); // command history
  const histIdxRef = useRef(-1);

  useEffect(() => {
    if (!containerRef.current || termRef.current) return;

    // Init xterm
    const term = new Terminal({
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: window.innerWidth < 420 ? 12 : 14,
      lineHeight: 1.25,
      theme: {
        background: "#fbf7f0",
        foreground: "#35271f",
        cursor: "#805239",
        cursorAccent: "#fbf7f0",
        black: "#35271f",
        red: "#805239",
        green: "#77734f",
        yellow: "#a76d3d",
        blue: "#8b5e3c",
        magenta: "#73513b",
        cyan: "#73513b",
        white: "#5f5145",
        brightBlack: "#786b5f",
        brightRed: "#a65f45",
        brightGreen: "#77734f",
        brightYellow: "#b17a45",
        brightBlue: "#8b5e3c",
        brightMagenta: "#73513b",
        brightCyan: "#73513b",
        brightWhite: "#35271f",
      },
      cursorBlink: true,
      scrollback: 2000,
    });

    const fit = new FitAddon();
    const links = new WebLinksAddon();
    term.loadAddon(fit);
    term.loadAddon(links);
    term.open(containerRef.current);
    fit.fit();

    termRef.current = term;
    fitRef.current = fit;

    term.writeln(
      `${C.cyan}${C.bold}Portfolio Studio${C.reset} ${C.muted}· interactive portfolio terminal${C.reset}`,
    );
    term.writeln(
      `${C.muted}Try ${C.red}help${C.reset}${C.muted} to explore, or pick a shortcut above.${C.reset}`,
    );
    term.writeln("");
    term.write(workspaceMode ? WORKSPACE_PROMPT : PROMPT);

    // Handle input
    term.onData(async (data) => {
      const code = data.charCodeAt(0);

      // Enter
      if (data === "\r") {
        const cmd = lineRef.current.trim();
        lineRef.current = "";
        histIdxRef.current = -1;
        term.writeln("");

        if (cmd) {
          histRef.current.unshift(cmd);
          await executeCommand(term, cmd);
        }
        term.write(workspaceMode ? WORKSPACE_PROMPT : PROMPT);
        return;
      }

      // Backspace
      if (code === 127) {
        if (lineRef.current.length > 0) {
          lineRef.current = lineRef.current.slice(0, -1);
          term.write("\b \b");
        }
        return;
      }

      // Arrow up — history
      if (data === "\x1b[A") {
        const h = histRef.current;
        if (histIdxRef.current < h.length - 1) {
          histIdxRef.current++;
          replaceLine(term, h[histIdxRef.current]);
        }
        return;
      }

      // Arrow down — history
      if (data === "\x1b[B") {
        if (histIdxRef.current > 0) {
          histIdxRef.current--;
          replaceLine(term, histRef.current[histIdxRef.current]);
        } else {
          if (histIdxRef.current != -1) {
            histIdxRef.current = -1;
            replaceLine(term, "");
          }
        }
        return;
      }

      // Tab — basic autocomplete
      if (data === "\t") {
        const suggestions = [
          "help",
          "whoami",
          "ls",
          "cat",
          "pwd",
          "clear",
          "open",
          "github",
          "linkedin",
          "nmap",
          "skills",
        ];
        const partial = lineRef.current;
        const match = suggestions.find(
          (s) => s.startsWith(partial) && s !== partial,
        );
        if (match) {
          const completion = match.slice(partial.length);
          term.write(completion);
          lineRef.current += completion;
        }
        return;
      }

      // Printable chars
      if (code >= 32) {
        term.write(data);
        lineRef.current += data;
      }
    });

    // Keep the terminal legible as its window is resized.
    const fitTerminal = () => {
      const width = containerRef.current?.getBoundingClientRect().width ?? 0;
      term.options.fontSize = width < 420 ? 12 : width < 640 ? 13 : 14;
      fitRef.current?.fit();
    };
    const ro = new ResizeObserver(fitTerminal);
    ro.observe(containerRef.current);
    window.addEventListener("resize", fitTerminal);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fitTerminal);
      term.dispose();
      termRef.current = null;
    };
  }, []);

  const replaceLine = (term, text) => {
    // Move cursor left by the current command length
    if (lineRef.current.length > 0) {
      term.write(`\x1b[${lineRef.current.length}D`);
    }

    // Clear from cursor to end of line
    term.write("\x1b[K");

    // Write the new command
    term.write(text);

    lineRef.current = text;
  };

  const executeCommand = async (term, cmd) => {
    // Client-side commands that don't need the backend
    if (cmd === "clear") {
      term.clear();
      return;
    }

    if (cmd === "workspace") {
      workspaceMode = true;
      term.writeln(`${C.green}Workspace session started.`);
      return;
    }

    if (cmd === "exit" || cmd === "logout") {
      workspaceMode = false;
      term.writeln(`${C.green}Workspace session ended.`);
      return;
    }

    try {
      let res;
      if (SYS_COMMAND_LIST.includes(cmd)) {
        res = SYSTEM_COMMANDS[cmd]();
      } else {
        res = await sendCommand(cmd);
        if (res.action === "openApp") {
          console.log(res.appId);

          openApp(res.appId);
        }
        console.log(res);
      }
      // Output from Spring Boot (ANSI supported)
      term.writeln(res.output || "");
      // If Spring Boot returns an action (e.g. open a window)
      // You can handle res.action / res.appId in parent via a callback
    } catch (err) {
      if (err.response?.status === 404 || err.code === "ERR_NETWORK") {
        // Backend not running. All terminal output comes from the API, so there
        // is deliberately no local copy of the data to fall back to.
        term.writeln(
          `${C.amber}[offline] Backend not reachable. Run: ./mvnw spring-boot:run${C.reset}`,
        );
      } else {
        term.writeln(`${C.red}Error: ${err.message}${C.reset}`);
      }
    }
  };

  const chooseCommand = (command) => {
    const term = termRef.current;
    if (!term) return;

    replaceLine(term, command);
    term.focus();
  };

  return (
    <div className="flex h-full min-h-[280px] w-full min-w-0 flex-col bg-[#f4ede3] p-3 sm:p-4">
      <div className="sticky top-0 z-10 -mx-3 -mt-3 mb-2 shrink-0 bg-[#f4ede3] px-3 pt-3 sm:-mx-4 sm:-mt-4 sm:px-4 sm:pt-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full border border-[#35271f] bg-[#c7b69a]" />
              <h2 className="truncate text-sm font-black tracking-tight text-[#35271f]">
                Portfolio Studio{" "}
                <span className="font-mono text-[10px] font-medium text-[#786b5f]">
                  / terminal
                </span>
              </h2>
            </div>
            <p className="mt-1 pl-[18px] text-[10px] text-[#786b5f]">
              Explore the portfolio from the command line.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              termRef.current?.clear();
              termRef.current?.focus();
            }}
            className="rounded-full border-2 border-[#35271f] bg-white px-3 py-1.5 font-mono text-[10px] font-bold text-[#35271f] shadow-[2px_2px_0_#35271f] transition hover:-translate-y-0.5 hover:bg-[#d9b782]"
          >
            Clear screen
          </button>
        </div>

        <div className="mb-3 flex shrink-0 flex-wrap gap-2">
          {["help", "whoami", "ls", "skills"].map((command) => (
            <button
              key={command}
              type="button"
              onClick={() => chooseCommand(command)}
              className="rounded-full border-2 border-[#35271f] bg-white px-3 py-1 font-mono text-[10px] font-bold text-[#5f5145] shadow-[2px_2px_0_#35271f] transition hover:-translate-y-0.5 hover:bg-[#c7b69a]"
            >
              {command}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[clamp(220px,48vh,360px)] min-h-0 w-full min-w-0 flex-none overflow-hidden rounded-2xl border-2 border-[#35271f] bg-[#fbf7f0] p-2 shadow-[4px_4px_0_#35271f] sm:p-3">
        <div ref={containerRef} className="h-full min-h-0 w-full min-w-0 overflow-hidden" />
      </div>
    </div>
  );
}
