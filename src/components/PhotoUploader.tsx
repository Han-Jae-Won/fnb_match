import { useRef } from 'react'

/** Downscale to keep localStorage small: max 900px, JPEG. */
function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, 900 / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * scale)
      c.height = Math.round(img.height * scale)
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', 0.72))
    }
    img.onerror = reject
    img.src = url
  })
}

export function PhotoUploader({
  value,
  onChange,
  max = 5,
  samples,
}: {
  value: string[]
  onChange: (v: string[]) => void
  max?: number
  samples?: string[]
}) {
  const input = useRef<HTMLInputElement>(null)

  const onFiles = async (files: FileList | null) => {
    if (!files) return
    const room = max - value.length
    const urls = await Promise.all(Array.from(files).slice(0, room).map(toDataUrl))
    onChange([...value, ...urls])
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {value.map((src, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-sand">
            <img src={src} alt={`매장 사진 ${i + 1}`} className="size-full object-cover" />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-md bg-espresso/80 px-1.5 py-0.5 text-[10px] font-bold text-white">대표</span>
            )}
            <button
              type="button"
              aria-label="사진 삭제"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black/55 text-xs text-white"
            >
              ✕
            </button>
          </div>
        ))}
        {value.length < max && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-oat bg-white text-cocoa transition hover:border-terra hover:text-terra"
          >
            <span className="text-2xl">＋</span>
            <span className="text-[11px] font-medium">
              사진 추가 {value.length}/{max}
            </span>
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      {samples && value.length === 0 && (
        <button type="button" onClick={() => onChange(samples.slice(0, max))} className="mt-2 text-xs font-medium text-terra underline underline-offset-2">
          데모용 샘플 사진으로 채우기
        </button>
      )}
    </div>
  )
}
