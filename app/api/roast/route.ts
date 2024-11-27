import { AppMsg } from '@/types/app-msg'
import { extractBody } from '@/utils/extract-body'
import { fetcher } from '@/utils/fetcher'
import { generateRoast } from '@/utils/generate-roast'

export interface CSRoast {
  url: string
  lang: string
  fileContent?: string
}

export async function POST(request: Request) {
  const { url, lang, fileContent }: CSRoast = await request.json()

  let bodyContent: string

  if (fileContent) {
    bodyContent = extractBody(fileContent)
  } else {
    const res = await fetcher(url)

    if (new URL(res.url).pathname === '/') {
      return Response.json({ data: '', errMsg: AppMsg.URL_IS_NOT_PUBLIC })
    }

    const html = await res.text()
    bodyContent = extractBody(html)
  }
  const generatedRoast = await generateRoast(bodyContent, lang)

  return Response.json({ data: generatedRoast, errMsg: '' })
}
