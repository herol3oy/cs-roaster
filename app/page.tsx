'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

import { submitForm } from '@/app/action/submit-form'
import { AboutModal } from '@/app/components/AboutModal'
import styles from '@/app/page.module.css'
import { DisplayMessage } from '@/types/display-message'
import { isCouchsurfingUrl } from '@/utils/is-couchsurfing-url'
import { languageOptions } from '@/utils/languages'

export default function Home() {
  const [result, setResult] = useState('')
  const [isPending, startTransition] = useTransition()

  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const innerEffect = async () => {
      const csProfileUrl = searchParams.get('q')
      const language = searchParams.get('lang')

      if (csProfileUrl?.length && !isCouchsurfingUrl(csProfileUrl)) {
        return setResult(DisplayMessage.URL_IS_INVALID)
      }

      if (csProfileUrl?.length && inputRef.current) {
        inputRef.current.value = csProfileUrl
        const roast = await submitForm(csProfileUrl, language || undefined)
        setResult(roast)
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
      const language = String(formData.get('language'))

      if (!isCouchsurfingUrl(url)) {
        return setResult(DisplayMessage.URL_IS_INVALID)
      }

      startTransition(async () => {
        const roast = await submitForm(url, language)
        setResult(roast)
      })
    } catch {
      setResult(DisplayMessage.ERROR_SUBMITTING_FORM)
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
          name='language'
          aria-label='Select a language'
          disabled={isPending}
          required
        >
          {languageOptions.map((language) => (
            <option key={language.label} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>
        <button type='submit' aria-busy={isPending} disabled={isPending}>
          Roast
        </button>
      </form>
      {!isPending && result && <article dir='auto'>{result}</article>}
    </main>
  )
}
