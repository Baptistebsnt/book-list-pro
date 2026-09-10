import { useEffect, useState } from "react"

const TICK_MS = 1000

export const useCountdown = (seconds: number): number => {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((current) => Math.max(current - 1, 0))
    }, TICK_MS)

    return () => clearInterval(interval)
  }, [])

  return remaining
}
