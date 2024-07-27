import clsx from 'clsx'
import { useContext, useState } from 'react'

import { FetchContext } from '@/App'
import ListTitle from '@/components/SideMenu/List/ListTitle'
import TagEditor from '@/components/SideMenu/List/TagList/TagEditor'
import { RequestTag, Tag } from '@/lib/apis'
import { useApi } from '@/lib/fetch'

type TagListProps = {
  tags: { [key: number]: Tag }
}

export default function TagList(props: TagListProps) {
  const { tagApi } = useApi()
  const { fetchAll } = useContext(FetchContext)

  const [hoveringId, setHoveringId] = useState<number | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editingTagId, setEditingTagId] = useState<number | null>(null)

  const [newTag, setNewTag] = useState<RequestTag>({
    name: '',
    mainColor: '',
    borderColor: '',
    classification: '',
  })

  const onClickCreate = () => {
    if (!isEditing || (isEditing && !editingTagId)) setIsEditing(!isEditing)
    setEditingTagId(null)
    setNewTag({
      name: '',
      mainColor: '',
      borderColor: '',
      classification: '',
    })

    setTimeout(() => {
      document.getElementById('input-tag-name')?.focus()
    }, 0)
  }

  const onClickEdit = (tag: Tag) => {
    setIsEditing(true)
    setEditingTagId(tag.id!)
    setNewTag({
      name: tag.name,
      mainColor: tag.mainColor,
      borderColor: tag.borderColor,
      classification: tag.classification,
    })

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
        />
      </div>

      {/* Tag List */}
      <div className="pl-2 flex flex-wrap gap-0.5 gap-row-0.6">
        {Object.values(props.tags).map((tag) => (
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
              className="h-3.6 w-3.6 rounded-1 bg-gray-2"
              style={{ backgroundColor: tag.mainColor }}
            />
            <p className="text-xs font-400">{tag.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
