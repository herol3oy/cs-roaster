import { extractBody } from '@/utils/extract-body'
import { generateRoast } from '@/utils/generate-roast'

export async function POST(request: Request) {
  const { url, language } = await request.json()

  const res = await fetch(url, { redirect: 'follow' })

  if (new URL(res.url).pathname === '/') {
    return Response.json('This URL is not public.')
  }

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }

  const html = await res.text()
  const bodyContent = extractBody(html)
  const generatedRoast = await generateRoast(bodyContent, language)

  return Response.json(generatedRoast)
}