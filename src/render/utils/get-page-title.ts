const title = '质量检测系统'

export default function getPageTitle (pageTitle: string | undefined): string {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
