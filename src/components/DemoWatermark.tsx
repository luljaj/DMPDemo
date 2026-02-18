interface DemoWatermarkProps {
  active: boolean
}

const WATERMARK_TEXT = 'Luka Uljaj Demo Unpaid'
const WATERMARK_ROWS = 14
const WATERMARK_COLUMNS = 7

export function DemoWatermark({ active }: DemoWatermarkProps) {
  if (!active) {
    return null
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[55] overflow-hidden opacity-50"
    >
      <div className="absolute inset-[-25%] -rotate-[23deg]">
        <div className="flex h-full flex-col justify-between">
          {Array.from({ length: WATERMARK_ROWS }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex whitespace-nowrap">
              {Array.from({ length: WATERMARK_COLUMNS }).map((__, colIndex) => (
                <span
                  key={`${rowIndex}-${colIndex}`}
                  className="px-8 text-xl font-extrabold uppercase tracking-[0.25em] text-slate-100/95 md:text-2xl"
                >
                  {WATERMARK_TEXT}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface DemoUnlockModalProps {
  open: boolean
  password: string
  error: string | null
  onPasswordChange: (value: string) => void
  onSubmit: () => void
  onClose: () => void
}

export function DemoUnlockModal({
  open,
  password,
  error,
  onPasswordChange,
  onSubmit,
  onClose,
}: DemoUnlockModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/75"
        onClick={onClose}
        aria-label="Close unlock prompt"
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-slate-900 p-5 shadow-[0_14px_60px_rgba(0,0,0,0.55)]">
        <h3 className="text-lg font-bold text-white">Demo Lock</h3>
        <p className="mt-1 text-sm text-slate-300">
          Enter password to remove watermark.
        </p>

        <form
          className="mt-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            autoFocus
            className="w-full rounded-lg border border-white/20 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-300"
            placeholder="Enter password"
          />

          {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg border border-orange-300/60 bg-orange-500/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-orange-100"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
