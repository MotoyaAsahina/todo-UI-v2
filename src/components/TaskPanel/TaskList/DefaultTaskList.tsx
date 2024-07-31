import { useState } from 'react'

import TaskCard from '@/components/TaskCard/TaskCard'
import DraggableItem from '@/components/UI/DraggableList/DraggableItem'
import DraggableList from '@/components/UI/DraggableList/DraggableList'
import { Group, Tag, Task } from '@/lib/apis'

type DefaultTaskListProps = {
  group: Group
  tasks: Task[]
  tags: { [key: number]: Tag }
  hiddenTagIds?: number[]
}

export default function DefaultTaskList(props: DefaultTaskListProps) {
  const [editingIds, setEditingIds] = useState<number[]>([])

  return (
    <DraggableList
      className="flex flex-col gap-2"
      listId={props.group.id}
      group="task"
      onCancel={() => {
        console.log('canceled')
      }}
    >
      {props.tasks.map((task) => {
        return (
          <DraggableItem
            key={task.id}
            onDrop={() => {
              console.log('dropped')
            }}
            draggable={!editingIds.includes(task.id!)}
          >
            <TaskCard
              groupId={props.group.id!}
              task={task}
              tags={props.tags}
              hiddenTagIds={props.hiddenTagIds}
              setEditingIds={setEditingIds}
            />
          </DraggableItem>
        )
      })}
    </DraggableList>
  )
}
