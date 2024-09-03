'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

import { submitForm } from '@/app/action/submit-form'
import { AboutModal } from '@/app/components/AboutModal'
import styles from '@/app/page.module.scss'
import { ErrMsg } from '@/types/err-msg'
import { Roast } from '@/types/roast'
import { isCouchsurfingUrl } from '@/utils/is-couchsurfing-url'
import { langOptions } from '@/utils/lang-options'

export default function Home() {
  const [result, setResult] = useState<Roast>()
  const [isPending, startTransition] = useTransition()

  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const innerEffect = async () => {
      const url = searchParams.get('q')
      const lang = searchParams.get('lang')

      if (url?.length && !isCouchsurfingUrl(url)) {
        setResult({ data: '', msg: ErrMsg.INVALID_URL })
        return
      }

      if (url?.length && inputRef.current) {
        inputRef.current.value = url
        const { data, msg } = await submitForm(url, lang || undefined)
        setResult({ data, msg })
      }
    }

    startTransition(async () => {
      innerEffect()
    })
  }, [searchParams])

  const handleSubmit = async (formData: FormData) => {
    try {
      router.replace('/')

      const url = String(formData.get('url'))
      const lang = String(formData.get('lang'))

      if (!isCouchsurfingUrl(url)) {
        setResult({ data: '', msg: ErrMsg.INVALID_URL })
        return
      }

      startTransition(async () => {
        const { data, msg } = await submitForm(url, lang)
        setResult({ data, msg })
      })
    } catch (e) {
      setResult({ data: '', msg: ErrMsg.ERROR_SUBMITTING_FORM })
    }
  }

  return (
    <main className={`${styles.main} container`}>
      <AboutModal />
      <form action={handleSubmit}>
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
      {result && (
        <article
          className={
            result.msg ? 'pico-background-red-600' : 'pico-color-grey-200'
          }
          dir='auto'
        >
          {result.data || result.msg}
        </article>
      )}
    </main>
  )
}
