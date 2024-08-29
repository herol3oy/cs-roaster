export const fetcher = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    redirect: 'follow',
  })

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }

  return res
}
