import { createContext, useEffect, useMemo, useRef, useState } from 'react'

import MainContent from '@/components/MainContent'
import SideMenu from '@/components/SideMenu/SideMenu'
import { Group, Tag, Task } from '@/lib/apis'
import { useApi } from '@/lib/fetch'

export const FetchContext = createContext<{
  fetchAll: () => void
  groups: Group[]
}>({
  fetchAll: () => {},
  groups: [],
})

export const DragContext = createContext<{
  chosenItem: React.MutableRefObject<HTMLElement | null>
  chosenItemParent: React.MutableRefObject<HTMLDivElement | null>
  chosenItemParentId: React.MutableRefObject<number | null>
  chosenItemParentGroup: React.MutableRefObject<string | null>
  isStayingChangedItem: React.MutableRefObject<boolean>
  latestChangedItem: React.MutableRefObject<HTMLElement | null>
  latestMovingDirection: React.MutableRefObject<'up' | 'down'>
}>({
  chosenItem: { current: null },
  chosenItemParent: { current: null },
  chosenItemParentId: { current: null },
  chosenItemParentGroup: { current: null },
  isStayingChangedItem: { current: false },
  latestChangedItem: { current: null },
  latestMovingDirection: { current: 'up' },
})

export default function App() {
  const {
    fetchTasks,
    fetchGroups,
    fetchTags,
    fetchArchivedGroups,
    fetchArchivedTags,
  } = useApi()

  const [tasks, setTasks] = useState<Task[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [tags, setTags] = useState<{ [key: number]: Tag }>([])
  const [archivedGroups, setArchivedGroups] = useState<Group[]>([])
  const [archivedTags, setArchivedTags] = useState<{ [key: number]: Tag }>([])

  const fetchAll = async () => {
    Promise.all([
      fetchTasks(),
      fetchGroups(),
      fetchTags(),
      fetchArchivedGroups(),
      fetchArchivedTags(),
    ]).then(([tasks, groups, tags, archivedGroups, archivedTags]) => {
      setTasks(tasks)
      setGroups(groups.sort((a, b) => a.order! - b.order!))
      setTags(tags)
      setArchivedGroups(archivedGroups.sort((a, b) => a.order! - b.order!))
      setArchivedTags(archivedTags)
    })
  }

  useEffect(() => {
    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chosenItem = useRef<HTMLElement | null>(null)
  const chosenItemParent = useRef<HTMLDivElement | null>(null)

  const chosenItemParentId = useRef<number | null>(null)
  const chosenItemParentGroup = useRef<string | null>(null)

  const isStayingChangedItem = useRef(false)
  const latestChangedItem = useRef<HTMLElement | null>(null)
  const latestMovingDirection = useRef<'up' | 'down'>('up')

  const pinnedTasks = useMemo(
    () => tasks.filter((task) => task.pinned),
    [tasks],
  )

  return (
    <div className="text-gray-800 text-base font-sans">
      <div className="h-svh w-full flex">
        <FetchContext.Provider value={{ fetchAll, groups }}>
          <DragContext.Provider
            value={{
              chosenItem,
              chosenItemParent,
              chosenItemParentId,
              chosenItemParentGroup,
              isStayingChangedItem,
              latestChangedItem,
              latestMovingDirection,
            }}
          >
            <SideMenu
              tags={tags}
              archivedTags={archivedTags}
              groups={groups}
              archivedGroups={archivedGroups}
              pinnedTasks={pinnedTasks}
            />
            <MainContent tasks={tasks} groups={groups} tags={tags} />
          </DragContext.Provider>
        </FetchContext.Provider>
      </div>
    </div>
  )
}
