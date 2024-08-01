import AppLogo from '@/components/SideMenu/AppLogo'
import GroupList from '@/components/SideMenu/List/GroupList/GroupList'
import TagList from '@/components/SideMenu/List/TagList/TagList'
import { Group, Tag } from '@/lib/apis'

type SideMenuProps = {
  tags: { [key: number]: Tag }
  groups: Group[]
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

        <TagList tags={props.tags} />

        <GroupList groups={props.groups} />
      </div>
    </div>
  )
}
