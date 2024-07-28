import { IconDotsVertical, IconPlus } from '@tabler/icons-react'
import clsx from 'clsx'
import { useContext, useMemo, useRef, useState } from 'react'

import { FetchContext } from '@/App'
import TaskCard from '@/components/TaskCard/TaskCard'
import TaskEditor, { RawRequestTask } from '@/components/TaskEditor/TaskEditor'
import TaskTag from '@/components/TaskTag/TaskTag'
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

  const [isClassified, setIsClassified] = useState(true)

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

  const classificationTags = useMemo(() => {
    return props.group.classifiedBy
      ? Object.values(props.tags).filter(
          (tag) => tag.classification === props.group.classifiedBy,
        )
      : []
  }, [props.tags, props.group.classifiedBy])

  const usedClassificationTags = useMemo(() => {
    const usedClassificationTags = classificationTags.filter((tag) =>
      props.tasks
        .filter((task) => task.groupId === props.group.id)
        .some((task) => task.tags?.includes(tag.id!)),
    )
    if (
      props.tasks.some((task) =>
        usedClassificationTags.every((tag) => !task.tags?.includes(tag.id!)),
      )
    ) {
      usedClassificationTags.push({ id: -1 })
    }
    return usedClassificationTags
  }, [classificationTags, props.tasks, props.group.id])

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
                  {
                    label: 'Classify',
                    check: isClassified,
                    onClick: () => {
                      setIsClassified(!isClassified)
                    },
                  },
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

      {isClassified && props.group.classifiedBy ? (
        <div className="flex-1 overflow-y-scroll">
          <div className="pb-8 flex flex-col gap-4">
            {[...usedClassificationTags].map((tag) => (
              <div key={tag.id}>
                <div className="pl-1">
                  {tag.id! > 0 ? (
                    <TaskTag tag={tag} />
                  ) : (
                    <p className="text-xs font-400">Unclassified</p>
                  )}
                </div>
                <div className="h-fit flex flex-col gap-2 mt-2">
                  {props.tasks
                    .filter((task) =>
                      tag.id! > 0
                        ? task.tags?.includes(tag.id!)
                        : usedClassificationTags.every(
                            (tag) => !task.tags?.includes(tag.id!),
                          ),
                    )
                    .map((task) => {
                      return (
                        <TaskCard
                          key={task.id}
                          groupId={props.group.id!}
                          task={task}
                          tags={props.tags}
                          hiddenTagIds={[tag.id!]}
                        />
                      )
                    })}
                </div>
              </div>
            ))}
            <div
              className={clsx(
                classificationTags.length ===
                  usedClassificationTags.filter((tag) => tag.id !== -1)
                    .length && 'hidden',
              )}
            >
              <div className="pl-1">
                <p className="text-xs font-400">Unused tags</p>
              </div>
              <div className="px-1 flex flex-wrap gap-1 mt-1.6">
                {classificationTags
                  .filter((tag) => !usedClassificationTags.includes(tag))
                  .map((tag) => (
                    <TaskTag key={tag.id} tag={tag} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  )
}
