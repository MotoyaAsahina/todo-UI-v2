import clsx from 'clsx'
import { useContext, useState } from 'react'

import { FetchContext } from '@/App'
import GroupEditor from '@/components/SideMenu/List/GroupList/GroupEditor'
import ListTitle from '@/components/SideMenu/List/ListTitle'
import { Group, RequestGroup } from '@/lib/apis'
import { useApi } from '@/lib/fetch'

type GroupListProps = {
  groups: Group[]
}

export default function GroupList(props: GroupListProps) {
  const { groupApi } = useApi()
  const { fetchAll } = useContext(FetchContext)

  const [isEditing, setIsEditing] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null)

  const [newGroup, setNewGroup] = useState<RequestGroup>({
    name: '',
    description: '',
    classifiedBy: '',
  })

  const onClickCreate = () => {
    if (!isEditing || (isEditing && !editingGroupId)) setIsEditing(!isEditing)
    setEditingGroupId(null)
    setNewGroup({
      name: '',
      description: '',
      classifiedBy: '',
      hasDueDate: 'OPTIONAL',
      order: props.groups.length,
    })

    setTimeout(() => {
      document.getElementById('input-group-name')?.focus()
    }, 0)
  }

  const onClickEdit = (group: Group) => {
    setIsEditing(true)
    setEditingGroupId(group.id!)
    setNewGroup({
      name: group.name,
      description: group.description,
      classifiedBy: group.classifiedBy,
      hasDueDate: group.hasDueDate,
      order: group.order,
    })

    setTimeout(() => {
      document.getElementById('input-group-name')?.focus()
    }, 0)
  }

  const closeGroupEditor = () => {
    setIsEditing(false)
  }

  const postOrPutGroup = async () => {
    if (editingGroupId) {
      await groupApi.putGroup(editingGroupId, newGroup)
    } else {
      await groupApi.postGroup(newGroup)
    }
    fetchAll()
    closeGroupEditor()
  }

  return (
    <div className="my-2 ml-1">
      <ListTitle onClickCreate={onClickCreate}>Groups</ListTitle>

      {/* Group Editor */}
      <div className={clsx(isEditing || 'hidden')}>
        <GroupEditor
          editorId="group"
          editingGroupId={editingGroupId}
          newGroup={newGroup}
          setNewGroup={setNewGroup}
          execute={postOrPutGroup}
          cancel={closeGroupEditor}
        />
      </div>

      <div className="flex flex-col gap-0.5 rounded-1">
        {props.groups.map((group) => (
          <div className="py-1.5 pl-2 hover:bg-slate-100" key={group.id}>
            <p
              className="w-fit text-md font-400 cursor-pointer"
              onClick={() => onClickEdit(group)}
            >
              {group.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
