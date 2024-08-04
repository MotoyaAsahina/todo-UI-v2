const formatDueDate = (d?: string | null) => {
  if (!d) return ''
  const date = new Date(d)
  const year =
    date.getFullYear() !== new Date().getFullYear()
      ? `${date.getFullYear()}/`
      : ''
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDay = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
  const hour = ('00' + date.getHours()).slice(-2)
  const minute = ('00' + date.getMinutes()).slice(-2)
  return `${year}${month}/${day}(${weekDay}) ${hour}:${minute}`
}

const surroundURL = (title?: string) => (url: string) => {
  const style = 'overflow-wrap: break-word; color: #135fab'
  const rel = 'noopener noreferrer'
  return `<a style="${style}" href="${url}" target="_blank" rel="${rel}">${title ?? url}</a>`
}

const makeURL = (text: string) => {
  const mdReplacedText = text.replace(
    /\[(.*?)\]\((https?:\/\/.*?)\)/g,
    (_, title, url) => surroundURL(title)(url),
  )
  // return mdReplacedText
  return mdReplacedText.replace(/(https?:\/\/[^\s]+)/g, (_, url) => {
    if (mdReplacedText.includes(`href="${url}`)) return url
    return surroundURL()(url)
  })
}

const makeBR = (text: string) => {
  return text.replace(/\n/g, '<br>')
}

export { formatDueDate, makeURL, makeBR }
