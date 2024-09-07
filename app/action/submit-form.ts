'use server'

import { ErrMsg } from '@/types/err-msg'
import { Roast } from '@/types/roast'
import { fetcher } from '@/utils/fetcher'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const submitForm = async (
  url: string,
  lang?: string,
): Promise<Roast> => {
  try {
    const res = await fetcher(`${BASE_URL}/api/roast`, {
      method: 'POST',
      body: JSON.stringify({ url, lang }),
    })

    return await res.json()
  } catch (e) {
    return { data: '', errMsg: ErrMsg.URL_DOES_NOT_EXIST }
  }
}
