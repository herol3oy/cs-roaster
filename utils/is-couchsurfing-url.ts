export const isCouchsurfingUrl = (url: string): boolean => {
  try {
    const { hostname, pathname } = new URL(url)

    const isValidPath = !!pathname.length && !/^\/+$/.test(pathname)

    return hostname.endsWith('couchsurfing.com') && isValidPath
  } catch (e) {
    return false
  }
}
