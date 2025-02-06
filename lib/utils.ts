export function formatPostTime(date: string) {
  const splittedDate = date.split(' ')
  return splittedDate.at(0)?.concat(splittedDate.at(1)?.at(0) as string)
}
