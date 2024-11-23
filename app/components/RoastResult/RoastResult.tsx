import { Data } from '@/types/data'

export function RoastResult({ result }: { result: Data }) {
  return (
    <article className={result.errMsg ? 'pico-background-red-600' : ''} dir='auto'>
      {result.data || result.errMsg}
    </article>
  )
}
