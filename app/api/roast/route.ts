import { DisplayMessage } from '@/types/display-message'
import { extractBody } from '@/utils/extract-body'
import { fetcher } from '@/utils/fetcher'
import { generateRoast } from '@/utils/generate-roast'

export async function POST(request: Request) {
  const { url, language } = await request.json()

  try {
    const res = await fetcher(url)

    if (new URL(res.url).pathname === '/') {
      return Response.json(DisplayMessage.URL_IS_NOT_PUBLIC)
    }

    const html = await res.text()
    const bodyContent = extractBody(html)
    const generatedRoast = await generateRoast(bodyContent, language)

    return Response.json(generatedRoast)
  } catch {
    return Response.json(DisplayMessage.ERROR_FETCHING_URL)
  }
}
