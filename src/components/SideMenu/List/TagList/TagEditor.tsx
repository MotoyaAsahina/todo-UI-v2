import {
  IconArchive,
  IconCheck,
  IconColorPicker,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import clsx from 'clsx'

import TaskTag from '@/components/TaskTag/TaskTag'
import IconBase from '@/components/UI/IconBase'
import { RequestTag } from '@/lib/apis'

type TagEditorProps = {
  editorId: string
  editingTagId: number | null
  newTag: RequestTag
  setNewTag: (newTag: RequestTag) => void
  execute: () => void
  cancel: () => void
  archive: () => void
  delete: () => void
}

export default function TagEditor(props: TagEditorProps) {
  const handleAddTag = () => {
    if (!props.newTag.name || !props.newTag.mainColor) return
    props.execute()
  }

  const handleClose = () => {
    props.cancel()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAddTag()
    } else if (e.key === 'Escape') {
      handleClose()
    }
  }

  return (
    <div className="mb-3 rounded-1 p-2 b-1 flex flex-col gap-0.8 ml--1 mt--1">
      <div className="mb-1 pl-1 flex gap-1 items-center">
        <p className="text-xs font-300">Preview: </p>
        <TaskTag
          tag={{
            name: props.newTag.name,
            mainColor: props.newTag.mainColor,
            borderColor: props.newTag.borderColor,
            classification: props.newTag.classification,
          }}
        />
      </div>

      {/* Name */}
      <input
        id={`input-${props.editorId}-name`}
        type="text"
        className="w-full h-7 rounded-1 px-2 text-sm"
        placeholder="Name"
        value={props.newTag.name}
        onChange={(e) =>
          props.setNewTag({ ...props.newTag, name: e.target.value })
        }
        onKeyDown={handleKeyDown}
      />

      {/* Main color */}
      <div className="ml-2 mr-1 flex gap-1.5 items-center">
        <div
          className="h-3.6 w-3.6 rounded-1 bg-gray-2"
          style={{ backgroundColor: props.newTag.mainColor }}
        />
        <input
          type="text"
          className="w-full h-7 rounded-1 px-2 text-sm flex-1"
          placeholder="Main color"
          value={props.newTag.mainColor || ''}
          onChange={(e) =>
            props.setNewTag({ ...props.newTag, mainColor: e.target.value })
          }
          onKeyDown={handleKeyDown}
        />
        <label className="block h-fit relative">
          <IconColorPicker className="cursor-pointer" size={16} />
          <input
            type="color"
            className="absolute top--4 left-6 invisible"
            value={props.newTag.mainColor}
            onChange={(e) =>
              props.setNewTag({ ...props.newTag, mainColor: e.target.value })
            }
          />
        </label>
      </div>

      {/* Border color */}
      <div className="ml-2 mr-1 flex gap-1.5 items-center">
        <div
          className="h-3.6 w-3.6 rounded-1 bg-gray-2"
          style={{
            backgroundColor: props.newTag.borderColor || '',
          }}
        />
        <input
          type="text"
          className="w-full h-7 rounded-1 px-2 text-sm flex-1"
          placeholder="Border color"
          value={props.newTag.borderColor ?? ''}
          onChange={(e) =>
            props.setNewTag({
              ...props.newTag,
              borderColor: e.target.value || null,
            })
          }
          onKeyDown={handleKeyDown}
        />
        <label className="block h-fit relative">
          <IconColorPicker className="cursor-pointer" size={16} />
          <input
            type="color"
            className="absolute top--4 left-6 invisible"
            value={props.newTag.borderColor ?? ''}
            onChange={(e) =>
              props.setNewTag({ ...props.newTag, borderColor: e.target.value })
            }
          />
        </label>
      </div>

      {/* Classification */}
      <input
        type="text"
        className="w-full h-7 rounded-1 px-2 text-sm"
        placeholder="Classification"
        value={props.newTag.classification ?? ''}
        onChange={(e) =>
          props.setNewTag({
            ...props.newTag,
            classification: e.target.value || null,
          })
        }
        onKeyDown={handleKeyDown}
      />

      <div className="flex gap-0.6 justify-end mt-1">
        <div
          className={clsx('gap-0.6', props.editingTagId ? 'flex' : 'hidden')}
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
        <IconBase onClick={handleAddTag}>
          <IconCheck size={16} />
        </IconBase>
      </div>
    </div>
  )
}
