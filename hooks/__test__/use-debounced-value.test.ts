import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useDebouncedValue } from "../use-debounced-value"

const DELAY_MS = 300

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns the initial value straight away", () => {
    const { result } = renderHook(() => useDebouncedValue("dune", DELAY_MS))

    expect(result.current).toBe("dune")
  })

  it("keeps the previous value until the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, DELAY_MS),
      { initialProps: { value: "" } },
    )

    rerender({ value: "dune" })

    expect(result.current).toBe("")

    act(() => {
      vi.advanceTimersByTime(DELAY_MS)
    })

    expect(result.current).toBe("dune")
  })

  it("settles once on the last value when it changes at every keystroke", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, DELAY_MS),
      { initialProps: { value: "" } },
    )

    ;["d", "du", "dun", "dune"].forEach((value) => {
      rerender({ value })

      act(() => {
        vi.advanceTimersByTime(DELAY_MS / 2)
      })
    })

    expect(result.current).toBe("")

    act(() => {
      vi.advanceTimersByTime(DELAY_MS)
    })

    expect(result.current).toBe("dune")
  })
})
