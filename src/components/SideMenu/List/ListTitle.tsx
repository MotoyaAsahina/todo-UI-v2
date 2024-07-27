import { IconPlus } from '@tabler/icons-react'

type ListTitleProps = {
  children: React.ReactNode
  onClickCreate: () => void
}

export default function ListTitle(props: ListTitleProps) {
  return (
    <div className="mb-4 flex">
      <p className="text-base font-400 leading-tight flex-1">
        {props.children}
      </p>
      <div className="my-auto h-fit p-0.4 b-1 rd-1 cursor-pointer">
        <IconPlus size={13} stroke={1.5} onClick={props.onClickCreate} />
      </div>
    </div>
  )
}
