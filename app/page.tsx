'use client'

import debounce from 'lodash.debounce'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState, useTransition } from 'react'

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
  const [isNonPublic, setIsNonPublic] = useState<boolean>(false)
  const [isWebpageFileValid, setIsWebpageFileValid] = useState<boolean | 'spelling'>('spelling')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const searchParams = useSearchParams()

  const inputCsRoastUrlRef = useRef<HTMLInputElement>(null)
  const inputCsGuestRef = useRef<HTMLInputElement>(null)
  const inputCsHostRef = useRef<HTMLInputElement>(null)
  const inputCsRoastFileRef = useRef<HTMLInputElement>(null)

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
      await innerEffect()
    })
  }, [searchParams])

  const openTab = (tabName: Tabs) => {
    setActiveTab(tabName)
    setCsRoast(null)
    setCsRequest(null)
    setIsWebpageFileValid('spelling')
    setIsRoastUrlValid('spelling')
    setIsGuestUrlValid('spelling')
    setIsHostUrlValid('spelling')
    setIsNonPublic(false)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      const allowedTypes = ['text/html', 'application/html', 'text/mhtml', 'application/mhtml', '.html', '.htm', '.mhtml']
      const maxFileSize = 1024 * 1024

      if (!allowedTypes.some((type) => file.type.includes(type) || file.name.endsWith(type.slice(1)))) {
        setSelectedFile(null)
        setIsWebpageFileValid(false)
        return
      }

      if (file.size > maxFileSize) {
        setSelectedFile(null)
        setIsWebpageFileValid(false)
        return
      }

      const reader = new FileReader()

      reader.onload = (e) => {
        const fileContent = e.target?.result as string
        if (/@Couchsurfing/.test(fileContent)) {
          setSelectedFile(file)
          setCsRoast(null)
          setIsWebpageFileValid(true)
        } else {
          setSelectedFile(null)
          setIsWebpageFileValid(false)
        }
      }

      reader.readAsText(file)
    }
  }

  const handleCreateCsRoastSubmit = async (formData: FormData) => {
    try {
      router.replace('/')

      const url = String(formData.get('url'))
      const lang = String(formData.get('lang'))

      let fileContent: string | undefined

      if (isNonPublic && selectedFile) {
        fileContent = await selectedFile.text()
      }

      startTransition(async () => {
        const { data, errMsg } = await submitCsRoastForm(url, lang, fileContent)
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

  const validateUrl = debounce((url: string, setValidationState: Dispatch<SetStateAction<boolean | 'spelling'>>) => {
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

  const handleNonPublicChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsNonPublic(e.target.checked)
    setCsRoast(null)
    setIsWebpageFileValid('spelling')
    setIsRoastUrlValid('spelling')
  }

  const isCsRoastDisabled =
    isPending ||
    (!isNonPublic && (!isRoastUrlValid || isRoastUrlValid === 'spelling')) ||
    (isNonPublic && (!isWebpageFileValid || isWebpageFileValid === 'spelling'))
  const isCsRequestDisabled = isPending || !isGuestUrlValid || !isHostUrlValid || isGuestUrlValid === 'spelling' || isHostUrlValid === 'spelling'
  return (
    <main className={`${styles.main} container`}>
      <AboutModal />

      <div className='tabs'>
        <div role='group'>
          <button className={`${activeTab === 'cs-roast' ? '' : 'secondary'}`} onClick={() => openTab('cs-roast')}>
            🔥 Roast Couchsurfer
          </button>
          <button className={`${activeTab === 'cs-request' ? '' : 'secondary'}`} onClick={() => openTab('cs-request')}>
            ✨ Create CS Request
          </button>
        </div>

        <div className='tab-content'>
          {activeTab === 'cs-roast' && (
            <div id='roast'>
              <form name='form' action={handleCreateCsRoastSubmit}>
                <div className={styles.container}>
                  {isNonPublic ? (
                    <>
                      <input
                        type='file'
                        name='profile-webpage'
                        accept='.html,.htm,.mhtml,text/html,text/mhtml'
                        onChange={handleFileChange}
                        ref={inputCsRoastFileRef}
                        required
                        aria-invalid={isWebpageFileValid === 'spelling' ? 'spelling' : !isWebpageFileValid ? 'true' : 'false'}
                        aria-describedby='valid-helper'
                      />
                      {!isWebpageFileValid && <small id='valid-helper'>{ErrMsg.INVALID_WEBPAGE}</small>}
                      <cite>
                        <p>Navigate to the profile page and save it (using Ctrl+S or ⌘+S), then upload it here 👆</p>
                      </cite>
                    </>
                  ) : (
                    <>
                      <label htmlFor='url'>Paste a Couchsurfing profile URL:</label>
                      <div className={styles.container}>
                        {isCsRoastInputEmpty && !isPending && (
                          <span className={styles.cross} onClick={handleClearCsRoastUrlInput}>
                            &#10799;
                          </span>
                        )}
                        <input
                          type='url'
                          name='url'
                          placeholder='https://couchsurfing.com/herol3oy'
                          aria-label='url'
                          disabled={isPending || isNonPublic}
                          ref={inputCsRoastUrlRef}
                          minLength={22}
                          maxLength={300}
                          required
                          aria-invalid={isRoastUrlValid === 'spelling' ? 'spelling' : !isRoastUrlValid ? 'true' : 'false'}
                          onChange={handleCsRoastUrlChange}
                          aria-describedby='valid-helper'
                        />
                        {!isRoastUrlValid && <small id='valid-helper'>{ErrMsg.INVALID_URL}</small>}
                      </div>
                    </>
                  )}
                  <fieldset>
                    <label>
                      <input name='nonpublic' type='checkbox' role='switch' onChange={handleNonPublicChange} />
                      The Couchsurfing profile is nonpublic 🔒
                    </label>
                  </fieldset>

                  {isPending && <span aria-busy className={styles.spinner}></span>}
                </div>

                <select name='lang' aria-label='Select a language' disabled={isCsRoastDisabled} required>
                  {langOptions.map(({ label, value }) => (
                    <option key={label} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button className='outline' type='submit' aria-busy={isPending} disabled={isCsRoastDisabled}>
                  Roast
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
                    placeholder='https://couchsurfing.com/herol3oy'
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
                    placeholder='https://couchsurfing.com/casey'
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
                <button className='outline' type='submit' aria-busy={isPending} disabled={isCsRequestDisabled}>
                  Create Request
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
