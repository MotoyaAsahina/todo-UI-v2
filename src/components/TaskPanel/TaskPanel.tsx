import { IconDotsVertical, IconPlus } from '@tabler/icons-react'
import clsx from 'clsx'
import { useContext, useRef, useState } from 'react'

import { FetchContext } from '@/App'
import TaskCard from '@/components/TaskPanel/TaskCard'
import TaskEditor, { RawRequestTask } from '@/components/TaskPanel/TaskEditor'
import DropdownMenu from '@/components/UI/DropdownMenu'
import IconBase from '@/components/UI/IconBase'
import { Group, RequestTask, Tag, Task } from '@/lib/apis'
import { useApi } from '@/lib/fetch'

type TaskPanelProps = {
  group: Group
  tasks: Task[]
  tags: { [key: number]: Tag }
}

const defaultRawRequestTask: RawRequestTask = {
  title: '',
  dueDate: '',
  description: '',
  tags: '',
  notificationTags: '',
}

export default function TaskPanel(props: TaskPanelProps) {
  const { taskApi } = useApi()
  const { fetchAll } = useContext(FetchContext)

  const [isHoveringTitle, setIsHoveringTitle] = useState(false)

  const [isAddingTask, setIsAddingTask] = useState(false)
  const [rawRequestTask, setRawRequestTask] = useState<RawRequestTask>(
    defaultRawRequestTask,
  )

  const menuIconRef = useRef<HTMLDivElement>(null)
  const [isMenuOpened, setIsMenuOpened] = useState(false)

  const handleMenuOpen = () => {
    setIsMenuOpened(!isMenuOpened)
  }

  const onClickAddTask = () => {
    setRawRequestTask(defaultRawRequestTask)

    setIsAddingTask(!isAddingTask)
    setTimeout(() => {
      document.getElementById(`input-new-task-${props.group.id}-title`)?.focus()
    }, 0)
  }

  const closeTaskEditor = () => {
    setIsAddingTask(false)
  }

  const postTask = async (newTask: RequestTask) => {
    newTask.groupId = props.group.id
    newTask.order = null
    await taskApi.postTask(newTask)
    fetchAll()
    setIsAddingTask(false)
  }

  return (
    <div className="w-76 h-full flex flex-col gap-4">
      <div
        className="px-2 bg-white rounded-1"
        onMouseEnter={() => setIsHoveringTitle(true)}
        onMouseLeave={() => setIsHoveringTitle(false)}
      >
        {/* Panel header */}
        <div className="h-10 flex gap-2 items-center">
          <span className="h-5.2 leading-5 px-1.8 bg-slate-200 text-sm rounded-3">
            {props.tasks.length}
          </span>
          <div className="flex-1">
            <p className="h-5.4 leading-5 font-500">{props.group.name}</p>
          </div>
          <div
            className={clsx(
              'flex gap-0.6 relative',
              !isHoveringTitle && !isAddingTask && !isMenuOpened && 'invisible',
            )}
          >
            <IconBase onClick={onClickAddTask}>
              <IconPlus size={16} />
            </IconBase>
            <IconBase onClick={handleMenuOpen} ref2={menuIconRef}>
              <IconDotsVertical size={16} />
            </IconBase>

            <div
              className={clsx(
                'absolute right-0 top-6 z-10',
                !isMenuOpened && 'hidden',
              )}
            >
              <DropdownMenu
                items={[
                  { label: 'Default Order', onClick: () => {} },
                  { label: 'Manual Order', onClick: () => {} },
                  { label: '---' },
                  { label: 'Classify', onClick: () => {} },
                  { label: 'Show Done', onClick: () => {} },
                ]}
                closeMenu={() => setIsMenuOpened(false)}
                menuIconRef={menuIconRef}
              />
            </div>
          </div>
        </div>

        {/* Task editor */}
        <div className={clsx('py-2 b-t-1', !isAddingTask && 'hidden')}>
          <TaskEditor
            editorId={`new-task-${props.group.id}`}
            tags={props.tags}
            rawInputs={rawRequestTask}
            setRawInputs={setRawRequestTask}
            execute={postTask}
            cancel={closeTaskEditor}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-scroll">
        <div className="h-fit pb-8 flex flex-col gap-2">
          {props.tasks.map((task) => (
            <TaskCard
              key={task.id}
              groupId={props.group.id!}
              task={task}
              tags={props.tags}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
