import { IconCheck } from '@tabler/icons-react'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'

type DropdownMenuProps = {
  items: { label: string; check?: boolean; onClick?: () => void }[]
  closeMenu: () => void
  menuIconRef?: React.RefObject<HTMLDivElement>
}

export default function DropdownMenu(props: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.addEventListener('click', (e) => {
      if (
        menuRef.current?.contains(e.target as Node) ||
        props.menuIconRef?.current?.contains(e.target as Node)
      )
        return
      props.closeMenu()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="w-36 flex mb-2 flex-col gap-1 p-1 rounded-1 bg-white b-1"
      ref={menuRef}
    >
      {props.items.map((item) =>
        item.label === '---' ? (
          <div key={item.label} className="ml-7 mr-1 b-0.5"></div>
        ) : (
          <div
            key={item.label}
            className="px-2 py-1 rounded-1 hover:bg-slate-100 cursor-pointer"
            onClick={() => {
              item.onClick!()
              props.closeMenu()
            }}
          >
            <div className="flex gap-2 items-center">
              <IconCheck
                size={14}
                className={clsx(!item.check && 'invisible')}
              />
              <p className="text-xs font-400">{item.label}</p>
            </div>
          </div>
        ),
      )}
    </div>
  )
}
