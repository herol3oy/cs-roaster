import { describe, expect, test } from 'vitest'

import { isCouchsurfingUrl } from './is-couchsurfing-url'

describe('isCouchsurfingUrl', () => {
  describe('valid URLs', () => {
    test.each(VALID_URLS)('%s returns true', (url) => {
      expect(isCouchsurfingUrl(url)).toBe(true)
    })
  })

  describe('invalid URLs', () => {
    test.each(INVALID_URLS)('%s returns false', (url) => {
      expect(isCouchsurfingUrl(url)).toBe(false)
    })
  })
})

const VALID_URLS = [
  'https://www.couchsurfing.com/user',
  'https://couchsurfing.com/people/user',
  'https://couchsurfing.com/people/user/',
  'https://www.couchsurfing.com/people/user/',
  'https://www.couchsurfing.com/user/',
  'https://www.couchsurfing.com/0/',
  'https://www.couchsurfing.com/0a/',
  'https://couchsurfing.com/users/470731/',
  'https://couchsurfing.com/people/?q=abc',
  'https://couchsurfing.com/people/?q=abc/',
  'https://couchsurfing.com/user/',
  'https://CouchSurfing.com/user',
  'https://WWW.COUCHSURFING.COM/USER',
  'https://couchsurfing.com/user?',
  'https://couchsurfing.com/0',
  'https://www.couchsurfing.com/1',
  'https://www.couchsurfing.com/23',
  'https://www.couchsurfing.com/345',
  'https://www.couchsurfing.com/5678',
  'https://www.couchsurfing.com/470792',
  'https://www.couchsurfing.com/0a',
  'https://www.couchsurfing.com/00a',
  'https://www.couchsurfing.com/00',
  'http://couchsurfing.com/user#',
  'https://www.couchsurfing.com/user?q=123',
  'https://www.couchsurfing.com/users/1234567',
  'https://www.couchsurfing.com/users/1992251?utm_campaign=profile_share&utm_source=couchsurfing-ios',
  'https://couchsurfing.page.link/Vq1hCbAff9cDv2Jo8',
]

const INVALID_URLS = [
  'https://www.subdomain.couchsurfing.com/user',
  'https://subdomain.couchsurfing.com',
  'htp://www.couchsurfing.com/user',
  'htp://www.couchsurfing.com/123',
  'https://couchsurfing.org/user',
  'https://www.couchsurfing.com/',
  'https://www.couchsurfing.com',
  'https://couchsurfing.com/',
  'https://couchsurfing.com',
  'https://example.com',
  'www.couchsurfing.com',
  'www.example.com',
  'couchsurfing.com',
  'abc',
  '123',
  '!@#',
]
