'use server'

import { Data } from '@/types/data'
import { ErrMsg } from '@/types/err-msg'
import { fetcher } from '@/utils/fetcher'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const submitCsRoastForm = async (url: string, lang?: string, fileContent?: string): Promise<Data> => {
  try {
    const res = await fetcher(`${BASE_URL}/api/roast`, {
      method: 'POST',
      body: JSON.stringify({ url, lang, fileContent }),
    })

    return await res.json()
  } catch (e) {
    return { data: '', errMsg: ErrMsg.URL_DOES_NOT_EXIST }
  }
}
