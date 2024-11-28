'use client'

import debounce from 'lodash.debounce'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState, useTransition } from 'react'

import { submitCsRoastForm } from '@/app/action/submit-cs-roast-form'
import { AboutModal } from '@/app/components/AboutModal'
import { BuyMeACoffeeButton } from '@/app/components/BuyMeACoffeeButton'
import { RoastResult } from '@/app/components/RoastResult'
import styles from '@/app/page.module.scss'
import { AppMsg } from '@/types/app-msg'
import { Data } from '@/types/data'
import { Tabs } from '@/types/tabs'
import { isCouchsurfingUrl } from '@/utils/is-couchsurfing-url'
import { langOptions } from '@/utils/lang-options'

import { submitCsRequestForm } from './action/submit-cs-req-form'

export default function Home() {
  const [csRoast, setCsRoast] = useState<Data | null>(null)
  const [csRequest, setCsRequest] = useState<Data | null>(null)
  const [activeTab, setActiveTab] = useState<Tabs>('cs-roast')
  const [isRoastUrlValid, setIsRoastUrlValid] = useState<boolean | 'spelling'>('spelling')
  const [isGuestUrlValid, setIsGuestUrlValid] = useState<boolean | 'spelling'>('spelling')
  const [isHostUrlValid, setIsHostUrlValid] = useState<boolean | 'spelling'>('spelling')
  const [isNonPublic, setIsNonPublic] = useState<boolean>(false)
  const [isCsHostNonPublic, setIsCsHostNonPublic] = useState<boolean>(false)
  const [isWebpageFileValid, setIsWebpageFileValid] = useState<boolean | 'spelling'>('spelling')
  const [isCsHostWebpageFileValid, setIsCsHostWebpageFileValid] = useState<boolean | 'spelling'>('spelling')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFileCsHostRequest, setSelectedFileCsHostRequest] = useState<File | null>(null)

  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const searchParams = useSearchParams()

  const inputCsRoastUrlRef = useRef<HTMLInputElement>(null)
  const inputCsGuestRef = useRef<HTMLInputElement>(null)
  const inputCsHostRef = useRef<HTMLInputElement>(null)
  const inputCsRoastFileRef = useRef<HTMLInputElement>(null)
  const inputCsHostReqFileRef = useRef<HTMLInputElement>(null)

  const isCsRoastInputEmpty = !!inputCsRoastUrlRef?.current?.value
  const isCsGuestInputEmpty = !!inputCsGuestRef?.current?.value
  const isCsHostInputEmpty = !!inputCsHostRef?.current?.value
  const isCsFileInputEmpty = !!inputCsRoastFileRef?.current?.value
  const isCsHostReqFileInputEmpty = !!inputCsHostReqFileRef?.current?.value

  useEffect(() => {
    const innerEffect = async () => {
      const url = searchParams.get('q')
      const lang = searchParams.get('lang')

      if (url?.length && !isCouchsurfingUrl(url)) {
        setCsRoast({ data: '', errMsg: AppMsg.INVALID_URL })
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

  const switchTab = (tabName: Tabs) => {
    setActiveTab(tabName)
    setCsRoast(null)
    setCsRequest(null)
    setIsWebpageFileValid('spelling')
    setIsCsHostWebpageFileValid('spelling')
    setIsRoastUrlValid('spelling')
    setIsGuestUrlValid('spelling')
    setIsHostUrlValid('spelling')
    setIsNonPublic(false)
    setIsCsHostNonPublic(false)
    setSelectedFile(null)
    setSelectedFileCsHostRequest(null)
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

  const handleCsReqFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      const allowedTypes = ['text/html', 'application/html', 'text/mhtml', 'application/mhtml', '.html', '.htm', '.mhtml']
      const maxFileSize = 1024 * 1024

      if (!allowedTypes.some((type) => file.type.includes(type) || file.name.endsWith(type.slice(1)))) {
        setSelectedFileCsHostRequest(null)
        setIsCsHostWebpageFileValid(false)
        return
      }

      if (file.size > maxFileSize) {
        setSelectedFileCsHostRequest(null)
        setIsCsHostWebpageFileValid(false)
        return
      }

      const reader = new FileReader()

      reader.onload = (e) => {
        const fileContent = e.target?.result as string
        if (/@Couchsurfing/.test(fileContent)) {
          setSelectedFileCsHostRequest(file)
          setCsRequest(null)
          setIsCsHostWebpageFileValid(true)
        } else {
          setSelectedFileCsHostRequest(null)
          setIsCsHostWebpageFileValid(false)
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
      setCsRoast({ data: '', errMsg: AppMsg.ERROR_SUBMITTING_FORM })
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

      let fileContent: string | undefined

      if (isCsHostNonPublic && selectedFileCsHostRequest) {
        fileContent = await selectedFileCsHostRequest.text()
      }

      startTransition(async () => {
        const data = await submitCsRequestForm({ csGuest, csHost, postcard, chocolate, cooking, fileContent })
        setCsRequest(data)
      })
    } catch (e) {
      setCsRequest({ data: '', errMsg: AppMsg.ERROR_SUBMITTING_FORM })
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

  const handleClearCsFileInput = () => {
    if (inputCsRoastFileRef.current) {
      inputCsRoastFileRef.current.value = ''
    }
    setSelectedFile(null)
    setIsWebpageFileValid('spelling')
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

  const handleClearCsHostReqFileInput = () => {
    if (inputCsHostReqFileRef.current) {
      inputCsHostReqFileRef.current.value = ''
    }
    setCsRequest(null)
    setIsCsHostWebpageFileValid('spelling')
  }

  const handleNonPublicChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsNonPublic(e.target.checked)
    setCsRoast(null)
    setIsRoastUrlValid('spelling')
    setIsWebpageFileValid('spelling')
  }

  const handleNonPublicCsReqChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsCsHostNonPublic(e.target.checked)
    setCsRequest(null)
    setIsHostUrlValid('spelling')
    setIsCsHostWebpageFileValid('spelling')
  }

  const isCsRoastDisabled =
    isPending ||
    (!isNonPublic && (!isRoastUrlValid || isRoastUrlValid === 'spelling')) ||
    (isNonPublic && (!isWebpageFileValid || isWebpageFileValid === 'spelling'))

  const isCsRequestDisabled =
    isPending ||
    (!isCsHostNonPublic && (!isGuestUrlValid || !isHostUrlValid || isGuestUrlValid === 'spelling' || isHostUrlValid === 'spelling')) ||
    (isCsHostNonPublic &&
      (!isCsHostWebpageFileValid || isCsHostWebpageFileValid === 'spelling' || !isGuestUrlValid || isGuestUrlValid === 'spelling'))

  return (
    <main className={`${styles.main} container`}>
      <AboutModal />

      <article className='tabs'>
        <header>
          <div role='group'>
            <button className={`${activeTab === 'cs-roast' ? '' : 'secondary'}`} onClick={() => switchTab('cs-roast')}>
              🔥 Roast Couchsurfer
            </button>
            <button className={`${activeTab === 'cs-request' ? '' : 'secondary'}`} onClick={() => switchTab('cs-request')}>
              ✨ Create CS Request
            </button>
          </div>
        </header>

        {activeTab === 'cs-roast' && (
          <>
            <form name='form' action={handleCreateCsRoastSubmit}>
              <div className={styles.container}>
                {isNonPublic ? (
                  <>
                    <label htmlFor='profile-webpage'>Select a Couchsurfing webpage:</label>
                    <div className={styles.container}>
                      {isCsFileInputEmpty && !isPending && (
                        <span className={styles.cross} onClick={handleClearCsFileInput}>
                          &#10799;
                        </span>
                      )}
                      <input
                        type='file'
                        name='profile-webpage'
                        accept='.html,.htm,.mhtml,text/html,text/mhtml'
                        onChange={handleFileChange}
                        aria-label='Couchsurfing profile webpage upload file'
                        disabled={isPending}
                        ref={inputCsRoastFileRef}
                        required
                        aria-invalid={isWebpageFileValid === 'spelling' ? 'spelling' : !isWebpageFileValid ? 'true' : 'false'}
                        aria-describedby='valid-helper'
                      />
                      {!isWebpageFileValid && <small id='valid-helper'>{AppMsg.INVALID_WEBPAGE}</small>}
                      {isWebpageFileValid && isWebpageFileValid !== 'spelling' && <small id='valid-helper'>{AppMsg.VALID_WEBPAGE}</small>}
                      {isPending && <span aria-busy className={styles.spinner}></span>}
                      <p>
                        <cite>
                          <small>Navigate to the Couchsurfing profile page and save it (using Ctrl+S or ⌘+S), then upload it here 👆</small>
                        </cite>
                      </p>
                    </div>
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
                      {!isRoastUrlValid && <small id='valid-helper'>{AppMsg.INVALID_URL}</small>}
                      {isRoastUrlValid && isRoastUrlValid !== 'spelling' && <small id='valid-helper'>{AppMsg.VALID_CS_URL}</small>}
                      {isPending && <span aria-busy className={styles.spinner}></span>}
                    </div>
                  </>
                )}
                <fieldset>
                  <label>
                    <input name='nonpublic' type='checkbox' role='switch' onChange={handleNonPublicChange} />
                    The Couchsurfing profile is nonpublic 🔒
                  </label>
                </fieldset>
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
          </>
        )}

        {activeTab === 'cs-request' && (
          <>
            <form name='requestForm' action={handleCreateCsReqSubmit}>
              <label htmlFor='csGuest'>Paste your Couchsurfing profile URL:</label>
              <div className={styles.container}>
                <input
                  type='url'
                  name='csGuest'
                  placeholder='https://couchsurfing.com/herol3oy'
                  aria-label='Couchsurfing profile guest url'
                  disabled={isPending}
                  ref={inputCsGuestRef}
                  minLength={22}
                  maxLength={300}
                  required
                  aria-invalid={isGuestUrlValid === 'spelling' ? 'spelling' : !isGuestUrlValid ? 'true' : 'false'}
                  onChange={handleGuestUrlChange}
                  aria-describedby='guest-valid-helper'
                />
                {!isGuestUrlValid && <small id='valid-helper'>{AppMsg.INVALID_URL}</small>}
                {isGuestUrlValid && isGuestUrlValid !== 'spelling' && <small id='valid-helper'>{AppMsg.VALID_CS_URL}</small>}

                {isPending && <span aria-busy className={styles.spinner}></span>}

                {isCsGuestInputEmpty && !isPending && (
                  <span className={styles.cross} onClick={handleClearUrlCSGuestInput}>
                    &#10799;
                  </span>
                )}
              </div>

              {isCsHostNonPublic ? (
                <>
                  <label htmlFor='profile-webpage'>Select a Couchsurfing webpage:</label>
                  <div className={styles.container}>
                    {isCsHostReqFileInputEmpty && !isPending && (
                      <span className={styles.cross} onClick={handleClearCsHostReqFileInput}>
                        &#10799;
                      </span>
                    )}
                    <input
                      type='file'
                      name='profile-webpage'
                      accept='.html,.htm,.mhtml,text/html,text/mhtml'
                      onChange={handleCsReqFileChange}
                      aria-label='Couchsurfing profile webpage upload file'
                      disabled={isPending}
                      ref={inputCsHostReqFileRef}
                      required
                      aria-invalid={isCsHostWebpageFileValid === 'spelling' ? 'spelling' : !isCsHostWebpageFileValid ? 'true' : 'false'}
                      aria-describedby='valid-helper'
                    />
                    {!isCsHostWebpageFileValid && <small id='valid-helper'>{AppMsg.INVALID_WEBPAGE}</small>}
                    {isCsHostWebpageFileValid && isCsHostWebpageFileValid !== 'spelling' && <small id='valid-helper'>{AppMsg.VALID_WEBPAGE}</small>}
                    {isPending && <span aria-busy className={styles.spinner}></span>}
                    <p>
                      <cite>
                        <small>Navigate to the Couchsurfing profile page and save it (using Ctrl+S or ⌘+S), then upload it here 👆</small>
                      </cite>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <label htmlFor='csHost'>Paste your future Couchsurfing host profile URL:</label>
                  <div className={styles.container}>
                    {isCsHostInputEmpty && !isPending && (
                      <span className={styles.cross} onClick={handleClearUrlCsHostInput}>
                        &#10799;
                      </span>
                    )}
                    <input
                      type='url'
                      name='csHost'
                      placeholder='https://couchsurfing.com/casey'
                      aria-label='Couchsurfing profile host url'
                      disabled={isPending}
                      ref={inputCsHostRef}
                      minLength={22}
                      maxLength={300}
                      required
                      aria-invalid={isHostUrlValid === 'spelling' ? 'spelling' : !isHostUrlValid ? 'true' : 'false'}
                      onChange={handleHostUrlChange}
                      aria-describedby='host-valid-helper'
                    />
                    {!isHostUrlValid && <small id='valid-helper'>{AppMsg.INVALID_URL}</small>}
                    {isHostUrlValid && isHostUrlValid !== 'spelling' && <small id='valid-helper'>{AppMsg.VALID_CS_URL}</small>}
                    {isPending && <span aria-busy className={styles.spinner}></span>}
                  </div>
                </>
              )}

              <fieldset>
                <label>
                  <input name='nonpublic-cs-host-req' type='checkbox' role='switch' onChange={handleNonPublicCsReqChange} />
                  The Couchsurfing profile is nonpublic 🔒
                </label>
              </fieldset>

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
          </>
        )}
      </article>
    </main>
  )
}
