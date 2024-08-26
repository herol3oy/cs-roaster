'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

import { submitForm } from '@/app/actions'
import AboutModal from '@/app/components/AboutModal'
import styles from '@/app/page.module.css'
import { isCouchsurfingUrl } from '@/utils/is-couchsurfing-url'
import { languageOptions } from '@/utils/languages'

export default function Home() {
  const [result, setResult] = useState('')
  const [isLoading, startTransition] = useTransition()

  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const innerEffect = async () => {
      const couchsurfingUrl = searchParams.get('cs')
      const language = searchParams.get('lang')

      if (
        couchsurfingUrl?.length &&
        !isCouchsurfingUrl(String(couchsurfingUrl))
      ) {
        return setResult('Please submit a valid couchsurfing.com URL.')
      }

      if (couchsurfingUrl?.length && inputRef.current) {
        inputRef.current.value = couchsurfingUrl
        const roast = await submitForm(couchsurfingUrl, language || undefined)
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
        return setResult('Please submit a valid couchsurfing.com URL.')
      }

      startTransition(async () => {
        const data = await submitForm(url, language)
        setResult(data)
      })
    } catch (error) {
      console.error('Error submitting form:', error)
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
          placeholder='https://couchsurfing.com/people/casey'
          aria-label='url'
          disabled={isLoading}
          ref={inputRef}
          minLength={22}
          maxLength={300}
          required
        />
        <select
          name='language'
          aria-label='Select a language'
          disabled={isLoading}
          required
        >
          {languageOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type='submit' aria-busy={isLoading} disabled={isLoading}>
          Roast
        </button>
      </form>
      {!isLoading && result && <article dir='auto'>{result}</article>}
    </main>
  )
}
