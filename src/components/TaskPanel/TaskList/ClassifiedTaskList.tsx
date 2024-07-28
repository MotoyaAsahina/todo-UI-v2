import clsx from 'clsx'
import { useMemo } from 'react'

import TaskCard from '@/components/TaskCard/TaskCard'
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

  return (
    <div className="pb-8 flex flex-col gap-4">
      {[...usedClassificationTags].map((tag) => (
        <div key={tag.id}>
          <div className="pl-1">
            {tag.id! > 0 ? (
              <TaskTag tag={tag} />
            ) : (
              <p className="text-xs font-400">Unclassified</p>
            )}
          </div>
          <div className="h-fit flex flex-col gap-2 mt-2">
            {props.tasks
              .filter((task) =>
                tag.id! > 0
                  ? task.tags?.includes(tag.id!)
                  : usedClassificationTags.every(
                      (tag) => !task.tags?.includes(tag.id!),
                    ),
              )
              .map((task) => {
                return (
                  <TaskCard
                    key={task.id}
                    groupId={props.group.id!}
                    task={task}
                    tags={props.tags}
                    hiddenTagIds={[tag.id!]}
                  />
                )
              })}
          </div>
        </div>
      ))}
      <div
        className={clsx(
          classificationTags.length ===
            usedClassificationTags.filter((tag) => tag.id !== -1).length &&
            'hidden',
        )}
      >
        <div className="pl-1">
          <p className="text-xs font-400">Unused tags</p>
        </div>
        <div className="px-1 flex flex-wrap gap-1 mt-1.6">
          {classificationTags
            .filter((tag) => !usedClassificationTags.includes(tag))
            .map((tag) => (
              <TaskTag key={tag.id} tag={tag} />
            ))}
        </div>
      </div>
    </div>
  )
}
