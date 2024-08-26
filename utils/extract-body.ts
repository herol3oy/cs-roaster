export const extractBody = (html: string): string => {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  let bodyContent = bodyMatch ? bodyMatch[1] : ''

  return bodyContent
    .replace(/<(script|noscript|header|footer)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/(?:\s|^)class="[^"]*"/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
