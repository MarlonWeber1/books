/**
 * ThemeToggle — Botão de alternância escuro/claro
 *
 * Animação: o ícone faz rotate(-30deg) + scale(0.8) → rotate(0) + scale(1)
 * ao entrar, usando requestAnimationFrame para garantir que o browser
 * registre a mudança entre os dois frames.
 *
 * Design Emil Kowalski: sem bounce, ease-out nítido, ativo em scale(0.93).
 */

import { useState, useEffect } from 'react'
import { Moon, Sun } from '@phosphor-icons/react'
import styles from './ThemeToggle.module.css'

export function ThemeToggle({ isDark, onToggle }) {
  const [iconClass, setIconClass] = useState(styles.stable)

  function handleClick() {
    // Dispara a animação de entrada antes de trocar o ícone
    setIconClass(styles.entering)
    // Dois frames: primeiro aplica entering, depois stable (com o novo ícone)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIconClass(styles.stable)
      })
    })
    onToggle()
  }

  // Garante estado estável na montagem
  useEffect(() => { setIconClass(styles.stable) }, [])

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={handleClick}
      aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      title={isDark ? 'Modo claro' : 'Modo escuro'}
    >
      <span className={`${styles.icon} ${iconClass}`} aria-hidden="true">
        {isDark
          ? <Sun  size={17} weight="bold" />
          : <Moon size={17} weight="bold" />
        }
      </span>
    </button>
  )
}
