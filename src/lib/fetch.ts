import { Configuration } from './apis'
import { GroupApi, Tag, TagApi, TaskApi } from './apis/api'

export function useApi() {
  const taskApi = new TaskApi(new Configuration({ basePath: '' }))
  const groupApi = new GroupApi(new Configuration({ basePath: '' }))
  const tagApi = new TagApi(new Configuration({ basePath: '' }))

  const fetchTasks = async () => {
    const tasks = await taskApi.getTasks()
    return tasks.data
  }

  const fetchGroups = async () => {
    const groups = await groupApi.getGroups()
    return groups.data
  }

  const fetchTags = async () => {
    const tags = await tagApi.getTags()
    const tagMap: { [key: number]: Tag } = {}
    tags.data.forEach((tag) => {
      tagMap[tag.id!] = tag
    })
    return tagMap
  }

  return {
    taskApi,
    groupApi,
    tagApi,
    fetchTasks,
    fetchGroups,
    fetchTags,
  }
}
