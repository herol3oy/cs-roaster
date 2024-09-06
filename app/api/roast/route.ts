import { ErrMsg } from '@/types/err-msg'
import { Roast } from '@/types/roast'
import { extractBody } from '@/utils/extract-body'
import { fetcher } from '@/utils/fetcher'
import { generateRoast } from '@/utils/generate-roast'

export async function POST(request: Request) {
  const { url, lang } = await request.json()

  const res = await fetcher(url)

  if (new URL(res.url).pathname === '/') {
    return Response.json({ data: '', errMsg: ErrMsg.URL_IS_NOT_PUBLIC })
  }

  const html = await res.text()
  const bodyContent = extractBody(html)
  const generatedRoast = await generateRoast(bodyContent, lang)

  return Response.json({ data: generatedRoast, errMsg: '' })
}
