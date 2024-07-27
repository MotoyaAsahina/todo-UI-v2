import { IconPlus } from '@tabler/icons-react'

type ListTitleProps = {
  children: React.ReactNode
  onClickCreate: () => void
}

export default function ListTitle(props: ListTitleProps) {
  return (
    <div className="mb-3 flex items-center">
      <p className="text-base font-400 leading-tight flex-1">
        {props.children}
      </p>
      <div
        className="h-fit p-0.4 b-1 rd-1 cursor-pointer"
        onClick={props.onClickCreate}
      >
        <IconPlus size={13} stroke={1.5} />
      </div>
    </div>
  )
}
