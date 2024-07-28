import clsx from 'clsx'
import { forwardRef } from 'react'

type IconBaseProps = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default forwardRef(function IconBase(
  props: IconBaseProps,
  ref?: React.Ref<HTMLDivElement>,
) {
  return (
    <div
      className={clsx(
        'p-0.6 rounded-1 hover:bg-slate-100 cursor-pointer [&>svg]:z-1',
        props.className,
      )}
      onClick={props.onClick}
      ref={ref}
    >
      {props.children}
    </div>
  )
})
