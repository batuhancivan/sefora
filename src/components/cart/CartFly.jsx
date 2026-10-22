import { useStore } from '../../context/StoreContext'

export default function CartFly() {
  const { flies, endFly } = useStore()
  if (!flies?.length) return null
  return (
    <>
      {flies.map((f) => (
        <img
          key={f.id}
          className="cart-fly"
          src={f.src}
          alt=""
          style={{
            width: f.w,
            height: f.h,
            '--x0': `${f.x0}px`,
            '--y0': `${f.y0}px`,
            '--x1': `${f.x1}px`,
            '--y1': `${f.y1}px`,
          }}
          onAnimationEnd={() => endFly(f.id)}
        />
      ))}
    </>
  )
}
