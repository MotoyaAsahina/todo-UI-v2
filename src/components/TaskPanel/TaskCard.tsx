import { IconCheck, IconDotsVertical, IconTrash } from '@tabler/icons-react'
import clsx from 'clsx'
import { useContext, useEffect, useRef, useState } from 'react'

import { FetchContext } from '@/App'
import TaskEditor, { RawRequestTask } from '@/components/TaskPanel/TaskEditor'
import TaskTag from '@/components/TaskTag/TaskTag'
import DropdownMenu from '@/components/UI/DropdownMenu'
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

  const putTaskPinnedOrUnpinned = async () => {
    if (props.task.pinned) await taskApi.putTaskUnpinned(props.task.id!)
    else await taskApi.putTaskPinned(props.task.id!)
    fetchAll()
  }

  const putTaskPendingOrUnpending = async () => {
    if (props.task.pending) await taskApi.putTaskUnpending(props.task.id!)
    else await taskApi.putTaskPending(props.task.id!)
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

  const deleteTask = async () => {
    await taskApi.deleteTask(props.task.id!)
    fetchAll()
  }

  const [isCmdPressed, setIsCmdPressed] = useState(false)

  useEffect(() => {
    document.body.addEventListener('keydown', (e) => {
      if (e.key === 'Meta' || e.key === 'Control') setIsCmdPressed(true)
    })
    document.body.addEventListener('keyup', (e) => {
      if (e.key === 'Meta' || e.key === 'Control') setIsCmdPressed(false)
    })
  }, [])

  const menuIconRef = useRef<HTMLDivElement>(null)
  const [isMenuOpened, setIsMenuOpened] = useState(false)

  const handleMenuOpen = () => {
    setIsMenuOpened(!isMenuOpened)
  }

  return (
    <div
      className="p-2 bg-white rounded-1 relative"
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
              className={clsx(
                'w-fit cursor-pointer',
                props.task.pending ? 'font-300' : 'font-400',
              )}
              onClick={openTaskEditor}
            >
              {props.task.title}
            </p>
          </div>
          <div
            className={clsx(
              'gap-0.6 relative',
              isHovered || isMenuOpened ? 'flex' : 'hidden',
            )}
          >
            {isCmdPressed ? (
              <IconBase onClick={deleteTask}>
                <IconTrash size={16} className="z-1" />
              </IconBase>
            ) : (
              <IconBase onClick={putTaskDone}>
                <IconCheck size={16} className="z-1" />
              </IconBase>
            )}
            <IconBase onClick={handleMenuOpen} ref2={menuIconRef}>
              <IconDotsVertical size={16} className="z-1" />
            </IconBase>

            {/* Dropdown Menu */}
            <div
              className={clsx(
                'absolute right-0 top-6 z-10',
                !isMenuOpened && 'hidden',
              )}
            >
              <DropdownMenu
                items={[
                  {
                    label: 'Pending',
                    check: props.task.pending,
                    onClick: putTaskPendingOrUnpending,
                  },
                  {
                    label: 'Pinned',
                    check: props.task.pinned,
                    onClick: putTaskPinnedOrUnpinned,
                  },
                ]}
                closeMenu={() => setIsMenuOpened(false)}
                menuIconRef={menuIconRef}
              />
            </div>
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
