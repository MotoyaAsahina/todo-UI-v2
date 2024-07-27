type IconBaseProps = {
  children: React.ReactNode
  onClick?: () => void
  ref2?: React.RefObject<HTMLDivElement>
}

export default function IconBase(props: IconBaseProps) {
  return (
    <div
      className="p-0.6 rounded-1 hover:bg-slate-100 cursor-pointer"
      onClick={props.onClick}
      ref={props.ref2}
    >
      {props.children}
    </div>
  )
}
