import { AppMsg } from '@/types/app-msg'
import { extractBody } from '@/utils/extract-body'
import { fetcher } from '@/utils/fetcher'
import { generateRoast } from '@/utils/generate-roast'

export interface CSRequest {
  csGuest: string
  csHost: string
  postcard: string
  chocolate: string
  cooking: string
  fileContent?: string
}

export async function POST(request: Request) {
  const { csGuest: url1, csHost: url2, postcard, chocolate, cooking, fileContent }: CSRequest = await request.json()

  let bodyContent2: string

  if (fileContent) {
    bodyContent2 = extractBody(fileContent)
  } else {
    const res2 = await fetcher(url2)

    if (new URL(res2.url).pathname === '/') {
      return Response.json({ data: '', errMsg: AppMsg.URL_IS_NOT_PUBLIC })
    }

    const html2 = await res2.text()
    bodyContent2 = extractBody(html2)
  }

  const res1 = await fetcher(url1)

  if (new URL(res1.url).pathname === '/') {
    return Response.json({ data: '', errMsg: AppMsg.URL_IS_NOT_PUBLIC })
  }

  const html1 = await res1.text()
  const bodyContent1 = extractBody(html1)

  const combinedContent = `${bodyContent1}\n\n${bodyContent2}`
  const generatedRoast = await generateRoast(combinedContent, undefined, true, postcard, chocolate, cooking)

  return Response.json({ data: generatedRoast, errMsg: '' })
}
