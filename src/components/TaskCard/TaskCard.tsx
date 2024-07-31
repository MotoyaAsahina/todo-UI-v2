import clsx from 'clsx'
import { useContext, useEffect, useRef, useState } from 'react'

import TaskCardTitle from './TaskCardTitle'

import { FetchContext } from '@/App'
import TaskEditor, { RawRequestTask } from '@/components/TaskEditor/TaskEditor'
import TaskTag from '@/components/TaskTag/TaskTag'
import { RequestTask, Tag, Task } from '@/lib/apis'
import { useApi } from '@/lib/fetch'
import { formatDueDate, makeBR, makeURL } from '@/lib/text'

type TaskCardProps = {
  groupId: number
  task: Task
  tags: { [key: number]: Tag }
  hiddenTagIds?: number[]
  setEditingIds: React.Dispatch<React.SetStateAction<number[]>>
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

  useEffect(() => {
    console.log('changed', isEditing)
    if (isEditing) props.setEditingIds((prev) => [...prev, props.task.id!])
    else
      props.setEditingIds((prev) => prev.filter((id) => id !== props.task.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing])

  const updateTask = async (newTask: RequestTask) => {
    newTask.groupId = props.groupId
    newTask.order = props.task.order
    await taskApi.putTask(props.task.id!, newTask)
    fetchAll()
    setIsEditing(false)
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

  const { nameRef, doneIconRef, deleteIconRef, menuIconRef, menuRef } = {
    nameRef: useRef<HTMLParagraphElement>(null),
    doneIconRef: useRef<HTMLDivElement>(null),
    deleteIconRef: useRef<HTMLDivElement>(null),
    menuIconRef: useRef<HTMLDivElement>(null),
    menuRef: useRef<HTMLDivElement>(null),
  }

  const handleOnClickCard = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (isEditing) return
    if (
      (e.target as Element).tagName === 'A' ||
      nameRef.current?.contains(e.target as Node) ||
      doneIconRef.current?.contains(e.target as Node) ||
      deleteIconRef.current?.contains(e.target as Node) ||
      menuIconRef.current?.contains(e.target as Node) ||
      menuRef.current?.contains(e.target as Node)
    )
      return
    setIsOpened(!isOpened)
  }

  return (
    <div
      className="p-2 bg-white rounded-1 relative"
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOnClickCard}
    >
      <div
        className={clsx(
          'w-full h-full absolute top-0 left-0 rounded-1 pointer-events-none',
          'bg-slate-100 opacity-50',
          !props.task.pending && 'hidden',
        )}
      />

      <div className={clsx('flex-col gap-0.8', isEditing ? 'hidden' : 'flex')}>
        {/* Title */}
        <TaskCardTitle
          task={props.task}
          isCardHovered={isHovered}
          openTaskEditor={openTaskEditor}
          refs={{
            nameRef,
            doneIconRef,
            deleteIconRef,
            menuIconRef,
            menuRef,
          }}
        />

        {/* Due date and tags */}
        <div
          className={clsx(
            'mt-0.4 flex-wrap gap-1',
            props.task.dueDate ||
              props.task.tags?.some(
                (tagId) => !props.hiddenTagIds?.includes(tagId),
              )
              ? 'flex'
              : 'hidden',
          )}
        >
          {/* Due date */}
          <p
            className={clsx(
              'h-4.3 leading-4.3 font-300 mr-1',
              !props.task.dueDate && 'hidden',
            )}
          >
            {formatDueDate(props.task.dueDate)}
          </p>

          {/* Tags */}
          {props.task.tags
            ?.filter((tagId) => !props.hiddenTagIds?.includes(tagId))
            .map((tagId) => <TaskTag key={tagId} tag={props.tags[tagId]} />)}
        </div>

        {/* Description */}
        <p
          className={clsx(
            'mt-0.2 text-sm leading-snug font-300',
            !props.task.description?.length && 'hidden',
            !isOpened && 'truncate',
          )}
          dangerouslySetInnerHTML={{
            __html: isOpened
              ? makeBR(makeURL(props.task.description ?? ''))
              : makeURL(props.task.description ?? ''),
          }}
        />
      </div>

      <div className={clsx(!isEditing && 'hidden')}>
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
