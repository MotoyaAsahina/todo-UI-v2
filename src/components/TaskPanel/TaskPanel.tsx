import clsx from 'clsx'
import { useContext, useState } from 'react'

import ClassifiedTaskList from './TaskList/ClassifiedTaskList'
import DefaultTaskList from './TaskList/DefaultTaskList'
import TaskPanelHeader from './TaskPanelHeader'

import { FetchContext } from '@/App'
import TaskEditor, { RawRequestTask } from '@/components/TaskEditor/TaskEditor'
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

  const postTask = async (newTask: RequestTask) => {
    newTask.groupId = props.group.id
    newTask.order = null
    await taskApi.postTask(newTask)
    fetchAll()
    setIsAddingTask(false)
  }

  const [isHoveringHeader, setIsHoveringHeader] = useState(false)

  const [isClassified, setIsClassified] = useState(true)

  const [isAddingTask, setIsAddingTask] = useState(false)
  const [rawRequestTask, setRawRequestTask] = useState<RawRequestTask>(
    defaultRawRequestTask,
  )

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

  return (
    <div className="<sm:w-[calc(100vw-3rem)] w-76 h-full pt-10 shrink-0 flex flex-col gap-4 <sm:snap-center">
      {/* Panel header with task editor */}
      <div
        className="px-2 bg-white rounded-1"
        onMouseEnter={() => setIsHoveringHeader(true)}
        onMouseLeave={() => setIsHoveringHeader(false)}
      >
        <TaskPanelHeader
          group={props.group}
          taskLength={props.tasks.length}
          onClickAddTask={onClickAddTask}
          state={{
            isHoveringHeader,
            isAddingTask,
            isClassified,
            setIsClassified,
          }}
        />

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

      {/* Task list */}
      <div className="flex-1 overflow-y-scroll">
        <div className="pb-8">
          {isClassified && props.group.classifiedBy ? (
            <ClassifiedTaskList
              group={props.group}
              tasks={props.tasks}
              tags={props.tags}
            />
          ) : (
            <DefaultTaskList
              group={props.group}
              tasks={props.tasks}
              tags={props.tags}
            />
          )}
        </div>
      </div>
    </div>
  )
}
