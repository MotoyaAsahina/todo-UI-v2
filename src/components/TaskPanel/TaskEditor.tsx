import { IconCheck, IconX } from '@tabler/icons-react'
import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'

import { RequestTask, Tag } from '@/lib/apis'

export type RawRequestTask = {
  title: string
  dueDate: string
  description: string
  tags: string
  notificationTags: string
}

type TaskEditorProps = {
  editorId: string
  tags: { [key: number]: Tag }
  rawInputs: RawRequestTask
  setRawInputs: (newTask: RawRequestTask) => void
  execute: (newTask: RequestTask) => void
  cancel: () => void
}

export default function TaskEditor(props: TaskEditorProps) {
  const [invalidTags, setInvalidTags] = useState(false)

  const [requestTask, setRequestTask] = useState<RequestTask>({
    title: '',
    dueDate: '',
    description: '',
    tags: [],
    notificationTags: [],
  })

  const handleAddTask = () => {
    if (!props.rawInputs.title || invalidTags) return
    // TODO: Due date の null を許容
    props.execute(requestTask)
  }

  const handleClose = () => {
    props.cancel()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAddTask()
    } else if (e.key === 'Escape') {
      handleClose()
    }
  }

  const tagsLowerCased = useMemo(() => {
    const tagsLowerCased: { [key: string]: Tag } = {}
    Object.values(props.tags).forEach((tag) => {
      tagsLowerCased[tag.name!.toLowerCase()] = tag
    })
    return tagsLowerCased
  }, [props.tags])

  useEffect(() => {
    const tags = props.rawInputs.tags
      .split(' ')
      .filter((tag) => tag)
      .map((inputTag) => tagsLowerCased[inputTag.toLowerCase()]?.id ?? -1)
    setInvalidTags(tags.includes(-1))

    setRequestTask({
      title: props.rawInputs.title,
      dueDate: props.rawInputs.dueDate,
      description: props.rawInputs.description,
      tags: tags,
      notificationTags:
        props.rawInputs.notificationTags.length > 0
          ? props.rawInputs.notificationTags.split(' ')
          : [],
    })
  }, [props.rawInputs, tagsLowerCased])

  return (
    <div className="flex flex-col gap-1.6">
      {/* Title */}
      <input
        id={`input-${props.editorId}-title`}
        type="text"
        className="w-full h-7 b-1 rounded-1 px-2 text-sm"
        placeholder="Title"
        value={props.rawInputs.title}
        onChange={(e) => {
          props.setRawInputs({ ...props.rawInputs, title: e.target.value })
        }}
        onKeyDown={handleKeyDown}
      />

      {/* Due date */}
      <input
        type="text"
        className="w-full h-7 b-1 rounded-1 px-2 text-sm"
        placeholder="Due date"
        value={props.rawInputs.dueDate}
        onChange={(e) => {
          props.setRawInputs({ ...props.rawInputs, dueDate: e.target.value })
        }}
        onKeyDown={handleKeyDown}
      />

      {/* Description */}
      <textarea
        className="w-full b-1 rounded-1 px-2 py-0.4lh text-sm leading-snug resize-none field-auto-sizing-3"
        placeholder="Description"
        value={props.rawInputs.description}
        onChange={(e) => {
          props.setRawInputs({
            ...props.rawInputs,
            description: e.target.value,
          })
        }}
        onKeyDown={handleKeyDown}
      />

      {/* Tags */}
      <input
        type="text"
        className={clsx(
          'w-full h-7 b-1 rounded-1 px-2 text-sm',
          invalidTags && 'bg-red-300',
        )}
        placeholder="Tags"
        value={props.rawInputs.tags}
        onChange={(e) => {
          props.setRawInputs({ ...props.rawInputs, tags: e.target.value })
        }}
        onKeyDown={handleKeyDown}
      />

      {/* Notification tags */}
      <input
        type="text"
        className="w-full h-7 b-1 rounded-1 px-2 text-sm"
        placeholder="Notifications"
        value={props.rawInputs.notificationTags}
        onChange={(e) => {
          props.setRawInputs({
            ...props.rawInputs,
            notificationTags: e.target.value,
          })
        }}
        onKeyDown={handleKeyDown}
      />

      <div className="flex gap-0.6 justify-end mt-1">
        <IconX className="cursor-pointer" size={16} onClick={handleClose} />
        <IconCheck
          className="cursor-pointer"
          size={16}
          onClick={handleAddTask}
        />
      </div>
    </div>
  )
}
