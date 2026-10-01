import { useMemo, useState } from "react";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const DEFAULT_HEADERS = [
  {
    key: "Accept",
    value: "application/json",
  },
];

const PRESETS = [
  {
    name: "Projects",
    method: "GET",
    path: "/api/projects",
  },
  {
    name: "Skills",
    method: "GET",
    path: "/api/skills",
  },
  {
    name: "Resume",
    method: "GET",
    path: "/api/resume",
  },
  {
    name: "Profile",
    method: "GET",
    path: "/api/profile",
  },
];

const INITIAL_RESPONSE = {
  status: null,
  statusText: "",
  time: null,
  size: null,
  headers: [],
  body: "",
};

function formatResponseBody(body) {
  if (!body) return "";

  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}

function getStatusClass(status) {
  if (!status) return "text-portfolio-muted";

  if (status >= 200 && status < 300) {
    return "text-portfolio-green";
  }

  if (status >= 400 && status < 500) {
    return "text-portfolio-amber";
  }

  if (status >= 500) {
    return "text-portfolio-red";
  }

  return "text-portfolio-cyan";
}

function getMethodClass(method) {
  switch (method) {
    case "GET":
      return "text-portfolio-green";

    case "POST":
      return "text-portfolio-cyan";

    case "PUT":
    case "PATCH":
      return "text-portfolio-amber";

    case "DELETE":
      return "text-portfolio-red";

    default:
      return "text-portfolio-muted";
  }
}

export default function ApiTesterApp() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState(DEFAULT_HEADERS);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(INITIAL_RESPONSE);

  const [activeTab, setActiveTab] = useState("body");
  const [responseTab, setResponseTab] = useState("response");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);

  const canHaveBody = ["POST", "PUT", "PATCH"].includes(method);

  const formattedBody = useMemo(
    () => formatResponseBody(response.body),
    [response.body],
  );

  const updateHeader = (index, field, value) => {
    setHeaders((current) =>
      current.map((header, i) =>
        i === index
          ? {
              ...header,
              [field]: value,
            }
          : header,
      ),
    );
  };

  const addHeader = () => {
    setHeaders((current) => [
      ...current,
      {
        key: "",
        value: "",
      },
    ]);
  };

  const removeHeader = (index) => {
    setHeaders((current) => current.filter((_, i) => i !== index));
  };

  const clearRequest = () => {
    setMethod("GET");
    setUrl("");
    setHeaders(DEFAULT_HEADERS);
    setBody("");
    setResponse(INITIAL_RESPONSE);
    setError("");
  };

  const loadPreset = (preset) => {
    setMethod(preset.method);
    setUrl(preset.path);
    setError("");
    setResponse(INITIAL_RESPONSE);

    if (preset.method === "GET") {
      setBody("");
    }
  };

  const loadHistory = (item) => {
    setMethod(item.method);
    setUrl(item.url);
    setHeaders(item.headers);
    setBody(item.body);
    setError("");
    setResponse(INITIAL_RESPONSE);
  };

  const copyResponse = async () => {
    if (!response.body) return;

    try {
      await navigator.clipboard.writeText(formattedBody);
    } catch {
      console.warn("Unable to copy response.");
    }
  };

  const sendRequest = async () => {
    if (!url.trim()) {
      setError("Request URL is required.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(INITIAL_RESPONSE);

    const requestHeaders = {};

    headers.forEach((header) => {
      if (header.key.trim()) {
        requestHeaders[header.key.trim()] = header.value;
      }
    });

    if (canHaveBody && body.trim() && !requestHeaders["Content-Type"]) {
      requestHeaders["Content-Type"] = "application/json";
    }

    const startedAt = performance.now();

    try {
      const requestOptions = {
        method,
        headers: requestHeaders,
      };

      if (canHaveBody && body.trim()) {
        requestOptions.body = body;
      }

      const res = await fetch(url.trim(), requestOptions);

      const elapsed = Math.round(performance.now() - startedAt);

      const responseText = await res.text();

      const responseHeaders = Array.from(res.headers.entries());

      setResponse({
        status: res.status,
        statusText: res.statusText,
        time: elapsed,
        size: new Blob([responseText]).size,
        headers: responseHeaders,
        body: responseText,
      });

      setHistory((current) =>
        [
          {
            method,
            url: url.trim(),
            headers,
            body,
            status: res.status,
            time: elapsed,
            createdAt: Date.now(),
          },
          ...current.filter(
            (item) => !(item.method === method && item.url === url.trim()),
          ),
        ].slice(0, 8),
      );
    } catch (requestError) {
      console.error(requestError);

      const elapsed = Math.round(performance.now() - startedAt);

      setResponse({
        ...INITIAL_RESPONSE,
        time: elapsed,
      });

      setError(
        "Request failed. Check the URL, backend status, and CORS configuration.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      sendRequest();
    }
  };

  return (
    <div
      className="flex h-full min-h-0 flex-col bg-[#f4ede3] font-mono text-xs text-portfolio-text"
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className="shrink-0 border-b-2 border-[#35271f] bg-[#fbf7f0] px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-[#35271f] bg-[#d9b782] text-xl shadow-[2px_2px_0_#35271f]" aria-hidden="true">
              ☕
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-black tracking-tight text-portfolio-text sm:text-base">API Tester</div>
              <div className="mt-0.5 truncate text-[11px] text-portfolio-muted sm:text-xs">Send a request, inspect the response</div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#d0bca4] bg-white px-3 py-1.5 text-[10px] font-bold tracking-wider text-portfolio-muted sm:text-[11px]">
            <span className="h-2 w-2 rounded-full bg-[#77734f]" />
            READY
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex min-h-0 flex-1 flex-col bg-[#f4ede3] p-2 sm:p-3 lg:flex-row lg:gap-3">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 overflow-hidden rounded-2xl border-2 border-[#35271f] bg-[#fbf7f0] shadow-[3px_3px_0_#35271f] lg:block">
          <div className="border-b border-[#d0bca4] px-3 py-3 text-[10px] font-bold tracking-[0.16em] text-portfolio-muted">
            QUICK REQUESTS
          </div>

          <div className="space-y-1 p-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => loadPreset(preset)}
                className="w-full rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#f4ede3]"
              >
                <div className="flex items-center gap-2">
                  <span className={`rounded-md bg-[#77734f]/10 px-1.5 py-0.5 text-[10px] font-bold ${getMethodClass(preset.method)}`}>
                    {preset.method}
                  </span>

                  <span className="font-bold text-portfolio-text">{preset.name}</span>
                </div>

                <div className="mt-1 truncate text-[11px] text-portfolio-muted">
                  {preset.path}
                </div>
              </button>
            ))}
          </div>

          <div className="border-y border-[#d0bca4] px-3 py-3 text-[10px] font-bold tracking-[0.16em] text-portfolio-muted">
            RECENT REQUESTS
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {history.length === 0 ? (
              <div className="px-2 py-3 text-[11px] leading-relaxed text-portfolio-muted">
                No requests yet.
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={`${item.createdAt}-${item.url}`}
                  type="button"
                  onClick={() => loadHistory(item)}
                  className="mb-1 w-full rounded-xl px-3 py-2.5 text-left hover:bg-[#f4ede3]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={getMethodClass(item.method)}>
                      {item.method}
                    </span>

                    <span className={getStatusClass(item.status)}>
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-1 truncate text-[11px] text-portfolio-muted">
                    {item.url}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Request / Response */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border-2 border-[#35271f] bg-[#fbf7f0] shadow-[3px_3px_0_#35271f]">
          {/* Request bar */}
          <div className="border-b border-[#d0bca4] p-3 sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={method}
                onChange={(event) => setMethod(event.target.value)}
                className={`
                  w-full rounded-xl border-2 border-[#d0bca4]
                  bg-white px-3 py-2.5
                  text-[14px] font-bold outline-hidden
                  focus:border-[#805239]
                  sm:w-24
                  ${getMethodClass(method)}
                `}
              >
                {METHODS.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-portfolio-panel text-portfolio-text"
                  >
                    {item}
                  </option>
                ))}
              </select>

              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="
                  min-w-0 flex-1 rounded-xl
                  border-2 border-[#d0bca4]
                  bg-white px-3 py-2.5
                  text-[14px] text-portfolio-text
                  outline-hidden
                  placeholder:text-portfolio-muted/40
                  focus:border-[#805239]
                "
              />

              <button
                type="button"
                onClick={sendRequest}
                disabled={loading}
                className="
                  rounded-xl bg-[#805239] px-5 py-2.5
                  text-[12px] font-bold tracking-widest
                  text-white transition
                  hover:brightness-110
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? "RUNNING..." : "SEND ▶"}
              </button>

              <button
                type="button"
                onClick={clearRequest}
                className="
                  rounded-xl border-2 border-[#d0bca4]
                  bg-white px-3 py-2
                  text-[13px] text-portfolio-muted
                  transition hover:text-portfolio-text
                "
              >
                CLEAR
              </button>
            </div>

            <div className="mt-2 text-[10px] text-portfolio-muted">
              <span className="rounded bg-[#efe3d2] px-1.5 py-0.5 font-bold text-portfolio-text">CTRL</span>
              {" + "}
              <span className="rounded bg-[#efe3d2] px-1.5 py-0.5 font-bold text-portfolio-text">ENTER</span>
              {" to send"}
            </div>
          </div>

          {/* Request editor */}
          <div className="border-b border-[#d0bca4]">
            <div className="flex items-center border-b border-[#d0bca4] px-2">
              {[
                ["body", "BODY"],
                ["headers", "HEADERS"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`
                    border-b-2 px-4 py-2.5
                    text-[10px] font-bold tracking-[0.14em]
                    ${
                      activeTab === key
                        ? "border-[#805239] text-[#805239]"
                        : "border-transparent text-portfolio-muted hover:text-portfolio-text"
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "body" && (
              <div className="p-3">
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  disabled={!canHaveBody}
                  placeholder={
                    canHaveBody
                      ? '{\n  "example": "value"\n}'
                      : "GET and DELETE requests normally do not require a request body."
                  }
                  className="
                    h-28 w-full resize-none
                    rounded-xl border-2 border-[#d0bca4]
                    bg-white p-3
                    text-[13px] leading-relaxed
                    text-portfolio-text outline-hidden
                    placeholder:text-portfolio-muted/40
                    focus:border-[#805239]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />
              </div>
            )}

            {activeTab === "headers" && (
              <div className="p-3">
                <div className="mb-2 grid grid-cols-[1fr_1fr_auto] gap-2 text-[11px] tracking-widest text-portfolio-muted">
                  <span>HEADER</span>
                  <span>VALUE</span>
                  <span />
                </div>

                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_1fr_auto] gap-2"
                    >
                      <input
                        value={header.key}
                        onChange={(event) =>
                          updateHeader(index, "key", event.target.value)
                        }
                        placeholder="Authorization"
                        className="
                          min-w-0 rounded-lg border-2
                          border-[#d0bca4] bg-white
                          px-2 py-1.5 text-[12px]
                          outline-hidden focus:border-[#805239]
                        "
                      />

                      <input
                        value={header.value}
                        onChange={(event) =>
                          updateHeader(index, "value", event.target.value)
                        }
                        placeholder="Bearer ..."
                        className="
                          min-w-0 rounded-lg border-2
                          border-[#d0bca4] bg-white
                          px-2 py-1.5 text-[12px]
                          outline-hidden focus:border-[#805239]
                        "
                      />

                      <button
                        type="button"
                        onClick={() => removeHeader(index)}
                        className="px-2 text-portfolio-red hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addHeader}
                  className="
                    mt-3 rounded-lg border-2 border-[#d0bca4]
                    px-3 py-1.5 text-[12px]
                    text-portfolio-muted hover:text-portfolio-text
                  "
                >
                  + ADD HEADER
                </button>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="border-b border-[#a65f45]/30 bg-[#fbf0e8] px-3 py-2 text-[12px] text-[#805239]">
              <span className="mr-2">✗</span>
              {error}
            </div>
          )}

          {/* Response */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 items-center justify-between border-b border-[#d0bca4] px-2">
              <div className="flex">
                {[
                  ["response", "RESPONSE"],
                  ["headers", "HEADERS"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setResponseTab(key)}
                    className={`
                      border-b-2 px-4 py-2.5
                      text-[10px] font-bold tracking-[0.14em]
                      ${
                        responseTab === key
                          ? "border-[#805239] text-[#805239]"
                          : "border-transparent text-portfolio-muted hover:text-portfolio-text"
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {response.status && (
                <div className="flex items-center gap-2 px-2 text-[10px] sm:gap-3 sm:px-3 sm:text-[11px]">
                  <span className={`rounded-full bg-white px-2 py-1 font-bold ${getStatusClass(response.status)}`}>
                    {response.status} {response.statusText}
                  </span>

                  <span className="text-portfolio-muted">{response.time}ms</span>

                  <span className="text-portfolio-muted">{response.size} B</span>
                </div>
              )}
            </div>

            {responseTab === "response" && (
              <div className="relative min-h-0 flex-1 overflow-auto bg-[#f7f1e8]">
                {response.body ? (
                  <>
                    <button
                      type="button"
                      onClick={copyResponse}
                      className="
                        absolute right-3 top-3 z-10
                        rounded-lg border border-[#d0bca4]
                        bg-white px-2.5 py-1.5
                        text-[11px] text-portfolio-muted
                        hover:text-portfolio-text
                      "
                    >
                      COPY
                    </button>

                    <pre className="p-4 pr-20 text-[13px] leading-relaxed text-portfolio-text">
                      {formattedBody}
                    </pre>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center">
                    <div>
                      <div className="mb-3 text-4xl" aria-hidden="true">☕</div>

                      <div className="text-sm font-bold text-portfolio-text">
                        Your response will appear here
                      </div>
                      <div className="mt-1 text-[11px] text-portfolio-muted">
                        Send a request when you’re ready.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {responseTab === "headers" && (
              <div className="min-h-0 flex-1 overflow-auto bg-[#f7f1e8] p-3">
                {response.headers.length === 0 ? (
                  <div className="text-[13px] text-portfolio-muted">
                    No response headers.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {response.headers.map(([key, value]) => (
                      <div
                        key={key}
                        className="
                            grid grid-cols-[minmax(120px,220px)_1fr]
                            gap-3 border-b
                            border-portfolio-border/40
                            py-1.5 text-[12px]
                          "
                      >
                        <span className="break-all text-portfolio-cyan">{key}</span>

                        <span className="break-all text-portfolio-muted">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Status bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-[#d0bca4] bg-[#fbf7f0] px-3 py-2 text-[9px] font-bold tracking-wider text-portfolio-muted sm:text-[10px]">
        <div>
          HTTP CLIENT
          {" • "}
          {method}
        </div>

        <div>{response.status ? `HTTP ${response.status}` : "NO RESPONSE"}</div>

        <div>
          {history.length} REQUEST
          {history.length === 1 ? "" : "S"}
        </div>
      </div>
    </div>
  );
}
