import { IconArchive, IconCheck, IconTrash, IconX } from '@tabler/icons-react'
import clsx from 'clsx'

import IconBase from '@/components/UI/IconBase'
import { RequestGroup } from '@/lib/apis'

type GroupEditorProps = {
  editorId: string
  editingGroupId: number | null
  newGroup: RequestGroup
  setNewGroup: (newGroup: RequestGroup) => void
  execute: () => void
  cancel: () => void
  archive: () => void
  delete: () => void
}

export default function GroupEditor(props: GroupEditorProps) {
  const handleAddGroup = () => {
    if (!props.newGroup.name) return
    props.execute()
  }

  const handleClose = () => {
    props.cancel()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAddGroup()
    } else if (e.key === 'Escape') {
      handleClose()
    }
  }

  return (
    <div className="mb-3 rounded-1 p-2 b-1 flex flex-col gap-0.8 ml--1 mt--1">
      {/* Name */}
      <input
        id={`input-${props.editorId}-name`}
        type="text"
        className="w-full h-7 rounded-1 px-2 text-sm"
        placeholder="Name"
        value={props.newGroup.name}
        onChange={(e) =>
          props.setNewGroup({ ...props.newGroup, name: e.target.value })
        }
        onKeyDown={handleKeyDown}
      />

      {/* Description */}
      <textarea
        className="w-full rounded-1 px-2 py-0.3lh text-sm leading-snug resize-none field-auto-sizing-1_4"
        placeholder="Description"
        value={props.newGroup.description}
        onChange={(e) =>
          props.setNewGroup({ ...props.newGroup, description: e.target.value })
        }
        onKeyDown={handleKeyDown}
      />

      {/* Classified by */}
      <input
        type="text"
        className="w-full h-7 rounded-1 px-2 text-sm"
        placeholder="Classified by"
        value={props.newGroup.classifiedBy || ''}
        onChange={(e) =>
          props.setNewGroup({ ...props.newGroup, classifiedBy: e.target.value })
        }
        onKeyDown={handleKeyDown}
      />

      <div className="flex gap-0.6 justify-end mt-1">
        <div
          className={clsx('gap-0.6', props.editingGroupId ? 'flex' : 'hidden')}
        >
          <IconBase onClick={props.delete}>
            <IconTrash size={16} />
          </IconBase>
          <IconBase onClick={props.archive}>
            <IconArchive size={16} />
          </IconBase>
          <div className="b-0.5 mx-1 my-0.4" />
        </div>
        <IconBase onClick={handleClose}>
          <IconX size={16} />
        </IconBase>
        <IconBase onClick={handleAddGroup}>
          <IconCheck size={16} />
        </IconBase>
      </div>
    </div>
  )
}
