const title = '云端'

export default function getPageTitle (pageTitle: string | undefined): string {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
