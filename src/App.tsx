import { useEffect } from 'react'

import MainContent from '@/components/MainContent'
import SideMenu from '@/components/SideMenu/SideMenu'
import { useApi } from '@/lib/fetch'

export default function App() {
  const {
    tasks,
    groups,
    tags,
    loading,
    fetchTasks,
    fetchGroups,
    fetchTags,
    fetchAll,
  } = useApi()

  useEffect(() => {
    fetchAll()
  }, [])

  return (
    <div className="text-gray-7 text-base">
      <div className="grid min-h-screen w-full md:grid-cols-[200px_1fr] lg:grid-cols-[260px_1fr]">
        <SideMenu />
        <MainContent tasks={tasks} groups={groups} tags={tags} />
      </div>
    </div>
  )
}
