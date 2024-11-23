'use client'

import debounce from 'lodash.debounce'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useRef, useState, useTransition } from 'react'

import { submitCsRoastForm } from '@/app/action/submit-cs-roast-form'
import { AboutModal } from '@/app/components/AboutModal'
import { BuyMeACoffeeButton } from '@/app/components/BuyMeACoffeeButton'
import { RoastResult } from '@/app/components/RoastResult'
import styles from '@/app/page.module.scss'
import { Data } from '@/types/data'
import { ErrMsg } from '@/types/err-msg'
import { isCouchsurfingUrl } from '@/utils/is-couchsurfing-url'
import { langOptions } from '@/utils/lang-options'

import { submitCsRequestForm } from './action/submit-cs-req-form'

type Tabs = 'cs-roast' | 'cs-request'

export default function Home() {
  const [csRoast, setCsRoast] = useState<Data | null>(null)
  const [csRequest, setCsRequest] = useState<Data | null>(null)
  const [activeTab, setActiveTab] = useState<Tabs>('cs-roast')
  const [isRoastUrlValid, setIsRoastUrlValid] = useState<boolean | 'spelling'>('spelling')
  const [isGuestUrlValid, setIsGuestUrlValid] = useState<boolean | 'spelling'>('spelling')
  const [isHostUrlValid, setIsHostUrlValid] = useState<boolean | 'spelling'>('spelling')

  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const searchParams = useSearchParams()

  const inputCsRoastUrlRef = useRef<HTMLInputElement>(null)
  const inputCsGuestRef = useRef<HTMLInputElement>(null)
  const inputCsHostRef = useRef<HTMLInputElement>(null)

  const isCsRoastInputEmpty = !!inputCsRoastUrlRef?.current?.value
  const isCsGuestInputEmpty = !!inputCsGuestRef?.current?.value
  const isCsHostInputEmpty = !!inputCsHostRef?.current?.value

  useEffect(() => {
    const innerEffect = async () => {
      const url = searchParams.get('q')
      const lang = searchParams.get('lang')

      if (url?.length && !isCouchsurfingUrl(url)) {
        setCsRoast({ data: '', errMsg: ErrMsg.INVALID_URL })
        return
      }

      if (url?.length && inputCsRoastUrlRef.current) {
        inputCsRoastUrlRef.current.value = url
        const { data, errMsg } = await submitCsRoastForm(url, lang || undefined)
        setCsRoast({ data, errMsg })
      }
    }

    startTransition(async () => {
      innerEffect()
    })
  }, [searchParams])

  const openTab = (tabName: Tabs) => {
    setActiveTab(tabName)
  }

  const handleCreateCsRoastSubmit = async (formData: FormData) => {
    try {
      router.replace('/')

      const url = String(formData.get('url'))
      const lang = String(formData.get('lang'))

      startTransition(async () => {
        const { data, errMsg } = await submitCsRoastForm(url, lang)
        setCsRoast({ data, errMsg })
      })
    } catch (e) {
      setCsRoast({ data: '', errMsg: ErrMsg.ERROR_SUBMITTING_FORM })
    }
  }

  const handleCreateCsReqSubmit = async (formData: FormData) => {
    try {
      router.replace('/')

      const csGuest = String(formData.get('csGuest'))
      const csHost = String(formData.get('csHost'))
      const postcard = String(formData.get('postcard'))
      const chocolate = String(formData.get('chocolate'))
      const cooking = String(formData.get('cooking'))

      startTransition(async () => {
        const data = await submitCsRequestForm({ csGuest, csHost, postcard, chocolate, cooking })
        setCsRequest(data)
      })
    } catch (e) {
      setCsRequest({ data: '', errMsg: ErrMsg.ERROR_SUBMITTING_FORM })
    }
  }

  const validateUrl = debounce((url: string, setValidationState: React.Dispatch<React.SetStateAction<boolean | 'spelling'>>) => {
    setValidationState(url.trim().length ? isCouchsurfingUrl(url) : 'spelling')
  }, 500)

  const handleCsRoastUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    validateUrl(url, setIsRoastUrlValid)
  }

  const handleGuestUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    validateUrl(url, setIsGuestUrlValid)
  }

  const handleHostUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    validateUrl(url, setIsHostUrlValid)
  }

  const handleClearCsRoastUrlInput = () => {
    if (inputCsRoastUrlRef.current) {
      inputCsRoastUrlRef.current.value = ''
    }
    setCsRoast(null)
    setIsRoastUrlValid('spelling')
  }

  const handleClearUrlCSGuestInput = () => {
    if (inputCsGuestRef.current) {
      inputCsGuestRef.current.value = ''
    }
    setCsRequest(null)
    setIsGuestUrlValid('spelling')
  }

  const handleClearUrlCsHostInput = () => {
    if (inputCsHostRef.current) {
      inputCsHostRef.current.value = ''
    }
    setCsRequest(null)
    setIsHostUrlValid('spelling')
  }

  const isCsRoastDisabled = isPending || !isRoastUrlValid || isRoastUrlValid === 'spelling'
  const isCsRequestDisabled = isPending || !isGuestUrlValid || !isHostUrlValid || isGuestUrlValid === 'spelling' || isHostUrlValid === 'spelling'

  return (
    <main className={`${styles.main} container`}>
      <AboutModal />

      <div className='tabs'>
        <div className={styles.tabButtons}>
          <button className={`outline ${activeTab === 'cs-roast' ? '' : 'secondary'}`} onClick={() => openTab('cs-roast')}>
            Roast
          </button>
          <button className={`outline ${activeTab === 'cs-request' ? '' : 'secondary'}`} onClick={() => openTab('cs-request')}>
            Create CS Request
          </button>
        </div>

        <div className='tab-content'>
          {activeTab === 'cs-roast' && (
            <div id='roast'>
              <form name='form' action={handleCreateCsRoastSubmit}>
                <label htmlFor='url'>Paste a Couchsurfing profile URL:</label>
                <div className={styles.container}>
                  <input
                    type='url'
                    name='url'
                    placeholder='https://couchsurfing.com/people/herol3oy'
                    aria-label='url'
                    disabled={isPending}
                    ref={inputCsRoastUrlRef}
                    minLength={22}
                    maxLength={300}
                    required
                    aria-invalid={isRoastUrlValid === 'spelling' ? 'spelling' : !isRoastUrlValid ? 'true' : 'false'}
                    onChange={handleCsRoastUrlChange}
                    aria-describedby='valid-helper'
                  />
                  {!isRoastUrlValid && <small id='valid-helper'>{ErrMsg.INVALID_URL}</small>}

                  {isPending && <span aria-busy className={styles.spinner}></span>}

                  {isCsRoastInputEmpty && !isPending && (
                    <span className={styles.cross} onClick={handleClearCsRoastUrlInput}>
                      &#10799;
                    </span>
                  )}
                </div>

                <select name='lang' aria-label='Select a language' disabled={isCsRoastDisabled} required>
                  {langOptions.map(({ label, value }) => (
                    <option key={label} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button type='submit' aria-busy={isPending} disabled={isCsRoastDisabled}>
                  🔥 Roast
                </button>
              </form>
              {csRoast && (
                <>
                  <RoastResult result={csRoast} />
                  <BuyMeACoffeeButton />
                </>
              )}
            </div>
          )}

          {activeTab === 'cs-request' && (
            <section id='request'>
              <form name='requestForm' action={handleCreateCsReqSubmit}>
                <label htmlFor='url'>Paste your Couchsurfing profile URL:</label>
                <div className={styles.container}>
                  <input
                    type='url'
                    name='csGuest'
                    placeholder='https://couchsurfing.com/people/herol3oy'
                    aria-label='Guest URL'
                    disabled={isPending}
                    ref={inputCsGuestRef}
                    minLength={22}
                    maxLength={300}
                    required
                    aria-invalid={isGuestUrlValid === 'spelling' ? 'spelling' : !isGuestUrlValid ? 'true' : 'false'}
                    onChange={handleGuestUrlChange}
                    aria-describedby='guest-valid-helper'
                  />
                  {!isGuestUrlValid && <small id='valid-helper'>{ErrMsg.INVALID_URL}</small>}

                  {isPending && <span aria-busy className={styles.spinner}></span>}

                  {isCsGuestInputEmpty && !isPending && (
                    <span className={styles.cross} onClick={handleClearUrlCSGuestInput}>
                      &#10799;
                    </span>
                  )}
                </div>
                <label htmlFor='csHost'>Paste your future Couchsurfing host profile URL:</label>
                <div className={styles.container}>
                  <input
                    type='url'
                    name='csHost'
                    placeholder='https://couchsurfing.com/people/majidghyasi'
                    aria-label='Host URL'
                    disabled={isPending}
                    ref={inputCsHostRef}
                    minLength={22}
                    maxLength={300}
                    required
                    aria-invalid={isHostUrlValid === 'spelling' ? 'spelling' : !isHostUrlValid ? 'true' : 'false'}
                    onChange={handleHostUrlChange}
                    aria-describedby='host-valid-helper'
                  />
                  {!isHostUrlValid && <small id='valid-helper'>{ErrMsg.INVALID_URL}</small>}

                  {isPending && <span aria-busy className={styles.spinner}></span>}

                  {isCsHostInputEmpty && !isPending && (
                    <span className={styles.cross} onClick={handleClearUrlCsHostInput}>
                      &#10799;
                    </span>
                  )}
                </div>
                <fieldset>
                  <legend>What would you like to offer your host as a gesture of appreciation?</legend>
                  <label>
                    <input type='checkbox' name='postcard' />
                    💌 A postcard
                  </label>
                  <label>
                    <input type='checkbox' name='chocolate' />
                    🍫 Some chocolate
                  </label>
                  <label>
                    <input type='checkbox' name='cooking' />
                    🍝 A home-cooked meal
                  </label>
                </fieldset>
                <button type='submit' aria-busy={isPending} disabled={isCsRequestDisabled}>
                  ✨ Create Request
                </button>
              </form>
              {csRequest && (
                <>
                  <RoastResult result={csRequest} />
                  <BuyMeACoffeeButton />
                </>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
