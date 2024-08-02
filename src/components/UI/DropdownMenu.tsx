import { IconCheck } from '@tabler/icons-react'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

type DropdownMenuProps = {
  items: {
    label: string
    check?: boolean
    subItems?: { label: string; onClick: () => void }[]
    onClick?: () => void
  }[]
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
    document.body.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') props.closeMenu()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [hoveringIndex, setHoveringIndex] = useState<number | null>(null)

  return (
    <div
      className="w-36 flex mb-2 flex-col gap-1 p-1 rounded-1 bg-white b-1"
      ref={menuRef}
    >
      {props.items.map((item, index) =>
        item.label === '---' ? (
          <div key={item.label} className="ml-7 mr-1 b-0.5"></div>
        ) : (
          <div
            key={item.label}
            className="px-2 py-1 rounded-1 hover:bg-slate-100 cursor-pointer"
            onClick={() => {
              item.onClick?.()
              props.closeMenu()
            }}
            onMouseEnter={() => setHoveringIndex(index)}
            onMouseLeave={() => setHoveringIndex(null)}
          >
            <div className="flex gap-2 items-center relative">
              <p
                className={clsx(
                  'text-xs font-400 mr--1',
                  !item.subItems && 'invisible',
                  !props.items.some((item) => item.subItems) && 'hidden',
                )}
              >
                {'<'}
              </p>
              <IconCheck
                size={14}
                className={clsx(!item.check && 'invisible')}
              />
              <p className="text-xs font-400 flex-1">{item.label}</p>

              {/* Sub-items */}
              {/* NOTE: Since overflow-x and overflow-y cannot be set at the same time,
                        the menu is hidden when displayed on the left side */}
              <div
                className={clsx(
                  'absolute w-36 mb-2 flex-col gap-1 p-1 rounded-1 bg-white b-1 right-31 top--2 z-11',
                  item.subItems && hoveringIndex === index ? 'flex' : 'hidden',
                )}
              >
                {item.subItems?.map((subItem) => (
                  <div
                    key={subItem.label}
                    className="px-3 py-1 rounded-1 hover:bg-slate-100 cursor-pointer"
                    onClick={() => {
                      subItem.onClick()
                      props.closeMenu()
                    }}
                  >
                    <p className="text-xs font-400">{subItem.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  )
}
