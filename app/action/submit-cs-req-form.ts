'use server'

import { AppMsg } from '@/types/app-msg'
import { fetcher } from '@/utils/fetcher'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const submitCsRequestForm = async ({
  csGuest,
  csHost,
  postcard,
  chocolate,
  cooking,
}: {
  csGuest: string
  csHost: string
  postcard: string
  chocolate: string
  cooking: string
}) => {
  try {
    const res = await fetcher(`${BASE_URL}/api/csRequest`, {
      method: 'POST',
      body: JSON.stringify({ csGuest, csHost, postcard, chocolate, cooking }),
    })

    return await res.json()
  } catch (e) {
    return { data: '', errMsg: AppMsg.URL_DOES_NOT_EXIST }
  }
}
