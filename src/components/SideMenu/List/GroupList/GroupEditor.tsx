import { IconCheck, IconX } from '@tabler/icons-react'

import IconBase from '@/components/UI/IconBase'
import { RequestGroup } from '@/lib/apis'

type GroupEditorProps = {
  editorId: string
  editingGroupId: number | null
  newGroup: RequestGroup
  setNewGroup: (newGroup: RequestGroup) => void
  execute: () => void
  cancel: () => void
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
        <IconBase>
          <IconX size={16} onClick={handleClose} />
        </IconBase>
        <IconBase>
          <IconCheck size={16} onClick={handleAddGroup} />
        </IconBase>
      </div>
    </div>
  )
}
