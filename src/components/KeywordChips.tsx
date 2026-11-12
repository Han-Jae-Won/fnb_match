interface Props {
  options: string[]
  value: string[]
  onChange: (v: string[]) => void
  max?: number
}

export function KeywordChips({ options, value, onChange, max }: Props) {
  const toggle = (k: string) => {
    if (value.includes(k)) onChange(value.filter((x) => x !== k))
    else if (!max || value.length < max) onChange([...value, k])
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((k) => {
          const on = value.includes(k)
          return (
            <button
              key={k}
              type="button"
              onClick={() => toggle(k)}
              aria-pressed={on}
              className={`rounded-full border px-3.5 py-2 text-[14px] font-medium transition active:scale-95 ${
                on ? 'border-terra bg-terra text-white' : 'border-oat bg-white text-espresso hover:border-terra/50'
              }`}
            >
              {on && <span className="mr-1">✓</span>}
              {k}
            </button>
          )
        })}
      </div>
      {max && (
        <p className="mt-2 text-xs text-cocoa">
          {value.length} / {max}개 선택
        </p>
      )}
    </div>
  )
}
