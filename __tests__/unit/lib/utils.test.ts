import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn (utility function)', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('deduplicates Tailwind classes', () => {
    expect(cn('p-4', 'p-4', 'text-blue-500')).toBe('p-4 text-blue-500')
  })

  it('handles undefined and null values', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })

  it('merges conflicting Tailwind classes correctly', () => {
    expect(cn('text-blue-500', 'text-red-500')).toBe('text-red-500')
  })
})
