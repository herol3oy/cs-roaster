import { ErrMsg } from '@/types/err-msg'
import { extractBody } from '@/utils/extract-body'
import { fetcher } from '@/utils/fetcher'
import { generateRoast } from '@/utils/generate-roast'

export interface CSRequest {
  csGuest: string
  csHost: string
  postcard: string
  chocolate: string
  cooking: string
}

export async function POST(request: Request) {
  const { csGuest: url1, csHost: url2, postcard, chocolate, cooking }: CSRequest = await request.json()

  const [res1, res2] = await Promise.all([fetcher(url1), fetcher(url2)])

  if ([res1, res2].some((response) => new URL(response.url).pathname === '/')) {
    return Response.json({ data: '', errMsg: ErrMsg.URL_IS_NOT_PUBLIC })
  }

  const html1 = await res1.text()
  const html2 = await res2.text()
  const bodyContent1 = extractBody(html1)
  const bodyContent2 = extractBody(html2)

  const combinedContent = `${bodyContent1}\n\n${bodyContent2}`
  const generatedRoast = await generateRoast(combinedContent, undefined, true, postcard, chocolate, cooking)

  return Response.json({ data: generatedRoast, errMsg: '' })
}
