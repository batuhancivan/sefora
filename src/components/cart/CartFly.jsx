import { useEffect, useRef } from 'react'
import { useStore } from '../../context/StoreContext'

function FlyItem({ f, onDone }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const anim = el.animate(
      [
        { transform: `translate(${f.x0}px, ${f.y0}px) scale(1)`, opacity: 1 },
        { transform: `translate(${f.x1}px, ${f.y1}px) scale(0.18)`, opacity: 0 },
      ],
      { duration: 700, easing: 'cubic-bezier(0.22, 0.82, 0.2, 1)', fill: 'forwards' },
    )
    let done = false
    const finish = () => {
      if (done) return
      done = true
      onDone(f.id)
    }
    anim.onfinish = finish
    const t = window.setTimeout(finish, 800)
    return () => {
      window.clearTimeout(t)
      anim.cancel()
    }
  }, [f, onDone])

  return (
    <img
      ref={ref}
      className="cart-fly"
      src={f.src}
      alt=""
      style={{ width: f.w, height: f.h, transform: `translate(${f.x0}px, ${f.y0}px)` }}
    />
  )
}

export default function CartFly() {
  const { flies, endFly } = useStore()
  if (!flies?.length) return null
  return (
    <>
      {flies.map((f) => (
        <FlyItem key={f.id} f={f} onDone={endFly} />
      ))}
    </>
  )
}
