import clsx from 'clsx'
import { useMemo } from 'react'

import DefaultTaskList from './DefaultTaskList'

import TaskTag from '@/components/TaskTag/TaskTag'
import { Group, Tag, Task } from '@/lib/apis'

type ClassifiedTaskListProps = {
  group: Group
  tasks: Task[]
  tags: { [key: number]: Tag }
}

export default function ClassifiedTaskList(props: ClassifiedTaskListProps) {
  const classificationTags = useMemo(() => {
    return props.group.classifiedBy
      ? Object.values(props.tags).filter(
          (tag) => tag.classification === props.group.classifiedBy,
        )
      : []
  }, [props.tags, props.group.classifiedBy])

  const usedClassificationTags = useMemo(() => {
    const usedClassificationTags = classificationTags.filter((tag) =>
      props.tasks
        .filter((task) => task.groupId === props.group.id)
        .some((task) => task.tags?.includes(tag.id!)),
    )
    if (
      props.tasks.some((task) =>
        usedClassificationTags.every((tag) => !task.tags?.includes(tag.id!)),
      )
    ) {
      usedClassificationTags.push({ id: -1 })
    }
    return usedClassificationTags
  }, [classificationTags, props.tasks, props.group.id])

  const classifiedTasks = useMemo(() => {
    const classifiedTasks: { [key: number]: Task[] } = {}
    usedClassificationTags.forEach((tag) => {
      classifiedTasks[tag.id!] = props.tasks.filter((task) =>
        tag.id! > 0
          ? task.tags?.includes(tag.id!)
          : usedClassificationTags.every(
              (tag) => !task.tags?.includes(tag.id!),
            ),
      )
    })
    return classifiedTasks
  }, [usedClassificationTags, props.tasks])

  const unusedClassificationTags = useMemo(() => {
    return classificationTags.filter(
      (tag) => !usedClassificationTags.includes(tag),
    )
  }, [classificationTags, usedClassificationTags])

  return (
    <div className="flex flex-col gap-4">
      {/* Classified Task List */}
      {usedClassificationTags.map((tag) => (
        <div key={tag.id} className="flex flex-col gap-2">
          {/* Classification Tag */}
          <div className="pl-1">
            {tag.id! > 0 ? (
              <TaskTag tag={tag} />
            ) : (
              <p className="h-4.3 leading-4.3 text-xs font-400">Unclassified</p>
            )}
          </div>

          {/* Task List */}
          <DefaultTaskList
            group={props.group}
            tasks={classifiedTasks[tag.id!]}
            tags={props.tags}
            hiddenTagIds={[tag.id!]}
          />
        </div>
      ))}

      {/* Unused Tags */}
      <div className={clsx(!unusedClassificationTags.length && 'hidden')}>
        <div className="pl-1">
          <p className="text-xs font-400">Unused tags</p>
        </div>
        <div className="px-1 flex flex-wrap gap-1 mt-1.6">
          {unusedClassificationTags.map((tag) => (
            <TaskTag key={tag.id} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  )
}
