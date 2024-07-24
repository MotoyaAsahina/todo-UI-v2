import { useEffect } from 'react'

import MainContent from '@/components/MainContent'
import SideMenu from '@/components/SideMenu/SideMenu'
import { useApi } from '@/lib/fetch'

export default function App() {
  const { fetchAll } = useApi()

  useEffect(() => {
    fetchAll()
  }, [])

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <SideMenu />
        <MainContent />
      </div>
    </>
  )
}
