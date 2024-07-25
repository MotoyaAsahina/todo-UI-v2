import { IconCheck, IconX } from '@tabler/icons-react'
import clsx from 'clsx'
import { useState } from 'react'

import { RequestTask, Tag } from '@/lib/apis'

type TaskEditorProps = {
  editorId: string
  tags: { [key: number]: Tag }
  execute: (newTask: RequestTask) => void
}

export default function TaskEditor(props: TaskEditorProps) {
  const [newTask, setNewTask] = useState<RequestTask>({
    title: '',
    dueDate: '',
    description: '',
    tags: [],
    notificationTags: [],
  })

  const [invalidTags, setInvalidTags] = useState(false)

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate || invalidTags) return
    props.execute(newTask)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAddTask()
    }
  }

  return (
    <div className="flex flex-col gap-1.6">
      {/* Title */}
      <input
        id={`input-${props.editorId}-title`}
        type="text"
        className="w-full h-7 b-1 rounded-1 px-2 text-sm"
        placeholder="Title"
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        onKeyDown={handleKeyDown}
      />

      {/* Due date */}
      <input
        type="text"
        className="w-full h-7 b-1 rounded-1 px-2 text-sm"
        placeholder="Due date"
        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        onKeyDown={handleKeyDown}
      />

      {/* Description */}
      <textarea
        className="w-full b-1 rounded-1 px-2 py-0.4lh text-sm leading-snug resize-none field-auto-sizing-3"
        placeholder="Description"
        onChange={(e) =>
          setNewTask({ ...newTask, description: e.target.value })
        }
        onKeyDown={handleKeyDown}
      />

      {/* Tags */}
      <input
        type="text"
        className={clsx(
          'w-full h-7 b-1 rounded-1 px-2 text-sm',
          invalidTags && 'border-red b-2',
        )}
        placeholder="Tags"
        onChange={(e) => {
          const inputTags = e.target.value.split(' ').filter((tag) => tag)
          const tags = inputTags.map((inputTag) => {
            const tag = Object.values(props.tags).find(
              (tag) => tag.name!.toLowerCase() === inputTag.toLowerCase(),
            )
            return tag?.id ?? -1
          })
          setInvalidTags(tags.includes(-1))
          setNewTask({ ...newTask, tags })
        }}
        onKeyDown={handleKeyDown}
      />

      {/* Notification tags */}
      <input
        type="text"
        className="w-full h-7 b-1 rounded-1 px-2 text-sm"
        placeholder="Notifications"
        onChange={(e) =>
          setNewTask({
            ...newTask,
            notificationTags: e.target.value.split(' '),
          })
        }
        onKeyDown={handleKeyDown}
      />

      <div className="flex gap-0.6 justify-end mt-1">
        <IconX className="cursor-pointer" size={16} />
        <IconCheck
          className="cursor-pointer"
          size={16}
          onClick={() => handleAddTask()}
        />
      </div>
    </div>
  )
}
