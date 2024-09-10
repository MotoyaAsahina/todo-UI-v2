import AppLogo from './AppLogo'
import GroupList from './List/GroupList/GroupList'
import PinnedTaskList from './List/PinnedTaskList/PinnedTaskList'
import TagList from './List/TagList/TagList'

import { Group, Tag, Task } from '@/lib/apis'

type SideMenuProps = {
  tags: { [key: number]: Tag }
  archivedTags: { [key: number]: Tag }
  groups: Group[]
  archivedGroups: Group[]
  pinnedTasks: Task[]
}

export default function SideMenu(props: SideMenuProps) {
  return (
    <div className="md:w-200px lg:w-260px shrink-0 h-screen overflow-y-scroll overflow-x-hidden <md:hidden">
      <div className="flex b-r-0.75 p-4 flex-col gap-5">
        <AppLogo />

        <input
          type="text"
          className="w-full h-7 px-2 bg-white rounded-1 mx-0.5 b-1 text-xs font-300"
          placeholder="Search"
        />

        <PinnedTaskList
          groups={props.groups}
          tags={props.tags}
          pinnedTasks={props.pinnedTasks}
        />

        <TagList tags={props.tags} archivedTags={props.archivedTags} />

        <GroupList
          groups={props.groups}
          archivedGroups={props.archivedGroups}
        />
      </div>
    </div>
  )
}
