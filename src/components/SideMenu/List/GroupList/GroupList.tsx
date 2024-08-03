import { IconChevronDown, IconChevronRight } from '@tabler/icons-react'
import clsx from 'clsx'
import { useContext, useState } from 'react'

import { FetchContext } from '@/App'
import GroupEditor from '@/components/SideMenu/List/GroupList/GroupEditor'
import ListTitle from '@/components/SideMenu/List/ListTitle'
import DraggableItem from '@/components/UI/DraggableList/DraggableItem'
import DraggableList from '@/components/UI/DraggableList/DraggableList'
import { Group, RequestGroup } from '@/lib/apis'
import { useApi } from '@/lib/fetch'

type GroupListProps = {
  groups: Group[]
  archivedGroups: Group[]
}

const defaultGroup: RequestGroup = {
  name: '',
  description: '',
  classifiedBy: null,
  hasDueDate: 'OPTIONAL',
  order: undefined,
}

export default function GroupList(props: GroupListProps) {
  const { groupApi } = useApi()
  const { fetchAll } = useContext(FetchContext)

  const [isEditing, setIsEditing] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null)

  const [newGroup, setNewGroup] = useState<RequestGroup>(defaultGroup)

  const onClickCreate = () => {
    if (!isEditing || (isEditing && !editingGroupId)) setIsEditing(!isEditing)
    setEditingGroupId(null)
    setNewGroup({ ...defaultGroup, order: props.groups.length })

    setTimeout(() => {
      document.getElementById('input-group-name')?.focus()
    }, 0)
  }

  const onClickEdit = (group: Group) => {
    setIsEditing(true)
    setEditingGroupId(group.id!)
    setNewGroup(group)

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

  const deleteGroup = async () => {
    if (!editingGroupId) return
    await groupApi.deleteGroup(editingGroupId)
    fetchAll()
    closeGroupEditor()
  }

  const archiveGroup = async () => {
    if (!editingGroupId) return
    await groupApi.putGroupArchived(editingGroupId)
    fetchAll()
    closeGroupEditor()
  }

  const [showArchived, setShowArchived] = useState(false)

  const onClickShowArchived = async () => {
    setShowArchived(!showArchived)
  }

  const unarchiveGroup = async (groupId: number) => {
    await groupApi.putGroupUnarchived(groupId)
    fetchAll()
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
          archive={archiveGroup}
          delete={deleteGroup}
        />
      </div>

      {/* Draggable Group List */}
      <DraggableList className="flex flex-col gap-0.5" group="group">
        {props.groups.map((group) => (
          <DraggableItem
            className={clsx(
              'py-1.5 px-2 hover:bg-slate-100 rounded-1 cursor-pointer',
              isEditing && editingGroupId === group.id && 'bg-slate-100',
            )}
            key={group.id}
            onClick={() => onClickEdit(group)}
            onDrop={async (_, newIndex) => {
              await groupApi.putGroup(group.id!, {
                ...group,
                order: newIndex,
              })
              fetchAll()
            }}
          >
            <p className="text-md font-400">{group.name}</p>
          </DraggableItem>
        ))}
      </DraggableList>

      {/* Archived Group List */}
      <div className="mt-3 flex flex-col gap-3.2">
        <div
          className="w-fit flex gap-1 items-center cursor-pointer"
          onClick={onClickShowArchived}
        >
          {!showArchived ? (
            <IconChevronRight size={14} stroke={1.5} />
          ) : (
            <IconChevronDown size={14} stroke={1.5} />
          )}
          <p className="pl-1 text-sm font-300">Archived Groups</p>
        </div>
        <div
          className={clsx('flex-col gap-2', showArchived ? 'flex' : 'hidden')}
        >
          {props.archivedGroups.map((group) => (
            <div
              key={group.id}
              className="flex font-300 pr-2 [&>p]:hover:visible"
            >
              <p className="text-sm flex-1 px-2">{group.name}</p>
              <p
                className="text-xs cursor-pointer hover:underline invisible"
                onClick={() => unarchiveGroup(group.id!)}
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
