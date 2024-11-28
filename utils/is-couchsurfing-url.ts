export const isCouchsurfingUrl = (url: string): boolean => {
  try {
    const { hostname, pathname, protocol } = new URL(url)

    const isValidPath = !!pathname.length && !/^\/+$/.test(pathname)

    const isValidProfilePath =
      /^\/users\/\d+\/?$/.test(pathname) ||
      /^\/people\/[a-zA-Z0-9.-]+\/?$/.test(pathname) ||
      /^\/[a-zA-Z][a-zA-Z0-9.-]*\/?$/.test(pathname) ||
      /^\/0\/?$/.test(pathname) ||
      /^\/[1-9]\d*\/?$/.test(pathname) ||
      /^\/0[a-zA-Z0-9.-]*\/?$/.test(pathname)

    const isCorrectDomain = hostname === 'couchsurfing.com' || hostname === 'www.couchsurfing.com'
    const isValidProtocol = protocol === 'http:' || protocol === 'https:'

    return isValidPath && isCorrectDomain && isValidProtocol && isValidProfilePath
  } catch (e) {
    return false
  }
}
