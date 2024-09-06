import { Roast } from '@/types/roast'

export function RoastResult({ result }: { result: Roast }) {
  return (
    <article
      className={result.errMsg ? 'pico-background-red-600' : ''}
      dir='auto'
    >
      {result.data || result.errMsg}
    </article>
  )
}
