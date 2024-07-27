type IconBaseProps = {
  children: React.ReactNode
}

export default function IconBase(props: IconBaseProps) {
  return (
    <div className="p-0.6 rounded-1 hover:bg-slate-100 cursor-pointer">
      {props.children}
    </div>
  )
}
