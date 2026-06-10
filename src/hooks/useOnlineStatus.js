/**
 * useOnlineStatus.js — Detecta conectividade de rede em tempo real
 *
 * Usa eventos nativos `online` / `offline` do window para rastrear
 * a disponibilidade de internet. Garante que o valor inicial reflete
 * o estado real de `navigator.onLine`.
 */

import { useState, useEffect } from 'react'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const handleOnline  = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
