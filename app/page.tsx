'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

import { submitForm } from '@/app/action/submit-form'
import { AboutModal } from '@/app/components/AboutModal'
import { RoastForm } from '@/app/components/RoastForm'
import { RoastResult } from '@/app/components/RoastResult'
import styles from '@/app/page.module.scss'
import { ErrMsg } from '@/types/err-msg'
import { Roast } from '@/types/roast'
import { isCouchsurfingUrl } from '@/utils/is-couchsurfing-url'

export default function Home() {
  const [result, setResult] = useState<Roast | null>(null)
  const [isPending, startTransition] = useTransition()

  const inputRef = useRef<HTMLInputElement>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    const innerEffect = async () => {
      const url = searchParams.get('q')
      const lang = searchParams.get('lang')

      if (url?.length && !isCouchsurfingUrl(url)) {
        setResult({ data: '', errMsg: ErrMsg.INVALID_URL })
        return
      }

      if (url?.length && inputRef.current) {
        inputRef.current.value = url
        const { data, errMsg } = await submitForm(url, lang || undefined)
        setResult({ data, errMsg })
      }
    }

    startTransition(async () => {
      innerEffect()
    })
  }, [searchParams])

  return (
    <main className={`${styles.main} container`}>
      <AboutModal />
      <RoastForm
        setResult={setResult}
        startTransition={startTransition}
        isPending={isPending}
        inputRef={inputRef}
      />
      {result && <RoastResult result={result} />}
    </main>
  )
}
