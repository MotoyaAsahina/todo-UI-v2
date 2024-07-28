import TaskCard from '@/components/TaskCard/TaskCard'
import { Group, Tag, Task } from '@/lib/apis'

type DefaultTaskListProps = {
  group: Group
  tasks: Task[]
  tags: { [key: number]: Tag }
}

export default function DefaultTaskList(props: DefaultTaskListProps) {
  return (
    <div className="pb-8 flex flex-col gap-2">
      {props.tasks.map((task) => (
        <TaskCard
          key={task.id}
          groupId={props.group.id!}
          task={task}
          tags={props.tags}
        />
      ))}
    </div>
  )
}
