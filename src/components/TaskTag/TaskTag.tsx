import { Tag } from '@/lib/apis'

type TaskTagProps = {
  tag: Tag
}

const pickBlackOrWhite = (color: string) => {
  if (!color) return '#1f2937'
  const colorStr = color.slice(-6)
  const r = parseInt(colorStr.slice(0, 2), 16)
  const g = parseInt(colorStr.slice(2, 4), 16)
  const b = parseInt(colorStr.slice(4, 6), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? '#1f2937' : '#ffffff'
}

export default function TaskTag(props: TaskTagProps) {
  return (
    <div
      className="w-fit h-4.3 px-1.8 rounded-2.2 b-1"
      style={{
        backgroundColor: props.tag.mainColor,
        borderColor: props.tag.borderColor || props.tag.mainColor,
        color: pickBlackOrWhite(props.tag.mainColor!),
      }}
    >
      <span className="text-xs block mb-1 leading-3.6">{props.tag.name}</span>
    </div>
  )
}
