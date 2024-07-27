import { IconCheck, IconDotsVertical } from '@tabler/icons-react'
import clsx from 'clsx'
import { useContext, useState } from 'react'

import { FetchContext } from '@/App'
import TaskEditor, { RawRequestTask } from '@/components/TaskPanel/TaskEditor'
import TaskTag from '@/components/TaskTag/TaskTag'
import IconBase from '@/components/UI/IconBase'
import { RequestTask, Tag, Task } from '@/lib/apis'
import { useApi } from '@/lib/fetch'
import { selectStamp } from '@/lib/stamp'
import { formatDueDate, makeBR, makeURL } from '@/lib/text'

type TaskCardProps = {
  groupId: number
  task: Task
  tags: { [key: number]: Tag }
}

export default function TaskCard(props: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpened, setIsOpened] = useState(false)

  const [isEditing, setIsEditing] = useState(false)

  const [rawRequestTask, setRawRequestTask] = useState<RawRequestTask>({
    title: '',
    dueDate: '',
    description: '',
    tags: '',
    notificationTags: '',
  })

  const { taskApi } = useApi()
  const { fetchAll } = useContext(FetchContext)

  const updateTask = async (newTask: RequestTask) => {
    newTask.groupId = props.groupId
    newTask.order = props.task.order
    await taskApi.putTask(props.task.id!, newTask)
    fetchAll()
    setIsEditing(false)
  }

  const putTaskDone = async () => {
    await taskApi.putTaskDone(props.task.id!)
    fetchAll()
  }

  const openTaskEditor = () => {
    setRawRequestTask({
      title: props.task.title!,
      dueDate: props.task.dueDate ?? '',
      description: props.task.description ?? '',
      tags:
        props.task.tags?.map((tagId) => props.tags[tagId].name).join(' ') ?? '',
      notificationTags: props.task.notificationTags?.join(' ') ?? '',
    })
    setIsEditing(true)
    setTimeout(() => {
      document.getElementById(`input-edit-task-${props.task.id}-title`)?.focus()
    }, 0)
  }

  const closeTaskEditor = () => {
    setIsEditing(false)
  }

  return (
    <div
      className="p-2 bg-white rounded-1 overflow-x-hidden"
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={clsx('flex-col gap-0.8', isEditing ? 'hidden' : 'flex')}>
        {/* Title */}
        <div className="h-4.4 flex items-center">
          <p
            className={clsx(
              'text-md font-emoji mr-0.8',
              !props.task.dueDate && 'hidden',
            )}
          >
            {selectStamp(props.task.dueDate)}
          </p>
          <div className="flex-1">
            <p
              className="w-fit font-400 cursor-pointer"
              onClick={openTaskEditor}
            >
              {props.task.title}
            </p>
          </div>
          <div className={clsx('gap-0.6', isHovered ? 'flex' : 'hidden')}>
            <IconBase onClick={putTaskDone}>
              <IconCheck size={16} />
            </IconBase>
            <IconBase>
              <IconDotsVertical size={16} />
            </IconBase>
          </div>
        </div>

        {/* Due date and tags */}
        <div
          className={clsx(
            'mt-0.4 flex-wrap gap-1',
            !props.task.dueDate && !props.task.tags!.length ? 'hidden' : 'flex',
          )}
        >
          {props.task.dueDate ? (
            <p
              className="h-4.3 leading-4.3 font-300 mr-1"
              onClick={() => setIsOpened(!isOpened)}
            >
              {formatDueDate(props.task.dueDate)}
            </p>
          ) : null}
          {props.task.tags?.map((tagId) => (
            <TaskTag key={tagId} tag={props.tags[tagId]} />
          ))}
        </div>

        {/* Description */}
        <p
          className={clsx(
            'mt-0.2 text-sm leading-snug font-300',
            (!props.task.description || props.task.description.length == 0) &&
              'hidden',
            !isOpened && 'truncate',
          )}
          onClick={() => setIsOpened(!isOpened)}
          dangerouslySetInnerHTML={{
            __html: isOpened
              ? makeBR(makeURL(props.task.description ?? ''))
              : makeURL(props.task.description ?? ''),
          }}
        />
      </div>

      <div className={isEditing ? '' : 'hidden'}>
        <TaskEditor
          editorId={`edit-task-${props.task.id}`}
          tags={props.tags}
          rawInputs={rawRequestTask}
          setRawInputs={setRawRequestTask}
          execute={updateTask}
          cancel={closeTaskEditor}
        />
      </div>
    </div>
  )
}
