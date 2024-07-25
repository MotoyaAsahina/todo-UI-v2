import { createContext, useEffect, useState } from 'react'

import MainContent from '@/components/MainContent'
import SideMenu from '@/components/SideMenu/SideMenu'
import { Group, Tag, Task } from '@/lib/apis'
import { useApi } from '@/lib/fetch'

export const FetchContext = createContext<{ fetchAll: () => void }>({
  fetchAll: () => {},
})

export default function App() {
  const { fetchTasks, fetchGroups, fetchTags } = useApi()

  const [tasks, setTasks] = useState<Task[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [tags, setTags] = useState<{ [key: number]: Tag }>([])

  const fetchAll = async () => {
    Promise.all([fetchTasks(), fetchGroups(), fetchTags()]).then(
      ([tasks, groups, tags]) => {
        setTasks(tasks)
        setGroups(groups)
        setTags(tags)
      },
    )
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return (
    <div className="text-gray-800 text-base font-sans">
      <div className="grid min-h-screen w-full md:grid-cols-[200px_1fr] lg:grid-cols-[260px_1fr]">
        <FetchContext.Provider value={{ fetchAll }}>
          <SideMenu />
          <MainContent tasks={tasks} groups={groups} tags={tags} />
        </FetchContext.Provider>
      </div>
    </div>
  )
}
