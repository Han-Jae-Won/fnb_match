import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

export function Button({
  variant = 'primary',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'dark' | 'outline' }) {
  const styles = {
    primary: 'bg-terra text-white shadow-[0_6px_16px_-6px_rgb(200_100_59/0.7)] hover:bg-terra-dark',
    dark: 'bg-espresso text-cream hover:bg-black',
    outline: 'border border-oat bg-white text-espresso hover:bg-sand',
    ghost: 'text-cocoa hover:bg-sand',
  }[variant]
  return (
    <button
      className={`inline-flex h-13 items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${styles} ${className}`}
      {...rest}
    />
  )
}

export function TopBar({ title, back = true, right }: { title?: string; back?: boolean; right?: ReactNode }) {
  const nav = useNavigate()
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3">
      {back ? (
        <button aria-label="뒤로" onClick={() => nav(-1)} className="grid size-10 place-items-center rounded-full text-xl hover:bg-sand">
          ‹
        </button>
      ) : (
        <div className="w-2" />
      )}
      <h1 className="flex-1 truncate text-[17px] font-bold">{title}</h1>
      {right}
    </header>
  )
}

export function StepBar({ step, total, label }: { step: number; total: number; label?: string }) {
  return (
    <div className="px-5 pb-2">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-cocoa">
        <span>{label}</span>
        <span>
          {step} / {total}
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? 'bg-terra' : 'bg-oat'}`} />
        ))}
      </div>
    </div>
  )
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="text-[15px] font-bold">{title}</h2>
      {hint && <p className="mt-0.5 text-[13px] text-cocoa">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-[13px] font-semibold text-cocoa">{label}</span>
      {children}
    </label>
  )
}

export const inputCls =
  'w-full rounded-xl border border-oat bg-white px-4 py-3 text-[15px] outline-none placeholder:text-[#b9a896] focus:border-terra focus:ring-2 focus:ring-terra/20'

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg,#c8643b,#7a2e3a)',
  'linear-gradient(135deg,#6b7445,#2b1d16)',
  'linear-gradient(135deg,#e6b98a,#a94f2b)',
  'linear-gradient(135deg,#7a2e3a,#2b1d16)',
]

/** Image that degrades to a warm gradient if the URL fails (offline demo safety). */
export function StoreImage({ src, alt, className = '', seed = 0 }: { src?: string; alt: string; className?: string; seed?: number }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`grid place-items-center text-5xl ${className}`}
        style={{ background: FALLBACK_GRADIENTS[seed % FALLBACK_GRADIENTS.length] }}
      >
        <span className="opacity-60">☕</span>
      </div>
    )
  }
  return <img src={src} alt={alt} draggable={false} onError={() => setFailed(true)} className={`object-cover ${className}`} />
}

/** Two-tap destructive action (window.confirm is unavailable in embedded viewers). */
export function ConfirmButton({ label, confirmLabel, onConfirm, className = '' }: { label: string; confirmLabel: string; onConfirm: () => void; className?: string }) {
  const [armed, setArmed] = useState(false)
  return (
    <button
      type="button"
      onBlur={() => setArmed(false)}
      onClick={() => {
        if (armed) {
          setArmed(false)
          onConfirm()
        } else setArmed(true)
      }}
      className={`${className} ${armed ? 'font-bold text-nope no-underline' : ''}`}
    >
      {armed ? confirmLabel : label}
    </button>
  )
}

export function Chip({ children, tone = 'sand' }: { children: ReactNode; tone?: 'sand' | 'glass' | 'terra' }) {
  const cls = {
    sand: 'bg-sand text-cocoa',
    glass: 'bg-white/20 text-white backdrop-blur-md',
    terra: 'bg-terra/10 text-terra-dark',
  }[tone]
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>{children}</span>
}
