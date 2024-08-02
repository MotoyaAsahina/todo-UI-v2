import TaskPanel from '@/components/TaskPanel/TaskPanel'
import { Group, Tag, Task } from '@/lib/apis'

type MainContentProps = {
  tasks: Task[]
  groups: Group[]
  tags: { [key: number]: Tag }
}

export default function MainContent(props: MainContentProps) {
  return (
    <div
      className="h-svh w-full md:w-[calc(100vw-200px)] lg:w-[calc(100vw-260px)]
                 bg-slate-200 bg-opacity-60"
    >
      <div className="w-full h-full flex overflow-scroll px-8 gap-6 <sm:snap-x <sm:snap-mandatory">
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
