'use server'

import { fetcher } from '@/utils/fetcher'

export const submitForm = async (url: string, language?: string) => {
  try {
    const res = await fetcher(`${process.env.NEXT_PUBLIC_BASE_URL}/api/roast`, {
      method: 'POST',
      body: JSON.stringify({ url, language }),
    })

    return await res.json()
  } catch (err) {
    console.error(err)
    return 'This URL does not exist!'
  }
}
