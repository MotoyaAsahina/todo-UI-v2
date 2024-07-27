import ListTitle from '@/components/SideMenu/List/ListTitle'
import { Group } from '@/lib/apis'

type GroupListProps = {
  groups: Group[]
}

export default function GroupList(props: GroupListProps) {
  return (
    <div className="my-2 ml-1">
      <ListTitle onClickCreate={() => {}}>Groups</ListTitle>

      <div className="pl-2 flex flex-col gap-3">
        {props.groups.map((group) => (
          <div key={group.id}>
            <p className="text-md font-400">{group.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
