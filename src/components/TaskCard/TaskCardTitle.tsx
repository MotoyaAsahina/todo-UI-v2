import { IconCheck, IconDotsVertical, IconTrash } from '@tabler/icons-react'
import clsx from 'clsx'
import { useContext, useEffect, useRef, useState } from 'react'

import { FetchContext } from '@/App'
import DropdownMenu from '@/components/UI/DropdownMenu'
import IconBase from '@/components/UI/IconBase'
import { Task } from '@/lib/apis'
import { useApi } from '@/lib/fetch'
import { selectStamp } from '@/lib/stamp'

type TaskCardTitleProps = {
  task: Task
  isCardHovered: boolean
  openTaskEditor: () => void
}

export default function TaskCardTitle(props: TaskCardTitleProps) {
  const { taskApi } = useApi()
  const { fetchAll } = useContext(FetchContext)

  const putTaskDone = async () => {
    await taskApi.putTaskDone(props.task.id!)
    fetchAll()
  }

  const deleteTask = async () => {
    await taskApi.deleteTask(props.task.id!)
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

  const menuIconRef = useRef<HTMLDivElement>(null)
  const [isMenuOpened, setIsMenuOpened] = useState(false)

  const dropdownMenuItems = [
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
    { label: '---' },
    { label: 'Delete', onClick: deleteTask },
  ]

  const [isCmdPressed, setIsCmdPressed] = useState(false)
  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase()
    const mac = ua.indexOf('windows nt') === -1
    document.body.addEventListener('keydown', (e) => {
      if ((mac && e.key === 'Meta') || (!mac && e.key === 'Control'))
        setIsCmdPressed(true)
    })
    document.body.addEventListener('keyup', (e) => {
      if (e.key === 'Meta' || e.key === 'Control') setIsCmdPressed(false)
    })
  }, [])

  return (
    <div className="h-4.4 flex items-center">
      {/* Emoji */}
      <p
        className={clsx(
          'text-md font-emoji mr-0.8',
          !props.task.dueDate && 'hidden',
        )}
      >
        {selectStamp(props.task.dueDate)}
      </p>

      {/* Task name */}
      <div className="flex-1">
        <p
          className={clsx(
            'w-fit cursor-pointer',
            props.task.pending ? 'font-300' : 'font-400',
          )}
          onClick={props.openTaskEditor}
          title={`Created at: ${props.task.createdAt}\nUpdated at: ${props.task.updatedAt}`}
        >
          {props.task.title}
        </p>
      </div>

      {/* Icons */}
      <div
        className={clsx(
          'gap-0.6 relative',
          props.isCardHovered || isMenuOpened ? 'flex' : 'hidden',
        )}
      >
        <IconBase
          className={clsx(!isCmdPressed && 'hidden')}
          onClick={deleteTask}
        >
          <IconTrash size={16} />
        </IconBase>
        <IconBase
          className={clsx(isCmdPressed && 'hidden')}
          onClick={putTaskDone}
        >
          <IconCheck size={16} />
        </IconBase>
        <IconBase
          onClick={() => setIsMenuOpened(!isMenuOpened)}
          ref={menuIconRef}
        >
          <IconDotsVertical size={16} />
        </IconBase>

        {/* Dropdown Menu */}
        <div
          className={clsx(
            'absolute right-0 top-6 z-10',
            !isMenuOpened && 'hidden',
          )}
        >
          <DropdownMenu
            items={dropdownMenuItems}
            closeMenu={() => setIsMenuOpened(false)}
            menuIconRef={menuIconRef}
          />
        </div>
      </div>
    </div>
  )
}
