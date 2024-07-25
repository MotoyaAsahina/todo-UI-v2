import { IconDotsVertical, IconPlus } from '@tabler/icons-react'

import TaskCard from '@/components/TaskPanel/TaskCard'
import { Group, Tag, Task } from '@/lib/apis'

type TaskPanelProps = {
  group: Group
  tasks: Task[]
  tags: { [key: number]: Tag }
}

export default function TaskPanel(props: TaskPanelProps) {
  return (
    <div className="w-76 h-full flex flex-col gap-4">
      <div className="h-10 px-2 bg-white rounded-1 flex gap-2">
        <span className="h-5.2 leading-5 px-1.8 bg-gray-2 text-sm rounded-3 my-auto">
          {props.tasks.length}
        </span>
        <div className="my-auto flex-1">
          <p className="h-5.4 leading-5 my-auto font-500">{props.group.name}</p>
        </div>
        <div className="my-auto flex gap-0.6">
          <IconPlus className="cursor-pointer" size={16} />
          <IconDotsVertical className="cursor-pointer" size={16} />
        </div>
      </div>

      <div className="flex-1 overflow-y-scroll">
        <div className="h-fit pb-8 flex flex-col gap-2">
          {props.tasks.map((task) => (
            <TaskCard key={task.id} task={task} tags={props.tags} />
          ))}
        </div>
      </div>
    </div>
  )
}
