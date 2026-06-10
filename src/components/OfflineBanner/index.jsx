/**
 * OfflineBanner — Toast de notificação de estado de rede
 *
 * Aparece quando o usuário fica offline e some após 3s ao reconectar.
 * Usa aria-live para anunciar mudanças para leitores de tela.
 */

import { useState, useEffect } from 'react'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import styles from './OfflineBanner.module.css'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()
  const [visible, setVisible]       = useState(false)
  const [message, setMessage]       = useState('')
  const [isOffline, setIsOffline]   = useState(false)

  useEffect(() => {
    let hideTimer = null

    if (!isOnline) {
      // Ficou offline — mostra imediatamente
      setMessage('Sem conexão com a internet')
      setIsOffline(true)
      setVisible(true)
      clearTimeout(hideTimer)
    } else if (isOffline) {
      // Reconectou — troca mensagem e esconde após 3s
      setMessage('Conexão restaurada')
      setIsOffline(false)
      setVisible(true)
      hideTimer = setTimeout(() => setVisible(false), 3_000)
    }

    return () => clearTimeout(hideTimer)
  }, [isOnline]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`${styles.banner} ${visible ? styles.visible : ''}`}
    >
      <span
        className={`${styles.dot} ${isOffline ? styles.dotOffline : styles.dotOnline}`}
        aria-hidden="true"
      />
      {message}
    </div>
  )
}
