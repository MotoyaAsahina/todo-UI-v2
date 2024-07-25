import TaskPanel from '@/components/TaskPanel/TaskPanel'
import { Group, Tag, Task } from '@/lib/apis'

type MainContentProps = {
  tasks: Task[]
  groups: Group[]
  tags: { [key: number]: Tag }
}

export default function MainContent(props: MainContentProps) {
  return (
    <div className="h-screen bg-slate-100 pt-10 overflow-x-scroll">
      <div className="w-fit h-full flex mx-8 gap-6">
        {props.groups.map((group) => (
          <TaskPanel
            key={group.id}
            group={group}
            tasks={props.tasks.filter((task) => task.groupId === group.id)}
            tags={props.tags}
          />
        ))}
      </div>
    </div>
  )
}
