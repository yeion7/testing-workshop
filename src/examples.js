export const kebab = (string) => {
  return string.replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/\s+/g, '-')
      .toLowerCase()
}

export const countWords = (paragraph) => {
  return paragraph
    .normalize("NFD")
    .replace(/[^a-zA-Z ]/g, '')
    .toLowerCase()
    .split(' ')
    .reduce((count, word) => {
      count[word] = (count[word] || 0) + 1
      return count
    }, {})
}