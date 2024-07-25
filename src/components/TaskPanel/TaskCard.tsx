import { IconCheck, IconDotsVertical } from '@tabler/icons-react'
import clsx from 'clsx'
import React, { useContext } from 'react'

import { FetchContext } from '@/App'
import TaskTag from '@/components/TaskTag/TaskTag'
import { Tag, Task } from '@/lib/apis'
import { useApi } from '@/lib/fetch'

type TaskCardProps = {
  task: Task
  tags: { [key: number]: Tag }
}

export default function TaskCard(props: TaskCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  const { taskApi } = useApi()
  const { fetchAll } = useContext(FetchContext)

  const putTaskDone = async () => {
    await taskApi.putTaskDone(props.task.id!)
    fetchAll()
  }

  return (
    <div
      className="p-2 bg-white rounded-1 overflow-x-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-0.8">
        {/* Title */}
        <div className="h-4 flex">
          <div className="my-auto flex-1">
            <p className="w-fit font-400 cursor-pointer">{props.task.title}</p>
          </div>
          <div className={clsx('gap-0.6', isHovered ? 'flex' : 'hidden')}>
            <IconCheck
              className="cursor-pointer"
              size={16}
              onClick={() => putTaskDone()}
            />
            <IconDotsVertical className="cursor-pointer" size={16} />
          </div>
        </div>

        {/* Due date and tags */}
        <div className="mt-0.4 flex gap-1">
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
