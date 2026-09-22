import { useEffect, useState } from 'react'

const STORAGE_KEY = 'pdf-marketplace-mode'

export function useMarketplaceMode() {
  const [mode, setModeState] = useState(() => {
    if (typeof window === 'undefined') {
      return 'customer'
    }

    return window.localStorage.getItem(STORAGE_KEY) || 'customer'
  })

  const setMode = (nextMode) => {
    setModeState(nextMode)
    window.localStorage.setItem(STORAGE_KEY, nextMode)
  }

  useEffect(() => {
    const storedMode = window.localStorage.getItem(STORAGE_KEY)

    if (storedMode && storedMode !== mode) {
      setModeState(storedMode)
    }
  }, [mode])

  return {
    isCustomerMode: mode === 'customer',
    isSellerMode: mode === 'seller',
    mode,
    setMode,
  }
}
