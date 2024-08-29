import { extractBody } from '@/utils/extract-body'
import { fetcher } from '@/utils/fetcher'
import { generateRoast } from '@/utils/generate-roast'

export async function POST(request: Request) {
  const { url, language } = await request.json()

  try {
    const res = await fetcher(url)

    if (new URL(res.url).pathname === '/') {
      return Response.json('This URL is not public.')
    }

    const html = await res.text()
    const bodyContent = extractBody(html)
    const generatedRoast = await generateRoast(bodyContent, language)

    return Response.json(generatedRoast)
  } catch (error) {
    console.error(error)
    return Response.json('Error fetching the URL', { status: 500 })
  }
}
