import { useState } from 'react'

import { Configuration } from './apis'
import { Group, GroupApi, Tag, TagApi, Task, TaskApi } from './apis/api'

export function useApi() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [tags, setTags] = useState<{ [key: number]: Tag }>([])
  const [loading, setLoading] = useState(false)

  const taskApi = new TaskApi(new Configuration({ basePath: '' }))
  const groupApi = new GroupApi(new Configuration({ basePath: '' }))
  const tagApi = new TagApi(new Configuration({ basePath: '' }))

  const fetchTasks = async () => {
    const tasks = await taskApi.getTasks()
    setTasks(tasks.data)
  }

  const fetchGroups = async () => {
    const groups = await groupApi.getGroups()
    setGroups(groups.data)
  }

  const fetchTags = async () => {
    const tags = await tagApi.getTags()
    tags.data.forEach((tag) => {
      setTags((tags) => ({ ...tags, [tag.id!]: tag }))
    })
  }

  const fetchAll = async () => {
    setLoading(true)
    await Promise.all([fetchTasks(), fetchGroups(), fetchTags()])
    setLoading(false)
  }

  return {
    tasks,
    groups,
    tags,
    loading,
    fetchTasks,
    fetchGroups,
    fetchTags,
    fetchAll,
  }
}
