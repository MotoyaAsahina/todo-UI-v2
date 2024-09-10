import ListTitle from '../ListTitle'

import { Group, Tag, Task } from '@/lib/apis'
import { selectStamp } from '@/lib/stamp'

type PinnedTaskListProps = {
  groups: Group[]
  tags: { [key: number]: Tag }
  pinnedTasks: Task[]
}

export default function PinnedTaskList(props: PinnedTaskListProps) {
  return (
    <div className="ml-1 my-1">
      <ListTitle disableCreate>Pinned Tasks</ListTitle>
      <div className="flex flex-col gap-1">
        {props.pinnedTasks.map((task) => (
          <div key={task.id} className="px-1 py-0.5 flex gap-0.8 items-start">
            <p className="text-md font-emoji">
              {selectStamp(task.dueDate) || '📌'}
            </p>
            <div className="flex flex-wrap items-center gap-1">
              <p className="text-md font-400">{task.title}</p>
              <p className="text-xs font-300">
                (
                {props.groups.find((group) => group.id === task.groupId)?.name +
                  (task.tags?.length ? ' / ' : '') +
                  (task.tags
                    ?.map((tagId) => props.tags[tagId].name)
                    .join(', ') || '')}
                )
              </p>
            </div>
          </div>
        ))}
        {props.pinnedTasks.length === 0 && (
          <p className="text-sm font-300 text-center text-gray-700 font-sans">
            No pinned tasks <span className="font-emoji">☀️</span>
          </p>
        )}
      </div>
    </div>
  )
}
