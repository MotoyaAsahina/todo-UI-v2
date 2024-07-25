import ListTitle from '@/components/SideMenu/List/ListTitle'
import { Tag } from '@/lib/apis'

type TagListProps = {
  tags: { [key: number]: Tag }
}

export default function TagList(props: TagListProps) {
  return (
    <div className="my-2 ml-1">
      <ListTitle>Tags</ListTitle>

      <div className="pl-2 flex flex-wrap gap-2.5 gap-row-2">
        {Object.values(props.tags).map((tag) => (
          <div key={tag.id} className="flex gap-1">
            <div
              className="h-3.6 w-3.6 my-auto rounded-1 bg-gray-2"
              style={{ backgroundColor: tag.mainColor }}
            />
            <p className="text-xs font-400">{tag.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
