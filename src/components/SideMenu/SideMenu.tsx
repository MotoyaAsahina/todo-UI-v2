import AppLogo from '@/components/SideMenu/AppLogo'
import GroupList from '@/components/SideMenu/List/GroupList'
import TagList from '@/components/SideMenu/List/TagList'
import { Group, Tag } from '@/lib/apis'

type SideMenuProps = {
  tags: { [key: number]: Tag }
  groups: Group[]
}

export default function SideMenu(props: SideMenuProps) {
  return (
    <div className="hidden md:flex b-r-0.75 px-4 flex-col gap-5">
      <AppLogo />

      <input
        type="text"
        className="h-7 px-2 bg-white rounded-1 mx-0.5 b-1 text-xs font-300"
        placeholder="Search"
      />

      <TagList tags={props.tags} />

      <GroupList groups={props.groups} />
    </div>
  )
}
