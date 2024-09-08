import debounce from 'lodash.debounce'
import { useRouter } from 'next/navigation'
import {
  ChangeEvent,
  Dispatch,
  RefObject,
  SetStateAction,
  TransitionStartFunction,
  useMemo,
  useState,
} from 'react'

import { submitForm } from '@/app/action/submit-form'
import { ErrMsg } from '@/types/err-msg'
import { Roast } from '@/types/roast'
import { isCouchsurfingUrl } from '@/utils/is-couchsurfing-url'
import { langOptions } from '@/utils/lang-options'

import styles from './roast-form.module.scss'

interface RoastFormProps {
  setResult: Dispatch<SetStateAction<Roast | null>>
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
  const [isUrlValid, setIsUrlValid] = useState<boolean | 'spelling'>('spelling')

  const router = useRouter()

  const isInputEmpty = !!inputRef?.current?.value

  const handleSubmit = async (formData: FormData) => {
    try {
      router.replace('/')

      const url = String(formData.get('url'))
      const lang = String(formData.get('lang'))

      startTransition(async () => {
        const { data, errMsg } = await submitForm(url, lang)
        setResult({ data, errMsg })
      })
    } catch (e) {
      setResult({ data: '', errMsg: ErrMsg.ERROR_SUBMITTING_FORM })
    }
  }

  const validateUrl = useMemo(
    () =>
      debounce((url: string) => {
        setIsUrlValid(url.trim().length ? isCouchsurfingUrl(url) : 'spelling')
      }, 500),
    [],
  )

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    validateUrl(url)
  }

  const handleClearUrlInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    setResult(null)
    setIsUrlValid('spelling')
  }

  const isDisabled = isPending || !isUrlValid || isUrlValid === 'spelling'

  return (
    <form name='form' action={handleSubmit}>
      <label htmlFor='url'>Paste a Couchsurfing profile URL:</label>
      <div className={styles.container}>
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
          aria-invalid={
            isUrlValid === 'spelling'
              ? 'spelling'
              : !isUrlValid
                ? 'true'
                : 'false'
          }
          onChange={handleUrlChange}
          aria-describedby='valid-helper'
        />
        {!isUrlValid && <small id='valid-helper'>{ErrMsg.INVALID_URL}</small>}

        {isPending && <span aria-busy className={styles.spinner}></span>}

        {isInputEmpty && !isPending && (
          <span className={styles.cross} onClick={handleClearUrlInput}>
            &#10799;
          </span>
        )}
      </div>

      <select
        name='lang'
        aria-label='Select a language'
        disabled={isDisabled}
        required
      >
        {langOptions.map(({ label, value }) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
      <button type='submit' aria-busy={isPending} disabled={isDisabled}>
        🔥 Roast
      </button>
    </form>
  )
}
