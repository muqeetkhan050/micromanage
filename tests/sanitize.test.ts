import { describe, it, expect } from 'vitest'
import { sanitize } from '../lib/sanitize'

describe('sanitize', () => {
  it('strips HTML tags', () => {
    expect(sanitize('<script>alert("xss")</script>')).toBe('')
  })

  it('keeps plain text', () => {
    expect(sanitize('Hello World')).toBe('Hello World')
  })

  it('strips nested HTML', () => {
    expect(sanitize('<b><i>bold italic</i></b>')).toBe('bold italic')
  })
})
