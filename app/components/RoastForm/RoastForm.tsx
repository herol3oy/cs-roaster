import { useRouter } from 'next/navigation'
import { RefObject, TransitionStartFunction } from 'react'

import { submitForm } from '@/app/action/submit-form'
import { ErrMsg } from '@/types/err-msg'
import { Roast } from '@/types/roast'
import { isCouchsurfingUrl } from '@/utils/is-couchsurfing-url'
import { langOptions } from '@/utils/lang-options'

interface RoastFormProps {
  setResult: (result: Roast) => void
  startTransition: TransitionStartFunction
  isPending: boolean
  inputRef: RefObject<HTMLInputElement>
}

export function RoastForm({
  setResult,
  startTransition,
  isPending,
  inputRef,
}: RoastFormProps) {
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    try {
      router.replace('/')

      const url = String(formData.get('url'))
      const lang = String(formData.get('lang'))

      if (!isCouchsurfingUrl(url)) {
        setResult({ data: '', errMsg: ErrMsg.INVALID_URL })
        return
      }

      startTransition(async () => {
        const { data, errMsg } = await submitForm(url, lang)
        setResult({ data, errMsg })
      })
    } catch (e) {
      setResult({ data: '', errMsg: ErrMsg.ERROR_SUBMITTING_FORM })
    }
  }

  return (
    <form name='form' action={handleSubmit}>
      <label htmlFor='url'>Paste a Couchsurfing profile URL:</label>
      <input
        type='url'
        name='url'
        placeholder='https://couchsurfing.com/people/herol3oy'
        aria-label='url'
        disabled={isPending}
        ref={inputRef}
        minLength={22}
        maxLength={300}
        required
      />
      <select
        name='lang'
        aria-label='Select a language'
        disabled={isPending}
        required
      >
        {langOptions.map(({ label, value }) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
      <button type='submit' aria-busy={isPending} disabled={isPending}>
        🔥 Roast
      </button>
    </form>
  )
}
