'use server'

export const submitForm = async (url: string, language?: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/roast`, {
      method: 'POST',
      body: JSON.stringify({ url, language }),
    })

    if (!res.ok) {
      throw new Error('Network response was not OK!')
    }

    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
    return 'This URL does not exist!'
  }
}
