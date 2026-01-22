import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast, toast } from '@/hooks/use-toast'

describe('useToast', () => {
  beforeEach(() => {
    // Clear memory state before each test
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.dismiss()
    })
  })

  it('initializes with empty toasts', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.toasts).toHaveLength(0)
  })

  it('can show a toast notification', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Test notification',
        description: 'This is a test',
      })
    })

    expect(result.current.toasts.length).toBeGreaterThan(0)
    expect(result.current.toasts[0]).toHaveProperty('title', 'Test notification')
  })

  it('has dismiss function available', () => {
    const { result } = renderHook(() => useToast())
    expect(typeof result.current.dismiss).toBe('function')
  })

  describe('Toast Actions', () => {
    it('can dismiss a specific toast by id', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        const toastResult = result.current.toast({
          title: 'Test toast',
        })
        expect(toastResult).toHaveProperty('id')
        expect(toastResult).toHaveProperty('dismiss')
        expect(toastResult).toHaveProperty('update')

        // Dismiss by id
        result.current.dismiss(toastResult.id)
      })

      expect(result.current.toasts[0].open).toBe(false)
    })

    it('can dismiss all toasts', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Toast 1' })
        result.current.toast({ title: 'Toast 2' })

        // Dismiss all
        result.current.dismiss()
      })

      // All toasts should be marked as closed
      result.current.toasts.forEach((toast) => {
        expect(toast.open).toBe(false)
      })
    })

    it('can update an existing toast', () => {
      const { result } = renderHook(() => useToast())

      let toastId: string

      act(() => {
        const toastResult = result.current.toast({
          title: 'Original title',
          description: 'Original description',
        })
        toastId = toastResult.id

        // Update the toast
        toastResult.update({
          title: 'Updated title',
          description: 'Updated description',
        })
      })

      const updatedToast = result.current.toasts.find((t) => t.id === toastId)
      expect(updatedToast).toHaveProperty('title', 'Updated title')
      expect(updatedToast).toHaveProperty('description', 'Updated description')
    })

    it('toast function returns correct API', () => {
      const { result } = renderHook(() => useToast())

      let toastResult: ReturnType<typeof toast>

      act(() => {
        toastResult = result.current.toast({
          title: 'Test',
        })
      })

      expect(toastResult).toHaveProperty('id')
      expect(typeof toastResult!.id).toBe('string')
      expect(toastResult).toHaveProperty('dismiss')
      expect(typeof toastResult!.dismiss).toBe('function')
      expect(toastResult).toHaveProperty('update')
      expect(typeof toastResult!.update).toBe('function')
    })

    it('can dismiss a toast using its returned dismiss function', () => {
      const { result } = renderHook(() => useToast())

      let toastResult: ReturnType<typeof toast>

      act(() => {
        toastResult = result.current.toast({
          title: 'Test toast',
        })
        toastResult!.dismiss()
      })

      expect(result.current.toasts[0].open).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('handles multiple toast creations', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        for (let i = 0; i < 3; i++) {
          result.current.toast({
            title: `Toast ${i}`,
          })
        }
      })

      // Due to TOAST_LIMIT = 1, only 1 toast should exist
      expect(result.current.toasts.length).toBe(1)
    })

    it('handles toast with all optional properties', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({
          title: 'Full Toast',
          description: 'Description',
          variant: 'destructive',
        })
      })

      expect(result.current.toasts[0]).toHaveProperty('title', 'Full Toast')
      expect(result.current.toasts[0]).toHaveProperty('description')
    })

    it('generates unique IDs for toasts', () => {
      const { result } = renderHook(() => useToast())

      const ids: string[] = []

      act(() => {
        // Create toast 1
        const toast1 = result.current.toast({ title: '1' })
        ids.push(toast1.id)

        // Dismiss and create toast 2
        toast1.dismiss()
        const toast2 = result.current.toast({ title: '2' })
        ids.push(toast2.id)
      })

      // IDs should be unique (incrementing)
      expect(ids[0]).not.toBe(ids[1])
    })

    it('handles empty toast object', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({})
      })

      expect(result.current.toasts.length).toBeGreaterThan(0)
    })
  })

  describe('State Management', () => {
    it('multiple hooks share the same state', () => {
      const { result: result1 } = renderHook(() => useToast())
      const { result: result2 } = renderHook(() => useToast())

      act(() => {
        result1.current.toast({
          title: 'From hook 1',
        })
      })

      // Both hooks should see the same toast
      expect(result1.current.toasts.length).toBeGreaterThan(0)
      expect(result2.current.toasts.length).toBeGreaterThan(0)
      expect(result1.current.toasts[0].id).toBe(result2.current.toasts[0].id)
    })

    it('cleanup removes listener on unmount', () => {
      const { result, unmount } = renderHook(() => useToast())

      act(() => {
        result.current.toast({
          title: 'Before unmount',
        })
      })

      const toastCount = result.current.toasts.length
      expect(toastCount).toBeGreaterThan(0)

      // Unmount should not throw
      expect(() => unmount()).not.toThrow()
    })
  })
})
