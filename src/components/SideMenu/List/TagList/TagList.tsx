import { IconChevronDown, IconChevronRight } from '@tabler/icons-react'
import clsx from 'clsx'
import { useContext, useMemo, useState } from 'react'

import { FetchContext } from '@/App'
import ListTitle from '@/components/SideMenu/List/ListTitle'
import TagEditor from '@/components/SideMenu/List/TagList/TagEditor'
import { RequestTag, Tag } from '@/lib/apis'
import { useApi } from '@/lib/fetch'

type TagListProps = {
  tags: { [key: number]: Tag }
  archivedTags: { [key: number]: Tag }
}

const defaultTag: RequestTag = {
  name: '',
  mainColor: '',
  borderColor: null,
  classification: null,
}

export default function TagList(props: TagListProps) {
  const { tagApi } = useApi()
  const { fetchAll } = useContext(FetchContext)

  const [hoveringId, setHoveringId] = useState<number | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editingTagId, setEditingTagId] = useState<number | null>(null)

  const [newTag, setNewTag] = useState<RequestTag>(defaultTag)

  const classifiedTags = useMemo(() => {
    const classifiedTags: { [key: string]: Tag[] } = {
      '[No classification]': [],
    }
    Object.values(props.tags).forEach((tag) => {
      if (!tag.classification) {
        classifiedTags['[No classification]'].push(tag)
        return
      }
      if (!classifiedTags[tag.classification])
        classifiedTags[tag.classification] = []
      classifiedTags[tag.classification].push(tag)
    })
    return classifiedTags
  }, [props.tags])

  const onClickCreate = () => {
    if (!isEditing || (isEditing && !editingTagId)) setIsEditing(!isEditing)
    setEditingTagId(null)
    setNewTag(defaultTag)

    setTimeout(() => {
      document.getElementById('input-tag-name')?.focus()
    }, 0)
  }

  const onClickEdit = (tag: Tag) => {
    setIsEditing(true)
    setEditingTagId(tag.id!)
    setNewTag(tag)

    setTimeout(() => {
      document.getElementById('input-tag-name')?.focus()
    }, 0)
  }

  const closeTagEditor = () => {
    setIsEditing(false)
  }

  const postOrPutTag = async () => {
    if (editingTagId) {
      await tagApi.putTag(editingTagId, newTag)
    } else {
      await tagApi.postTag(newTag)
    }
    fetchAll()
    closeTagEditor()
  }

  const deleteTag = async () => {
    if (!editingTagId) return
    await tagApi.deleteTag(editingTagId)
    fetchAll()
    closeTagEditor()
  }

  const archiveTag = async () => {
    if (!editingTagId) return
    await tagApi.putTagArchived(editingTagId)
    fetchAll()
    closeTagEditor()
  }

  const [showArchived, setShowArchived] = useState(false)

  const onClickShowArchived = async () => {
    setShowArchived(!showArchived)
  }

  const unarchiveTag = async (tagId: number) => {
    await tagApi.putTagUnarchived(tagId)
    fetchAll()
  }

  return (
    <div className="my-2 ml-1">
      <ListTitle onClickCreate={onClickCreate}>Tags</ListTitle>

      {/* Tag Editor */}
      <div className={clsx(isEditing || 'hidden')}>
        <TagEditor
          editorId="tag"
          editingTagId={editingTagId}
          newTag={newTag}
          setNewTag={setNewTag}
          execute={postOrPutTag}
          cancel={closeTagEditor}
          archive={archiveTag}
          delete={deleteTag}
        />
      </div>

      {/* Tag List */}
      <div className="flex flex-col gap-0.8">
        {Object.keys(classifiedTags)
          .sort((a, b) => (a > b ? 1 : -1))
          .map((classification) => (
            <div key={classification} className="flex flex-col gap-0.5">
              <p className="text-xs font-400 mt-1 mb-0.5">{classification}</p>
              <div className="pl-1.5 flex flex-wrap gap-0.5 gap-row-0.6">
                {classifiedTags[classification]
                  .sort((a, b) => a.name!.localeCompare(b.name!))
                  .map((tag) => (
                    <div
                      key={tag.id}
                      className={clsx(
                        'flex gap-1 cursor-pointer rounded-1 px-1 py-0.8 items-center',
                        hoveringId === tag.id && 'bg-slate-100',
                        isEditing && editingTagId === tag.id && 'bg-slate-100',
                      )}
                      onClick={() => onClickEdit(tag)}
                      onMouseEnter={() => setHoveringId(tag.id!)}
                      onMouseLeave={() => setHoveringId(null)}
                    >
                      <div
                        className="h-3.6 w-3.6 rounded-1 bg-gray-2 b-1"
                        style={{
                          backgroundColor: tag.mainColor,
                          borderColor: tag.borderColor || tag.mainColor,
                        }}
                      />
                      <p className="text-xs font-400">{tag.name}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>

      {/* Archived Tag List */}
      <div className="mt-3 flex flex-col gap-3">
        <div
          className="w-fit flex gap-1 items-center cursor-pointer"
          onClick={onClickShowArchived}
        >
          {!showArchived ? (
            <IconChevronRight size={14} stroke={1.5} />
          ) : (
            <IconChevronDown size={14} stroke={1.5} />
          )}
          <p className="pl-1 text-sm font-300">Archived Tags</p>
        </div>
        <div
          className={clsx(
            'pl-1.5 flex-col gap-2',
            showArchived ? 'flex' : 'hidden',
          )}
        >
          {Object.values(props.archivedTags)
            .sort((a, b) => a.name!.localeCompare(b.name!))
            .map((tag) => (
              <div
                key={tag.id}
                className="flex gap-1 pl-1 pr-2 items-center [&>p]:hover:visible font-300"
              >
                <div
                  className="h-3.6 w-3.6 rounded-1 bg-gray-2 b-1"
                  style={{
                    backgroundColor: tag.mainColor,
                    borderColor: tag.borderColor || tag.mainColor,
                  }}
                />
                <p className="text-xs flex-1">{tag.name}</p>

                <p
                  className="text-xs cursor-pointer hover:underline invisible"
                  onClick={() => unarchiveTag(tag.id!)}
                >
                  Restore
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
