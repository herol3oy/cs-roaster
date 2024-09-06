export const isCouchsurfingUrl = (url: string): boolean => {
  try {
    const { hostname, pathname, protocol } = new URL(url)

    const isValidPath = !!pathname.length && !/^\/+$/.test(pathname)

    const isCorrectDomain =
      hostname === 'couchsurfing.com' || hostname === 'www.couchsurfing.com'
    const isValidProtocol = protocol === 'http:' || protocol === 'https:'

    return isValidPath && isCorrectDomain && isValidProtocol
  } catch (e) {
    return false
  }
}
