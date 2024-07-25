import TaskCard from '@/components/TaskPanel/TaskCard'
import { Group, Tag, Task } from '@/lib/apis'

type TaskPanelProps = {
  tasks: { [key: number]: Task }
  group: Group
  tags: { [key: number]: Tag }
}

export default function TaskPanel(props: TaskPanelProps) {
  return (
    <div className="w-76 h-full flex flex-col gap-4">
      <div className="h-10 px-2 bg-white rounded-1 flex gap-2">
        <span className="h-5.2 leading-5 px-1.8 bg-gray-2 text-sm rounded-3 my-auto">
          {Object.values(props.tasks).length}
        </span>
        <p className="h-5.4 leading-5 my-auto font-medium">
          {props.group.name}
        </p>
      </div>
      <div className="flex-1 overflow-y-scroll">
        <div className="h-fit pb-8 flex flex-col gap-2">
          {Object.values(props.tasks).map((task) => (
            <TaskCard key={task.id} task={task} tags={props.tags} />
          ))}
        </div>
      </div>
    </div>
  )
}
