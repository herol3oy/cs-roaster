'use server'

import { DisplayMessage } from '@/types/display-message'
import { fetcher } from '@/utils/fetcher'

export const submitForm = async (
  url: string,
  language?: string,
): Promise<string> => {
  try {
    const res = await fetcher(`${process.env.NEXT_PUBLIC_BASE_URL}/api/roast`, {
      method: 'POST',
      body: JSON.stringify({ url, language }),
    })

    return await res.json()
  } catch (error) {
    return DisplayMessage.URL_NOT_EXIST
  }
}
