/**
 * Shown when a backend request fails. The frontend keeps no offline copy of the
 * portfolio data, so there is nothing to fall back to — the user can only retry.
 */
export default function ApiError({ endpoint, onRetry }) {
  return (
    <div className="h-full flex items-center justify-center bg-[#f4ede3] p-6 font-mono text-xs">
      <div className="max-w-xs rounded-[1.5rem] border-2 border-[#35271f] bg-white p-6 text-center shadow-[5px_5px_0_#b9855f]">
        <div className="mb-3 text-3xl">🫠</div>

        <div className="text-[#35271f] text-[14px] font-bold mb-1">Backend unreachable</div>

        <div className="text-[#786b5f] text-[12px] leading-relaxed mb-4">
          GET {endpoint} failed. The data lives on the server, so start the API and retry.
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-3 py-1.5 rounded-full border-2 border-[#35271f] bg-[#d9b782] text-[#35271f] text-[13px] font-bold transition-colors hover:bg-[#b9855f]"
          >
            retry
          </button>
        )}
      </div>
    </div>
  );
}
