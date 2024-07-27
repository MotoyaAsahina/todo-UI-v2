export const selectStamp = (dueDate?: string | null): string => {
  if (!dueDate) return ''
  const aDay = 24 * 60 * 60 * 1000
  const leftTime = new Date(dueDate).getTime() - Date.now()
  if (leftTime < aDay * -7) {
    return '❄️'
  } else if (leftTime < 0) {
    return '💥'
  } else if (leftTime < aDay) {
    return '🚨'
  } else if (leftTime < aDay * 2) {
    return '🔥'
  } else if (leftTime < aDay * 4) {
    return '🚀'
  } else if (leftTime < aDay * 7) {
    return '🍋'
  } else if (leftTime < aDay * 14) {
    return '🍏'
  } else {
    return '☂️'
  }
}
