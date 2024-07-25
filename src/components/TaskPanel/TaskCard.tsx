import { Tag, Task } from '@/lib/apis'

type TaskCardProps = {
  task: Task
  tags: { [key: number]: Tag }
}

export default function TaskCard(props: TaskCardProps) {
  return (
    <div className="p-2 bg-white rounded-1 overflow-x-hidden">
      <div className="flex flex-col gap-0.4">
        <p className="leading-snug font-medium">{props.task.title}</p>
        {props.task.description?.length && props.task.description.length > 0 ? (
          <p className="text-sm leading-snug">{props.task.description}</p>
        ) : null}
      </div>
    </div>
  )
}
