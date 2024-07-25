import { IconPlus } from '@tabler/icons-react'

type ListTitleProps = {
  children: React.ReactNode
}

export default function ListTitle(props: ListTitleProps) {
  return (
    <div className="mb-4 flex">
      <h1 className="text-lg font-300 leading-tight flex-1">
        {props.children}
      </h1>
      <div className="my-auto h-fit p-0.4 b-1 rd-1">
        <IconPlus className="cursor-pointer" size={13} stroke={1.5} />
      </div>
    </div>
  )
}
