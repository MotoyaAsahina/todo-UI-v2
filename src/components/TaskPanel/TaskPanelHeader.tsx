import { IconDotsVertical, IconPlus } from '@tabler/icons-react'
import clsx from 'clsx'
import { useRef, useState } from 'react'

import DropdownMenu from '@/components/UI/DropdownMenu'
import IconBase from '@/components/UI/IconBase'
import { Group } from '@/lib/apis'

type TaskPanelHeaderProps = {
  group: Group
  taskLength: number
  onClickAddTask: () => void
  state: {
    isHoveringHeader: boolean
    isAddingTask: boolean
    isClassified: boolean
    setIsClassified: (isClassified: boolean) => void
  }
}

export default function TaskPanelHeader(props: TaskPanelHeaderProps) {
  const menuIconRef = useRef<HTMLDivElement>(null)
  const [isMenuOpened, setIsMenuOpened] = useState(false)

  const handleMenuOpen = () => {
    setIsMenuOpened(!isMenuOpened)
  }

  const dropdownMenuItems = [
    { label: 'Default Order', onClick: () => {} },
    { label: 'Manual Order', onClick: () => {} },
    { label: '---' },
    {
      label: 'Classify',
      check: props.state.isClassified,
      onClick: () => {
        props.state.setIsClassified(!props.state.isClassified)
      },
    },
    { label: 'Show Done', onClick: () => {} },
  ]

  return (
    <div className="h-10 flex gap-2 items-center">
      {/* Task length */}
      <span className="h-5.2 leading-5 px-1.8 bg-slate-200 text-sm rounded-3">
        {props.taskLength}
      </span>

      {/* Group name */}
      <div className="flex-1">
        <p className="h-5.4 leading-5 font-500">{props.group.name}</p>
      </div>

      {/* Icons */}
      <div
        className={clsx(
          'flex gap-0.6 relative',
          !props.state.isHoveringHeader &&
            !props.state.isAddingTask &&
            !isMenuOpened &&
            'invisible',
        )}
      >
        <IconBase onClick={props.onClickAddTask}>
          <IconPlus size={16} />
        </IconBase>
        <IconBase onClick={handleMenuOpen} ref={menuIconRef}>
          <IconDotsVertical size={16} />
        </IconBase>

        <div
          className={clsx(
            'absolute right-0 top-6 z-10',
            !isMenuOpened && 'hidden',
          )}
        >
          <DropdownMenu
            items={dropdownMenuItems}
            closeMenu={() => setIsMenuOpened(false)}
            menuIconRef={menuIconRef}
          />
        </div>
      </div>
    </div>
  )
}
