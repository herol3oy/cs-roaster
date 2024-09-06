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
  'https://CouchSurfing.com/user',
  'https://WWW.COUCHSURFING.COM/USER',
  'https://couchsurfing.com/user?',
  'http://couchsurfing.com/user#',
  'https://www.couchsurfing.com/user?q=123',
  'https://couchsurfing.com/people/?q=abc',
  'https://www.couchsurfing.com/users/1992251?utm_campaign=profile_share&utm_source=couchsurfing-ios',
]

const INVALID_URLS = [
  'https://www.subdomain.couchsurfing.com/user',
  'https://subdomain.couchsurfing.com',
  'htp://www.couchsurfing.com/user',
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
