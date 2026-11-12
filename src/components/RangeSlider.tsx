import { TASTE_AXES, type TasteKey, type TasteRange } from '../data/keywords'

function Dual({
  value,
  onChange,
  label,
}: {
  value: [number, number]
  onChange: (v: [number, number]) => void
  label: string
}) {
  const [lo, hi] = value
  return (
    <div className="dual-range relative h-6">
      <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-oat" />
      <div
        className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-terra to-wine"
        style={{ left: `${lo}%`, width: `${hi - lo}%` }}
      />
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={lo}
        aria-label={`${label} 최소`}
        onChange={(e) => onChange([Math.min(Number(e.target.value), hi - 10), hi])}
      />
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={hi}
        aria-label={`${label} 최대`}
        onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + 10)])}
      />
    </div>
  )
}

export function TasteRangeEditor({ value, onChange }: { value: TasteRange; onChange: (v: TasteRange) => void }) {
  const set = (k: TasteKey, v: [number, number]) => onChange({ ...value, [k]: v })
  return (
    <div className="space-y-5 rounded-2xl bg-white p-4 ring-1 ring-oat">
      {TASTE_AXES.map((ax) => (
        <div key={ax.key}>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[14px] font-semibold">{ax.label}</span>
            <span className="text-xs tabular-nums text-terra-dark">
              {value[ax.key][0]} – {value[ax.key][1]}
            </span>
          </div>
          <Dual label={ax.label} value={value[ax.key]} onChange={(v) => set(ax.key, v)} />
          <div className="mt-1 flex justify-between text-[11px] text-cocoa">
            <span>{ax.low}</span>
            <span>{ax.high}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Read-only compact bars used on cards / detail sheet. */
export function TasteBars({ taste, dark = false }: { taste: TasteRange; dark?: boolean }) {
  return (
    <div className="space-y-1.5">
      {TASTE_AXES.map((ax) => (
        <div key={ax.key} className="flex items-center gap-2">
          <span className={`w-10 shrink-0 text-[11px] ${dark ? 'text-white/80' : 'text-cocoa'}`}>{ax.label}</span>
          <div className={`relative h-1.5 flex-1 rounded-full ${dark ? 'bg-white/20' : 'bg-oat'}`}>
            <div
              className={`absolute h-full rounded-full ${dark ? 'bg-white' : 'bg-terra'}`}
              style={{ left: `${taste[ax.key][0]}%`, width: `${taste[ax.key][1] - taste[ax.key][0]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
