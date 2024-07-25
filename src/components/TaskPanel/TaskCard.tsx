import TaskTag from '@/components/TaskTag/TaskTag'
import { Tag, Task } from '@/lib/apis'

type TaskCardProps = {
  task: Task
  tags: { [key: number]: Tag }
}

export default function TaskCard(props: TaskCardProps) {
  return (
    <div className="p-2 bg-white rounded-1 overflow-x-hidden">
      <div className="flex flex-col gap-0.8">
        {/* Title */}
        <p className="font-400">{props.task.title}</p>

        {/* Due date and tags */}
        <div className="mt-0.6 flex gap-1">
          {props.task.dueDate ? (
            <p className="h-4.3 leading-4.3 font-300 mr-1">
              {props.task.dueDate}
            </p>
          ) : null}
          {props.task.tags?.map((tagId) => (
            <TaskTag key={tagId} tag={props.tags[tagId]} />
          ))}
        </div>

        {/* Description */}
        {props.task.description?.length && props.task.description.length > 0 ? (
          <p className="text-sm leading-snug font-300">
            {props.task.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}
